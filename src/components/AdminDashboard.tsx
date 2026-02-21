import React, { useState, useEffect } from 'react';
import { ContractRecord, BrandingConfig, Seller } from '../types';
import { Download, Search, LogOut, FileText, Settings, Link as LinkIcon, Check, Filter, RefreshCw } from 'lucide-react';
import { generatePDF } from '../utils/pdfGenerator';

interface AdminDashboardProps {
  onLogout: () => void;
  onSettings: () => void;
  branding: BrandingConfig;
  adminPassword: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout, onSettings, branding, adminPassword }) => {
  const [contracts, setContracts] = useState<any[]>([]);
  const [sellers, setSellers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const fetchContracts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedSeller) {
        params.append('seller_code', selectedSeller);
      }

      const response = await fetch(`/api/contracts?${params}`, {
        headers: {
          'X-Admin-Password': adminPassword,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setContracts(data);
      } else {
        console.error('Failed to fetch contracts');
      }
    } catch (error) {
      console.error('Error fetching contracts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSellers = async () => {
    try {
      const response = await fetch('/api/sellers', {
        headers: {
          'X-Admin-Password': adminPassword,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSellers(data);
      }
    } catch (error) {
      console.error('Error fetching sellers:', error);
    }
  };

  useEffect(() => {
    fetchContracts();
    fetchSellers();
  }, [selectedSeller]);

  const handleStatusChange = async (contractId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/contracts/${contractId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Password': adminPassword,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchContracts(); // Refresh list
      } else {
        console.error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const filteredContracts = contracts.filter(c => {
    const matchesSearch = 
      c.student_full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.student_national_id?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleDownload = async (contract: any, withStamp: boolean) => {
    const studentInfo = {
      fullName: contract.student_full_name,
      nationalId: contract.student_national_id,
      birthDate: contract.student_birth_date,
      phone: contract.student_phone,
      email: contract.student_email,
      guardianName: contract.guardian_name,
      guardianId: contract.guardian_id,
      program: contract.program,
      fees: {
        dossier: parseFloat(contract.fees_dossier) || 0,
        serviceBase: parseFloat(contract.fees_service) || 0,
        total: parseFloat(contract.fees_total) || 0,
        originalServiceBase: 0,
        serviceDiscounted: 0,
        discountAmount: 0,
      },
    };

    await generatePDF(studentInfo, contract.signature_data, withStamp, branding);
  };

  const copyCustomerLink = () => {
    const url = window.location.origin + window.location.pathname + '?student=1';
    navigator.clipboard.writeText(url);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      signed: 'bg-green-100 text-green-800 border-green-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      rejected: 'bg-red-100 text-red-800 border-red-200',
    };

    const labels = {
      signed: 'موقع',
      pending: 'قيد الانتظار',
      rejected: 'مرفوض',
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${styles[status as keyof typeof styles] || styles.signed}`}>
        {labels[status as keyof typeof labels] || status}
      </span>
    );
  };

  const getSellerStats = () => {
    const stats: Record<string, number> = {};
    contracts.forEach(c => {
      const seller = c.seller_code || 'no_seller';
      stats[seller] = (stats[seller] || 0) + 1;
    });
    return stats;
  };

  const sellerStats = getSellerStats();

  return (
    <div className="min-h-screen bg-zinc-50 p-6 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">لوحة التحكم</h1>
            <p className="text-zinc-500 mt-1">إدارة العقود الموقعة</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={copyCustomerLink}
              className="flex items-center gap-2 text-zinc-800 bg-white border border-zinc-200 hover:bg-zinc-50 px-4 py-2.5 rounded-xl transition-colors shadow-sm font-medium text-sm"
            >
              {linkCopied ? <Check size={18} /> : <LinkIcon size={18} />}
              <span>{linkCopied ? 'تم النسخ' : 'نسخ رابط الطالب'}</span>
            </button>
            <button 
              onClick={onSettings}
              className="flex items-center gap-2 text-zinc-600 bg-white border border-zinc-200 hover:bg-zinc-50 px-4 py-2.5 rounded-xl transition-colors shadow-sm font-medium text-sm"
            >
              <Settings size={18} />
              <span>الإعدادات</span>
            </button>
            <button 
              onClick={onLogout}
              className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-4 py-2.5 rounded-xl transition-colors font-medium text-sm"
            >
              <LogOut size={18} />
              <span>تسجيل خروج</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-[1.5rem] shadow-card border border-zinc-200 overflow-hidden">
          <div className="p-5 border-b border-zinc-100 flex flex-wrap gap-4">
            <div className="relative flex-1 min-w-[250px]">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
              <input 
                type="text" 
                placeholder="بحث بالاسم أو رقم البطاقة..." 
                className="w-full pl-4 pr-12 py-3 border-2 border-zinc-100 rounded-xl focus:border-black focus:outline-none transition-colors bg-zinc-50 focus:bg-white text-zinc-900 placeholder:text-zinc-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              value={selectedSeller}
              onChange={(e) => setSelectedSeller(e.target.value)}
              className="px-4 py-3 border-2 border-zinc-100 rounded-xl focus:border-black focus:outline-none transition-colors bg-zinc-50 focus:bg-white text-zinc-900"
            >
              <option value="">جميع البائعين</option>
              {sellers.filter(s => s.is_active).map(seller => (
                <option key={seller.id} value={seller.code}>
                  {seller.name} ({sellerStats[seller.code] || 0})
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border-2 border-zinc-100 rounded-xl focus:border-black focus:outline-none transition-colors bg-zinc-50 focus:bg-white text-zinc-900"
            >
              <option value="all">جميع الحالات</option>
              <option value="signed">موقع</option>
              <option value="pending">قيد الانتظار</option>
              <option value="rejected">مرفوض</option>
            </select>

            <button
              onClick={fetchContracts}
              className="px-4 py-3 bg-zinc-100 hover:bg-zinc-200 rounded-xl transition-colors"
              title="تحديث"
            >
              <RefreshCw size={20} />
            </button>

            <div className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl shadow-lg">
              <span className="font-bold text-lg">{filteredContracts.length}</span>
              <span className="text-xs opacity-80">عقد</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-zinc-50/50 text-zinc-500 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-medium">الطالب</th>
                  <th className="px-6 py-4 font-medium">تاريخ التوقيع</th>
                  <th className="px-6 py-4 font-medium">رقم الهاتف</th>
                  <th className="px-6 py-4 font-medium">البائع</th>
                  <th className="px-6 py-4 font-medium">الحالة</th>
                  <th className="px-6 py-4 font-medium text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center text-zinc-400">
                      جاري التحميل...
                    </td>
                  </tr>
                ) : filteredContracts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center text-zinc-400">
                      لا توجد عقود مطابقة للبحث
                    </td>
                  </tr>
                ) : (
                  filteredContracts.map((contract) => (
                    <tr key={contract.id} className="hover:bg-zinc-50/80 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-bold text-zinc-900">{contract.student_full_name}</div>
                        <div className="text-xs text-zinc-400 font-mono mt-1">{contract.student_national_id}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-600">
                        {new Date(contract.signed_at || contract.created_at).toLocaleDateString('ar-MA', {
                          year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-600 dir-ltr text-right">
                        {contract.student_phone}
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-600">
                        {contract.seller_name ? (
                          <div>
                            <div className="font-medium">{contract.seller_name}</div>
                            <div className="text-xs text-zinc-400">{contract.seller_code}</div>
                          </div>
                        ) : (
                          <span className="text-zinc-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={contract.status}
                          onChange={(e) => handleStatusChange(contract.id, e.target.value)}
                          className="text-xs font-bold bg-transparent border-0 focus:outline-none cursor-pointer"
                        >
                          <option value="signed">موقع</option>
                          <option value="pending">قيد الانتظار</option>
                          <option value="rejected">مرفوض</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleDownload(contract, false)}
                            className="p-2 text-zinc-500 hover:text-black hover:bg-zinc-200 rounded-lg transition-colors tooltip"
                            title="نسخة العميل"
                          >
                            <FileText size={18} />
                          </button>
                          <button 
                            onClick={() => handleDownload(contract, true)}
                            className="p-2 text-zinc-500 hover:text-black hover:bg-zinc-200 rounded-lg transition-colors tooltip"
                            title="نسخة رسمية (مختومة)"
                          >
                            <Download size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

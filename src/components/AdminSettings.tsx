import React, { useState, useEffect } from 'react';
import { BrandingConfig, PricingConfig, Seller } from '../types';
import { Upload, Save, ArrowRight, Image as ImageIcon, Check, Phone, DollarSign, LayoutTemplate, CreditCard, Users, Link as LinkIcon, Trash2, Plus } from 'lucide-react';

interface AdminSettingsProps {
  currentBranding: BrandingConfig;
  currentPricing: PricingConfig;
  onSaveBranding: (newConfig: BrandingConfig) => void;
  onSavePricing: (newConfig: PricingConfig) => void;
  onBack: () => void;
  adminPassword: string;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({ 
  currentBranding, 
  currentPricing, 
  onSaveBranding, 
  onSavePricing, 
  onBack,
  adminPassword 
}) => {
  const [activeTab, setActiveTab] = useState<'branding' | 'pricing' | 'sellers'>('branding');
  const [branding, setBranding] = useState<BrandingConfig>(currentBranding);
  const [pricing, setPricing] = useState<PricingConfig>(currentPricing);
  const [sellers, setSellers] = useState<any[]>([]);
  const [msg, setMsg] = useState('');
  const [newSeller, setNewSeller] = useState({ code: '', name: '', email: '', phone: '' });
  const [showAddSeller, setShowAddSeller] = useState(false);
  const [copiedLink, setCopiedLink] = useState('');

  useEffect(() => {
    if (activeTab === 'sellers') {
      fetchSellers();
    }
  }, [activeTab]);

  const fetchSellers = async () => {
    try {
      const response = await fetch('/api/sellers', {
        headers: { 'X-Admin-Password': adminPassword },
      });
      if (response.ok) {
        const data = await response.json();
        setSellers(data);
      }
    } catch (error) {
      console.error('Error fetching sellers:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, key: keyof BrandingConfig) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBranding(prev => ({ ...prev, [key]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (activeTab === 'branding') {
      onSaveBranding(branding);
      setMsg('تم حفظ إعدادات العلامة التجارية بنجاح');
    } else if (activeTab === 'pricing') {
      onSavePricing(pricing);
      setMsg('تم حفظ جدول الأسعار بنجاح');
    }
    setTimeout(() => setMsg(''), 3000);
  };

  const handleAddSeller = async () => {
    if (!newSeller.code || !newSeller.name) {
      alert('الرجاء إدخال الكود والاسم');
      return;
    }

    try {
      const response = await fetch('/api/sellers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Password': adminPassword,
        },
        body: JSON.stringify(newSeller),
      });

      if (response.ok) {
        setMsg('تمت إضافة البائع بنجاح');
        setNewSeller({ code: '', name: '', email: '', phone: '' });
        setShowAddSeller(false);
        fetchSellers();
        setTimeout(() => setMsg(''), 3000);
      } else {
        const error = await response.json();
        alert(error.error || 'فشل في إضافة البائع');
      }
    } catch (error) {
      console.error('Error adding seller:', error);
      alert('حدث خطأ أثناء إضافة البائع');
    }
  };

  const handleDeleteSeller = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا البائع؟')) return;

    try {
      const response = await fetch(`/api/sellers/${id}`, {
        method: 'DELETE',
        headers: { 'X-Admin-Password': adminPassword },
      });

      if (response.ok) {
        setMsg('تم حذف البائع بنجاح');
        fetchSellers();
        setTimeout(() => setMsg(''), 3000);
      }
    } catch (error) {
      console.error('Error deleting seller:', error);
    }
  };

  const copySellerLink = (sellerCode: string) => {
    const url = `${window.location.origin}?seller=${sellerCode}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(sellerCode);
    setTimeout(() => setCopiedLink(''), 2000);
  };

  const UploadField = ({ label, fieldKey, previewUrl }: { label: string, fieldKey: keyof BrandingConfig, previewUrl: string }) => (
    <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex justify-between items-start mb-4">
        <label className="font-bold text-zinc-900 flex items-center gap-2">
          <ImageIcon size={20} className="text-black" />
          {label}
        </label>
        <div>
          <label 
            htmlFor={`upload-${fieldKey}`}
            className="text-sm bg-zinc-100 hover:bg-zinc-200 text-zinc-700 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2 cursor-pointer font-medium"
          >
            <Upload size={14} />
            <span>تغيير</span>
          </label>
        </div>
      </div>
      
      <label 
        htmlFor={`upload-${fieldKey}`}
        className="block bg-zinc-50 border-2 border-dashed border-zinc-200 rounded-lg p-4 h-48 flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer hover:border-zinc-400 hover:bg-zinc-100/50 transition-all"
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity bg-white/60 backdrop-blur-[2px]">
           <Upload size={24} className="text-black mb-2" />
           <span className="text-xs font-bold text-black uppercase tracking-wider">انقر لرفع صورة</span>
        </div>

        <img 
          src={previewUrl} 
          alt={label} 
          className="max-h-full max-w-full object-contain relative z-10 transition-transform group-hover:scale-95"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNjY2MiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cmVjdCB4PSIzIiB5PSIzIiB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHJ4PSIyIiByeT0iMiIvPjxjaXJjbGUgY3g9IjguNSIgY3k9IjguNSIgcj0iMS41Ii8+PHBvbHlsaW5lIHBvaW50cz0iMjEgMTUgMTYgMTAgNSAyMSIvPjwvc3ZnPg==';
          }}
        />
      </label>
      
      <input 
        id={`upload-${fieldKey}`}
        type="file" 
        accept="image/*" 
        onChange={(e) => handleFileChange(e, fieldKey)}
        className="hidden"
      />
    </div>
  );

  const PricingInput = ({ label, value, onChange, prefix = 'درهم' }: any) => (
    <div className="flex flex-col gap-1">
      <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wide">{label}</label>
      <div className="relative">
        <input 
          type="number"
          value={value}
          onChange={onChange}
          className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:border-black focus:outline-none transition-all"
          dir="ltr"
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-xs">{prefix}</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-50 p-6 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">الإعدادات</h1>
            <p className="text-zinc-500 mt-1">تخصيص المنصة والعقود</p>
          </div>
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-zinc-600 hover:text-black hover:bg-zinc-200 px-5 py-2.5 rounded-xl transition-colors font-medium"
          >
            <span>العودة للوحة التحكم</span>
            <ArrowRight size={18} className="rotate-180" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 bg-zinc-200/50 rounded-xl mb-8 w-fit mx-auto md:mx-0">
          <button 
            onClick={() => setActiveTab('branding')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'branding' ? 'bg-white shadow-sm text-black' : 'text-zinc-500 hover:text-black'}`}
          >
            <LayoutTemplate size={16} />
            <span>العلامة التجارية</span>
          </button>
          <button 
            onClick={() => setActiveTab('pricing')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'pricing' ? 'bg-white shadow-sm text-black' : 'text-zinc-500 hover:text-black'}`}
          >
            <CreditCard size={16} />
            <span>جدول الأسعار</span>
          </button>
          <button 
            onClick={() => setActiveTab('sellers')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'sellers' ? 'bg-white shadow-sm text-black' : 'text-zinc-500 hover:text-black'}`}
          >
            <Users size={16} />
            <span>البائعين</span>
          </button>
        </div>

        {msg && (
          <div className="bg-green-100 text-green-900 border border-green-200 p-4 rounded-xl mb-8 flex items-center gap-3 animate-fade-in shadow-sm">
            <div className="bg-green-200 p-1 rounded-full">
              <Check size={16} />
            </div>
            <span className="font-bold">{msg}</span>
          </div>
        )}

        {activeTab === 'branding' && (
          <div className="animate-fade-in space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <UploadField label="شعار الشركة (الرئيسي)" fieldKey="logoUrl" previewUrl={branding.logoUrl} />
              <UploadField label="الختم الرسمي (للتوقيع)" fieldKey="stampUrl" previewUrl={branding.stampUrl} />
              <UploadField label="العلامة المائية (للخلفية)" fieldKey="watermarkUrl" previewUrl={branding.watermarkUrl} />
            </div>

            <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-card">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
                  <Phone size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-zinc-900">إعدادات واتساب</h3>
                  <p className="text-xs text-zinc-500">رقم الهاتف المستخدم لاستقبال العقود</p>
                </div>
              </div>
              
              <div className="max-w-md">
                <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-2">
                  رقم الهاتف (مع الرمز الدولي)
                </label>
                <input 
                  type="text" 
                  value={branding.companyPhone || ''}
                  onChange={(e) => setBranding(prev => ({ ...prev, companyPhone: e.target.value }))}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-lg focus:border-black focus:outline-none transition-all dir-ltr"
                  placeholder="212600000000"
                  dir="ltr"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'pricing' && (
          <div className="animate-fade-in space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-card">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><DollarSign size={18}/> البرامج الأساسية</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200">
                  <h4 className="font-bold mb-3 text-sm">البكالوريوس</h4>
                  <div className="space-y-3">
                    <PricingInput label="مصاريف الملف" value={pricing.bachelor.fileFees} onChange={(e: any) => setPricing({...pricing, bachelor: {...pricing.bachelor, fileFees: Number(e.target.value)}})} />
                    <PricingInput label="مصاريف الخدمة" value={pricing.bachelor.serviceFees} onChange={(e: any) => setPricing({...pricing, bachelor: {...pricing.bachelor, serviceFees: Number(e.target.value)}})} />
                    <PricingInput label="السعر الأصلي (قبل الخصم)" value={pricing.bachelor.originalPrice} onChange={(e: any) => setPricing({...pricing, bachelor: {...pricing.bachelor, originalPrice: Number(e.target.value)}})} />
                  </div>
                </div>
                <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200">
                  <h4 className="font-bold mb-3 text-sm">الماستر والدكتوراه</h4>
                  <div className="space-y-3">
                    <PricingInput label="مصاريف الملف" value={pricing.master.fileFees} onChange={(e: any) => setPricing({...pricing, master: {...pricing.master, fileFees: Number(e.target.value)}})} />
                    <PricingInput label="مصاريف الخدمة" value={pricing.master.serviceFees} onChange={(e: any) => setPricing({...pricing, master: {...pricing.master, serviceFees: Number(e.target.value)}})} />
                    <PricingInput label="السعر الأصلي (قبل الخصم)" value={pricing.master.originalPrice} onChange={(e: any) => setPricing({...pricing, master: {...pricing.master, originalPrice: Number(e.target.value)}})} />
                  </div>
                </div>
                <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200">
                  <h4 className="font-bold mb-3 text-sm">دورة مارس + شتنبر</h4>
                  <div className="space-y-3">
                    <PricingInput label="مصاريف الملف" value={pricing.special.fileFees} onChange={(e: any) => setPricing({...pricing, special: {...pricing.special, fileFees: Number(e.target.value)}})} />
                    <PricingInput label="مصاريف الخدمة" value={pricing.special.serviceFees} onChange={(e: any) => setPricing({...pricing, special: {...pricing.special, serviceFees: Number(e.target.value)}})} />
                    <PricingInput label="السعر الأصلي (قبل الخصم)" value={pricing.special.originalPrice} onChange={(e: any) => setPricing({...pricing, special: {...pricing.special, originalPrice: Number(e.target.value)}})} />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-card">
              <h3 className="text-lg font-bold mb-4">رسوم أخرى</h3>
              <div className="grid md:grid-cols-2 gap-6 max-w-lg">
                <PricingInput label="إعادة التقديم (بعد السنة التحضيرية)" value={pricing.reapplication} onChange={(e: any) => setPricing({...pricing, reapplication: Number(e.target.value)})} />
                <PricingInput label="السعر الأصلي إعادة التقديم" value={pricing.reapplicationOriginal} onChange={(e: any) => setPricing({...pricing, reapplicationOriginal: Number(e.target.value)})} />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sellers' && (
          <div className="animate-fade-in space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-card">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold">قائمة البائعين</h3>
                <button
                  onClick={() => setShowAddSeller(!showAddSeller)}
                  className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl hover:bg-zinc-800 transition-colors"
                >
                  <Plus size={18} />
                  <span>إضافة بائع</span>
                </button>
              </div>

              {showAddSeller && (
                <div className="bg-zinc-50 p-6 rounded-xl mb-6 border border-zinc-200">
                  <h4 className="font-bold mb-4">بائع جديد</h4>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <input
                      type="text"
                      placeholder="الكود (مثال: houda)"
                      value={newSeller.code}
                      onChange={(e) => setNewSeller({ ...newSeller, code: e.target.value.toLowerCase() })}
                      className="px-4 py-2 border border-zinc-200 rounded-lg focus:border-black focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="الاسم الكامل"
                      value={newSeller.name}
                      onChange={(e) => setNewSeller({ ...newSeller, name: e.target.value })}
                      className="px-4 py-2 border border-zinc-200 rounded-lg focus:border-black focus:outline-none"
                    />
                    <input
                      type="email"
                      placeholder="البريد الإلكتروني (اختياري)"
                      value={newSeller.email}
                      onChange={(e) => setNewSeller({ ...newSeller, email: e.target.value })}
                      className="px-4 py-2 border border-zinc-200 rounded-lg focus:border-black focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="رقم الهاتف (اختياري)"
                      value={newSeller.phone}
                      onChange={(e) => setNewSeller({ ...newSeller, phone: e.target.value })}
                      className="px-4 py-2 border border-zinc-200 rounded-lg focus:border-black focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={handleAddSeller}
                    className="w-full bg-green-600 text-white px-4 py-3 rounded-xl hover:bg-green-700 transition-colors font-bold"
                  >
                    حفظ البائع
                  </button>
                </div>
              )}

              <div className="space-y-4">
                {sellers.filter(s => s.is_active).map((seller) => (
                  <div key={seller.id} className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 flex justify-between items-center">
                    <div>
                      <div className="font-bold text-zinc-900">{seller.name}</div>
                      <div className="text-sm text-zinc-500">الكود: {seller.code}</div>
                      <div className="text-xs text-zinc-400 mt-1">
                        {seller.contract_count || 0} عقد
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => copySellerLink(seller.code)}
                        className="flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                      >
                        {copiedLink === seller.code ? <Check size={16} /> : <LinkIcon size={16} />}
                        <span>{copiedLink === seller.code ? 'تم النسخ' : 'نسخ الرابط'}</span>
                      </button>
                      <button
                        onClick={() => handleDeleteSeller(seller.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
                {sellers.filter(s => s.is_active).length === 0 && (
                  <div className="text-center text-zinc-400 py-8">
                    لا يوجد بائعين. اضغط "إضافة بائع" للبدء.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {(activeTab === 'branding' || activeTab === 'pricing') && (
          <div className="flex flex-col sm:flex-row justify-end items-center bg-white p-6 rounded-2xl border border-zinc-200 shadow-card mt-8 gap-4">
            <button
              onClick={handleSave}
              className="w-full sm:w-auto bg-black text-white px-10 py-4 rounded-xl font-bold hover:bg-zinc-800 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3 text-lg"
            >
              <span>حفظ التغييرات</span>
              <Save size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

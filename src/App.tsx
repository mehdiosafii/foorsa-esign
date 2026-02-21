import React, { useState, useRef, useEffect } from 'react';
import { Header } from './components/Header';
import { SignaturePad } from './components/SignaturePad';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminSettings } from './components/AdminSettings';
import { ContractContent, ContractPart1, ContractPart2, ADMIN_PASSWORD, DEFAULT_PRICING_CONFIG, getCurrentMonthPrice, getFileFees, getOriginalPrice } from './constants';
import { AppStep, StudentInfo, ContractRecord, ProgramType, Fees, BrandingConfig, PricingConfig } from './types';
import { generatePDF } from './utils/pdfGenerator';
import { ArrowLeft, CheckCircle, Download, Send, AlertCircle, FileText, Lock, ChevronLeft, Share2, GraduationCap, ShieldCheck, ArrowRight, UserCheck, Receipt, Percent } from 'lucide-react';
import { clsx } from 'clsx';

const BRANDING_VERSION = 3;

const DEFAULT_BRANDING: BrandingConfig = {
  logoUrl: '/logo.png',
  stampUrl: '/stamp.png',
  watermarkUrl: '/watermark.png',
  companyPhone: '212537911282'
};

// --- MinimalInput moved OUTSIDE the App component to prevent focus loss ---
interface MinimalInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  type?: string;
  placeholder?: string;
  dir?: string;
  autoComplete?: string;
  max?: string;
  options?: { value: string; label: string }[];
  bold?: boolean;
}

const MinimalInput = ({ label, name, value, onChange, type = "text", placeholder, dir, autoComplete, max, options, bold }: MinimalInputProps) => (
  <div className="group">
    <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-2 transition-colors group-focus-within:text-black">
      {label}
    </label>
    {type === 'select' ? (
      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={onChange}
          className={clsx("w-full bg-transparent border-b border-zinc-200 py-3 text-lg text-black focus:border-black focus:outline-none transition-all appearance-none cursor-pointer", bold && "font-bold")}
          dir={dir}
        >
          {options?.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <div className="absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
        </div>
      </div>
    ) : (
      <input 
        name={name}
        value={value}
        onChange={onChange}
        type={type} 
        dir={dir}
        autoComplete={autoComplete}
        max={max}
        className={clsx("w-full bg-transparent border-b border-zinc-200 py-3 text-lg text-black focus:border-black focus:outline-none transition-all placeholder:text-zinc-200", bold && "font-bold")}
        placeholder={placeholder}
      />
    )}
  </div>
);

// Country codes for phone input
const COUNTRY_CODES = [
  { code: '+212', country: '🇲🇦 المغرب', flag: '🇲🇦' },
  { code: '+966', country: '🇸🇦 السعودية', flag: '🇸🇦' },
  { code: '+971', country: '🇦🇪 الإمارات', flag: '🇦🇪' },
  { code: '+20', country: '🇪🇬 مصر', flag: '🇪🇬' },
  { code: '+213', country: '🇩🇿 الجزائر', flag: '🇩🇿' },
  { code: '+216', country: '🇹🇳 تونس', flag: '🇹🇳' },
  { code: '+962', country: '🇯🇴 الأردن', flag: '🇯🇴' },
  { code: '+961', country: '🇱🇧 لبنان', flag: '🇱🇧' },
  { code: '+964', country: '🇮🇶 العراق', flag: '🇮🇶' },
  { code: '+968', country: '🇴🇲 عمان', flag: '🇴🇲' },
  { code: '+974', country: '🇶🇦 قطر', flag: '🇶🇦' },
  { code: '+973', country: '🇧🇭 البحرين', flag: '🇧🇭' },
  { code: '+965', country: '🇰🇼 الكويت', flag: '🇰🇼' },
  { code: '+33', country: '🇫🇷 فرنسا', flag: '🇫🇷' },
  { code: '+34', country: '🇪🇸 إسبانيا', flag: '🇪🇸' },
  { code: '+1', country: '🇺🇸 أمريكا', flag: '🇺🇸' },
  { code: '+86', country: '🇨🇳 الصين', flag: '🇨🇳' },
];

interface PhoneInputProps {
  label: string;
  phoneValue: string;
  countryCode: string;
  onPhoneChange: (phone: string) => void;
  onCountryChange: (code: string) => void;
}

const PhoneInput = ({ label, phoneValue, countryCode, onPhoneChange, onCountryChange }: PhoneInputProps) => (
  <div className="group">
    <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-2 transition-colors group-focus-within:text-black">
      {label}
    </label>
    <div className="flex items-center gap-0 border-b border-zinc-200 focus-within:border-black transition-all" dir="ltr">
      <select
        value={countryCode}
        onChange={(e) => onCountryChange(e.target.value)}
        className="bg-transparent py-3 text-lg text-black focus:outline-none appearance-none cursor-pointer"
        dir="ltr"
      >
        {COUNTRY_CODES.map(c => (
          <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
        ))}
      </select>
      <input 
        type="tel"
        value={phoneValue}
        onChange={(e) => onPhoneChange(e.target.value)}
        className="flex-1 bg-transparent py-3 text-lg text-black focus:outline-none placeholder:text-zinc-200 text-left"
        placeholder="6XX XXX XXX"
        dir="ltr"
        autoComplete="tel"
      />
    </div>
  </div>
);

// Email domains for email input
const EMAIL_DOMAINS = [
  '@gmail.com',
  '@hotmail.com',
  '@outlook.com',
  '@yahoo.com',
  '@icloud.com',
];

interface EmailInputProps {
  label: string;
  emailName: string;
  emailDomain: string;
  onNameChange: (name: string) => void;
  onDomainChange: (domain: string) => void;
}

const EmailInput = ({ label, emailName, emailDomain, onNameChange, onDomainChange }: EmailInputProps) => (
  <div className="group">
    <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-2 transition-colors group-focus-within:text-black">
      {label}
    </label>
    <div className="flex items-center gap-0 border-b border-zinc-200 focus-within:border-black transition-all" dir="ltr">
      <input 
        type="text"
        value={emailName}
        onChange={(e) => onNameChange(e.target.value)}
        className="flex-1 bg-transparent py-3 text-lg text-black focus:outline-none placeholder:text-zinc-200 text-left"
        placeholder="name"
        dir="ltr"
        autoComplete="email"
      />
      <select
        value={emailDomain}
        onChange={(e) => onDomainChange(e.target.value)}
        className="bg-transparent py-3 text-lg text-black focus:outline-none appearance-none cursor-pointer"
        dir="ltr"
      >
        {EMAIL_DOMAINS.map(d => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>
    </div>
  </div>
);

function App() {
  const [step, setStep] = useState<AppStep>(() => {
    const params = new URLSearchParams(window.location.search);
    // Check for admin access
    if (params.get('secret_admin') === '1') {
      return AppStep.ADMIN_LOGIN;
    }
    // Default: go directly to contract form
    return AppStep.LANDING;
  });

  const [formData, setFormData] = useState<StudentInfo>({
    fullName: '',
    nationalId: '',
    birthDate: '2007-01-01',
    guardianName: '',
    guardianId: '',
    phone: '',
    email: '',
    program: '',
    fees: {
        dossier: 0,
        serviceBase: 0,
        originalServiceBase: 0,
        serviceDiscounted: 0,
        discountAmount: 0,
        total: 0
    }
  });
  const [isMinor, setIsMinor] = useState(false);
  const [signature, setSignature] = useState<string | null>(null);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [adminPassInput, setAdminPassInput] = useState('');
  const [adminError, setAdminError] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [countryCode, setCountryCode] = useState('+212');
  const [emailDomain, setEmailDomain] = useState('@gmail.com');
  const [adminPassword, setAdminPassword] = useState('');
  
  // NEW: Seller tracking from URL params
  const [sellerCode, setSellerCode] = useState<string | null>(null);
  const [sellerName, setSellerName] = useState<string | null>(null);
    
  // State for branding and pricing
  const [branding, setBranding] = useState<BrandingConfig>(DEFAULT_BRANDING);
  const [pricingConfig, setPricingConfig] = useState<PricingConfig>(DEFAULT_PRICING_CONFIG);
  
  const [showAdminButton, setShowAdminButton] = useState(false);
  const [generatedFile, setGeneratedFile] = useState<File | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load stored settings - but check version first
    const storedVersion = localStorage.getItem('foorsa_branding_version');
    const currentVersion = String(BRANDING_VERSION);
    
    // If version mismatch or no version, use defaults and clear old data
    if (storedVersion !== currentVersion) {
      localStorage.removeItem('foorsa_branding');
      localStorage.setItem('foorsa_branding_version', currentVersion);
      // Keep defaults (already set in state)
    } else {
      // Version matches, safe to load stored branding
      const storedBranding = localStorage.getItem('foorsa_branding');
      if (storedBranding) {
        setBranding(JSON.parse(storedBranding));
      }
    }

    const storedPricing = localStorage.getItem('foorsa_pricing');
    if (storedPricing) {
      setPricingConfig(JSON.parse(storedPricing));
    }
    
    // Check for admin query param - but not in student-only mode
    const params = new URLSearchParams(window.location.search);
    if (params.get('secret_admin') === '1' && !params.get('student')) {
      setShowAdminButton(true);
    }

    // NEW: Check for seller param
    const seller = params.get('seller');
    if (seller) {
      setSellerCode(seller);
      // Optionally fetch seller name from API
      fetchSellerName(seller);
    }
  }, []);

  // NEW: Fetch seller name from API
  const fetchSellerName = async (code: string) => {
    try {
      const response = await fetch('/api/sellers');
      if (response.ok) {
        const sellers = await response.json();
        const seller = sellers.find((s: any) => s.code === code);
        if (seller) {
          setSellerName(seller.name);
        }
      }
    } catch (error) {
      console.error('Error fetching seller:', error);
    }
  };

  // Update fees whenever program or pricing config changes
  useEffect(() => {
    updateFees(formData.program);
  }, [pricingConfig]);

  // Check age whenever birthDate changes
  useEffect(() => {
    if (formData.birthDate) {
      const birth = new Date(formData.birthDate);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      setIsMinor(age < 18);
    } else {
      setIsMinor(false);
    }
  }, [formData.birthDate]);

  const saveBranding = (newConfig: BrandingConfig) => {
    setBranding(newConfig);
    localStorage.setItem('foorsa_branding', JSON.stringify(newConfig));
  };

  const savePricing = (newConfig: PricingConfig) => {
    setPricingConfig(newConfig);
    localStorage.setItem('foorsa_pricing', JSON.stringify(newConfig));
  };

  const updateFees = (program: ProgramType) => {
    // Use automatic date-based pricing
    const { price: service } = getCurrentMonthPrice(program);
    const dossier = getFileFees(program);
    const original = getOriginalPrice(program);

    const discountAmount = (original > service) ? (original - service) : 0;

    setFormData(prev => ({
        ...prev,
        program: program,
        fees: {
            dossier,
            serviceBase: service,
            originalServiceBase: original,
            serviceDiscounted: service,
            discountAmount: discountAmount,
            total: dossier + service
        }
    }));
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      if (scrollHeight - scrollTop <= clientHeight + 100) { 
        setHasScrolledToBottom(true);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (e.target.name === 'program') {
        updateFees(e.target.value as ProgramType);
    } else {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };

  const isFormValid = () => {
    const basicValid = formData.fullName.length > 3 && 
           formData.nationalId.length > 3 && 
           formData.birthDate !== '' &&
           formData.phone.length > 8 &&
           formData.email.includes('@') &&
           formData.program !== '';
    
    if (isMinor) {
      return basicValid && 
             (formData.guardianName?.length ?? 0) > 3 && 
             (formData.guardianId?.length ?? 0) > 3;
    }
    
    return basicValid;
  };

  const handleSignatureSave = (dataUrl: string) => {
    setSignature(dataUrl);
    setStep(AppStep.SIGNATURE); 
  };

  // NEW: Submit contract to API instead of localStorage
  const submitContract = async () => {
    if (!signature) return;

    try {
      const response = await fetch('/api/contracts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentInfo: formData,
          signatureDataUrl: signature,
          ipAddress: null, // Will be captured server-side if needed
          sellerCode: sellerCode,
          sellerName: sellerName,
        }),
      });

      if (response.ok) {
        setStep(AppStep.SUCCESS);
        // GENERATE PDF WITH STAMP (TRUE)
        const file = await generatePDF(formData, signature, true, branding);
        if (file) setGeneratedFile(file);
      } else {
        console.error('Failed to submit contract');
        alert('فشل في حفظ العقد. يرجى المحاولة مرة أخرى.');
      }
    } catch (error) {
      console.error('Error submitting contract:', error);
      alert('حدث خطأ أثناء حفظ العقد. يرجى المحاولة مرة أخرى.');
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassInput === ADMIN_PASSWORD) {
      setAdminPassword(adminPassInput); // Store password for API calls
      setStep(AppStep.ADMIN_DASHBOARD);
      setAdminError(false);
      setAdminPassInput('');
    } else {
      setAdminError(true);
    }
  };

  
  const shareViaWhatsApp = async () => {
    if (!generatedFile) return;
    
    // Download PDF first
    const url = URL.createObjectURL(generatedFile);
    const a = document.createElement('a');
    a.href = url;
    a.download = generatedFile.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Open WhatsApp with message
    const message = `مرحباً، أنا ${formData.fullName}، لقد قرأت العقد بالكامل وأوافق على كل ما ورد فيه. سأرسل لكم ملف العقد PDF.`;
    const whatsappUrl = `https://wa.me/${branding.companyPhone}?text=${encodeURIComponent(message)}`;
    
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
    }, 500);
  };
  
  const shareViaEmail = async () => {
    if (!generatedFile) return;
    
    // Try Web Share API first (works on mobile, can share files)
    if (navigator.share && navigator.canShare && navigator.canShare({ files: [generatedFile] })) {
      try {
        await navigator.share({
          files: [generatedFile],
          title: `عقد خدمات مكتب فرصة - ${formData.fullName}`,
          text: `السادة مكتب فرصة المحترمين،\n\nتحية طيبة وبعد،\n\nأتقدم إليكم بهذا الطلب لتأكيد موافقتي على عقد تقديم الخدمات.\n\nالاسم الكامل: ${formData.fullName}\nرقم الهوية: ${formData.nationalId}\n\nمرفق طيه نسخة من العقد الموقع إلكترونياً.\n\nوتفضلوا بقبول فائق الاحترام والتقدير.`
        });
        return;
      } catch (err) {
        console.log('Share cancelled or failed');
      }
    }
    
    // Fallback: Download PDF and open email client
    const url = URL.createObjectURL(generatedFile);
    const a = document.createElement('a');
    a.href = url;
    a.download = generatedFile.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Open mailto with simple content
    const subject = encodeURIComponent(`FOORSA contrat`);
    const body = encodeURIComponent(`J'ai lu, et j'accepte.`);
    
    setTimeout(() => {
      window.location.href = `mailto:rabat@foorsa.ma?subject=${subject}&body=${body}`;
    }, 500);
  };

  if (step === AppStep.ADMIN_SETTINGS) {
    return (
        <AdminSettings 
            currentBranding={branding} 
            currentPricing={pricingConfig}
            onSaveBranding={saveBranding} 
            onSavePricing={savePricing}
            onBack={() => setStep(AppStep.ADMIN_DASHBOARD)} 
            adminPassword={adminPassword}
        />
    );
  }
  if (step === AppStep.ADMIN_DASHBOARD) {
    return <AdminDashboard 
      onLogout={() => setStep(AppStep.LANDING)} 
      onSettings={() => setStep(AppStep.ADMIN_SETTINGS)} 
      branding={branding}
      adminPassword={adminPassword}
    />;
  }

  // ADMIN LOGIN
  if (step === AppStep.ADMIN_LOGIN) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-6">
        <div className="bg-white p-12 rounded-[2.5rem] shadow-float w-full max-w-sm text-center animate-slide-up border border-zinc-100">
          <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-zinc-200">
            <Lock size={24} />
          </div>
          <h2 className="text-xl font-bold mb-10 tracking-tight">Enter Passcode</h2>
          
          <form onSubmit={handleAdminLogin} className="space-y-8">
            <input
              type="password"
              value={adminPassInput}
              onChange={(e) => setAdminPassInput(e.target.value)}
              className="w-full text-center text-3xl tracking-[0.5em] font-mono border-b-2 border-zinc-100 py-3 focus:border-black outline-none bg-transparent transition-colors"
              placeholder="••••"
              autoFocus
              maxLength={4}
            />
            {adminError && <p className="text-red-500 text-xs mt-2 animate-bounce">Incorrect Passcode</p>}
            <button type="submit" className="w-full bg-black text-white py-4 rounded-2xl font-bold hover:bg-zinc-800 transition-all shadow-lg active:scale-95">
              Unlock
            </button>
            <button type="button" onClick={() => setStep(AppStep.LANDING)} className="text-zinc-400 text-xs hover:text-black transition-colors uppercase tracking-widest font-bold">
              Cancel
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA]">
      <Header onAdminClick={() => {}} logoUrl={branding.logoUrl} showAdmin={showAdminButton} />

      <main className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-8 pt-24">
        
        {/* NEW: Seller indicator */}
        {sellerCode && sellerName && step < AppStep.SUCCESS && (
          <div className="mb-4 text-center">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium border border-blue-200">
              <UserCheck size={16} />
              <span>مندوب: {sellerName}</span>
            </div>
          </div>
        )}

        {/* Step Indicator */}
        {step < AppStep.SUCCESS && (
            <div className="flex justify-between items-center mb-8 px-2">
                 <button onClick={() => step > AppStep.LANDING && setStep(step - 1)} className={clsx("text-zinc-400 hover:text-black transition-colors", step === AppStep.LANDING && "invisible")}>
                    <ArrowRight size={20} />
                 </button>
                 <div className="flex gap-2">
                    {[1, 2].map((s) => (
                    <div key={s} className={clsx(
                        "h-1 rounded-full transition-all duration-500",
                        step >= s-1 ? "w-8 bg-black" : "w-2 bg-zinc-200"
                    )} />
                    ))}
                </div>
                <div className="w-5"></div>
            </div>
        )}

        {/* Step 1: Form Input */}
        {step === AppStep.LANDING && (
          <div className="animate-fade-in max-w-lg mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold mb-2">بيانات الطالب</h2>
              <p className="text-zinc-400 text-sm">يرجى ملء البيانات بدقة لإنشاء العقد</p>
            </div>
            
            <div className="bg-white p-8 rounded-[2rem] shadow-card border border-zinc-100 space-y-8" dir="rtl">
              <MinimalInput 
                label="الاسم الكامل بالفرنسية" 
                name="fullName" 
                value={formData.fullName} 
                onChange={handleInputChange} 
                placeholder="الاسم كما هو في البطاقة"
                autoComplete="name"
                bold={true}
              />

              <MinimalInput 
                label="رقم البطاقة الوطنية / جواز السفر" 
                name="nationalId" 
                value={formData.nationalId} 
                onChange={handleInputChange} 
                placeholder="مثال: AB123456"
                bold={true}
              />

              <MinimalInput 
                  label="تاريخ الازدياد" 
                  name="birthDate"
                  type="date"
                  value={formData.birthDate} 
                  onChange={handleInputChange} 
                  max={new Date().toISOString().split('T')[0]}
              />

              <PhoneInput
                  label="رقم الهاتف"
                  phoneValue={formData.phone}
                  countryCode={countryCode}
                  onPhoneChange={(phone) => setFormData(prev => ({ ...prev, phone }))}
                  onCountryChange={setCountryCode}
              />

              {/* Conditional Guardian Inputs for Minors */}
              {isMinor && (
                <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-200 animate-slide-up">
                    <div className="flex items-center gap-2 mb-4 text-orange-600">
                        <UserCheck size={18} />
                        <span className="text-sm font-bold">بيانات الولي (لأقل من 18 سنة)</span>
                    </div>
                    <div className="space-y-6">
                        <MinimalInput 
                            label="اسم الولي الكامل" 
                            name="guardianName" 
                            value={formData.guardianName || ''} 
                            onChange={handleInputChange} 
                            placeholder="اسم الأب أو الوصي"
                        />
                         <MinimalInput 
                            label="رقم هوية الولي" 
                            name="guardianId" 
                            value={formData.guardianId || ''} 
                            onChange={handleInputChange} 
                            placeholder="رقم بطاقة الولي"
                        />
                    </div>
                </div>
              )}

              <EmailInput
                label="البريد الإلكتروني"
                emailName={formData.email.replace(/@.*$/, '')}
                emailDomain={emailDomain}
                onNameChange={(name) => setFormData(prev => ({ ...prev, email: name + emailDomain }))}
                onDomainChange={(domain) => {
                  setEmailDomain(domain);
                  const currentName = formData.email.replace(/@.*$/, '');
                  setFormData(prev => ({ ...prev, email: currentName + domain }));
                }}
              />
              
              <MinimalInput
                label="نوع الخدمة"
                name="program"
                type="select"
                value={formData.program}
                onChange={handleInputChange}
                options={[
                  { value: '', label: 'اختر نوع الخدمة' },
                  { value: 'bachelor', label: 'البكالوريوس / برنامج اللغة' },
                  { value: 'master', label: 'الماستر / الدكتوراه' },
                  { value: 'special', label: 'دورة مارس + شتنبر' },
                  { value: 'resident', label: 'الطلبة المقيمين بالصين' }
                ]}
              />

              {/* Fees Breakdown with Savings Highlight */}
              <div className="bg-black/5 p-6 rounded-2xl flex flex-col gap-3">
                 <div className="flex justify-between items-center text-sm text-zinc-600">
                    <span>مصاريف الملف:</span>
                    <span className="font-bold">{formData.fees.dossier > 0 ? `${formData.fees.dossier} درهم` : 'مجاناً'}</span>
                 </div>
                 
                 <div className="flex justify-between items-center text-sm text-zinc-600">
                    <span>مصاريف الخدمة:</span>
                    <span className="font-bold">{formData.fees.serviceBase} درهم</span>
                 </div>

              </div>

              <button 
                onClick={() => setStep(AppStep.CONTRACT_REVIEW)}
                disabled={!isFormValid()}
                className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
              >
                <span>مراجعة العقد</span>
                <ArrowLeft size={20} />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Contract Review */}
        {step === AppStep.CONTRACT_REVIEW && (
          <div className="animate-fade-in flex flex-col h-[80vh]">
            <div className="flex-1 bg-white rounded-[2rem] shadow-card border border-zinc-200 overflow-hidden flex flex-col relative">
              <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none"></div>
              
              {/* Watermark Background */}
              <div 
                 className="absolute inset-0 pointer-events-none opacity-[0.03] z-0"
                 style={{ 
                   backgroundImage: `url('${branding.watermarkUrl}')`, 
                   backgroundRepeat: 'no-repeat', 
                   backgroundPosition: 'center', 
                   backgroundSize: '50%' 
                 }}
              />
              
              <div 
                ref={scrollRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto p-8 text-right relative z-10"
              >
                <ContractContent studentInfo={formData} pricing={pricingConfig} />
                
                <div className="mt-12 pt-8 border-t border-zinc-100 pb-20">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3" dir="rtl">
                            <input 
                                type="checkbox" 
                                id="terms"
                                checked={termsAccepted}
                                onChange={(e) => setTermsAccepted(e.target.checked)}
                                className="w-5 h-5 accent-black rounded-lg cursor-pointer"
                            />
                            <label htmlFor="terms" className="text-sm font-bold text-zinc-800 cursor-pointer select-none">
                                قرأت العقد كاملاً وأوافق على جميع الشروط والأحكام
                            </label>
                        </div>
                    </div>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none"></div>
            </div>

            <div className="mt-6 flex justify-between items-center px-2">
               <button onClick={() => setStep(AppStep.LANDING)} className="text-zinc-400 hover:text-black transition-colors font-bold text-sm">
                 تعديل البيانات
               </button>

               {!hasScrolledToBottom ? (
                  <div className="text-xs text-orange-500 font-bold bg-orange-50 px-4 py-2 rounded-full animate-pulse flex items-center gap-2">
                    <ArrowLeft className="-rotate-90" size={14} />
                    يرجى قراءة العقد بالكامل للمتابعة
                  </div>
               ) : (
                 <button
                   onClick={() => setStep(AppStep.SIGNATURE)}
                   disabled={!termsAccepted}
                   className="bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition-all flex items-center gap-2"
                 >
                   <span>التوقيع</span>
                   <CheckCircle size={18} />
                 </button>
               )}
            </div>
          </div>
        )}

        {/* Step 3: Signature */}
        {step === AppStep.SIGNATURE && (
          <div className="animate-fade-in max-w-md mx-auto">
             <div className="bg-white p-6 rounded-[2rem] shadow-card border border-zinc-100">
                <SignaturePad onSave={handleSignatureSave} onCancel={() => setStep(AppStep.CONTRACT_REVIEW)} />
             </div>
             {signature && (
                <button 
                  onClick={submitContract}
                  className="w-full mt-6 bg-black text-white py-4 rounded-xl font-bold hover:bg-zinc-800 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                >
                  <span>إتمام وتأكيد العقد</span>
                  <Send size={18} />
                </button>
             )}
          </div>
        )}

        {/* Step 4: Success */}
        {step === AppStep.SUCCESS && (
          <div className="animate-scale-in text-center max-w-md mx-auto pt-10">
            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-float">
              <CheckCircle size={48} />
            </div>
            <h2 className="text-3xl font-bold text-zinc-900 mb-4">تم توقيع العقد بنجاح!</h2>
            <p className="text-zinc-500 mb-12 leading-relaxed">
              شكراً لك {formData.fullName}.<br/>
              يرجى إرسال هذه النسخة عبر البريد الإلكتروني.
            </p>

            <div className="space-y-4">
               <button 
                  onClick={async () => {
                    if (!generatedFile) {
                      const file = await generatePDF(formData, signature!, true, branding);
                      if (file) setGeneratedFile(file);
                    } else {
                      const url = URL.createObjectURL(generatedFile);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = generatedFile.name;
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                    }
                  }}
                  className="w-full bg-black text-white py-4 rounded-2xl font-bold hover:bg-zinc-800 shadow-lg transition-all flex items-center justify-center gap-3"
               >
                 <Download size={20} />
                 <span>تحميل نسخة PDF</span>
               </button>
               
               <button 
                  onClick={shareViaEmail}
                  className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 shadow-lg transition-all flex items-center justify-center gap-3"
               >
                 <Send size={20} />
                 <span>مشاركة عبر البريد الإلكتروني</span>
               </button>
            </div>
          </div>
        )}
      </main>

      {/* Hidden PDF Templates (A4 Landscape, 2 Pages) */}
      <div style={{ position: 'absolute', top: -10000, left: -10000 }}>
         {/* Page 1 */}
         <div id="pdf-page-1" className="relative bg-white text-black font-sans" style={{ width: '1600px', height: '1131px', padding: '60px', overflow: 'hidden' }} dir="rtl">
            <img 
               id="pdf-watermark-1"
               src={branding.watermarkUrl} 
               className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] opacity-[0.08] pointer-events-none" 
               alt="" 
            />
            <div className="flex justify-between items-start border-b-2 border-black pb-6 mb-8">
               <div className="text-right">
                  <h1 className="text-4xl font-bold mb-2">عقد تقديم خدمات مكتب فرصة للدراسة في الصين</h1>
                  <p className="text-xl text-zinc-600">بين Opportunity Solutions SARL والزبون</p>
               </div>
               <img id="pdf-logo" src={branding.logoUrl} className="h-24 object-contain" alt="Logo" />
            </div>
            
            <div className="mb-6 bg-zinc-50 p-6 rounded-xl border border-zinc-200 flex justify-between items-center">
               <div>
                  <h2 className="text-xl font-bold mb-2">الطرف الثاني (الزبون):</h2>
                  <p className="text-lg">الاسم الكامل: <span id="p1-name" className="font-mono font-bold mx-2"></span></p>
                  <p className="text-lg">رقم البطاقة الوطنية: <span id="p1-id" className="font-mono font-bold mx-2"></span></p>
               </div>
               <div className="text-left">
                  <p className="text-lg text-zinc-500">التاريخ: <span id="p1-date"></span></p>
               </div>
            </div>

            <div className="columns-2 gap-10 text-[8px] leading-[1.3] text-justify" style={{ columnRule: '1px solid #e5e5e5' }}>
               <ContractPart1 studentInfo={formData} />
            </div>
         </div>

         {/* Page 2 */}
         <div id="pdf-page-2" className="relative bg-white text-black font-sans" style={{ width: '1600px', height: '1131px', padding: '50px', overflow: 'hidden' }} dir="rtl">
            <img 
               id="pdf-watermark-2"
               src={branding.watermarkUrl} 
               className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] opacity-[0.08] pointer-events-none" 
               alt="" 
            />
             <div className="columns-2 gap-10 text-[8px] leading-[1.3] text-justify" style={{ columnRule: '1px solid #e5e5e5' }}>
               <ContractPart2 studentInfo={formData} pricing={pricingConfig} />
            </div>

            <div className="mt-8 flex justify-between items-end border-t-2 border-black pt-8 break-inside-avoid">
               <div className="text-center w-1/3">
                  <p className="font-bold mb-4 text-lg">الطرف الأول (Opportunity Solutions SARL)</p>
                  {/* Stamp Image - Use opacity for html2canvas compatibility */}
                  <img 
                    id="pdf-stamp-overlay" 
                    src={branding.stampUrl} 
                    className="w-48 mx-auto" 
                    alt="Stamp"
                    style={{ opacity: 0 }} 
                  />
               </div>
               <div className="text-center w-1/3">
                  <p className="font-bold mb-4 text-lg">الطرف الثاني (الزبون)</p>
                  <img id="pdf-signature-img" className="w-48 mx-auto border-b border-black/20 pb-2" alt="Signature" />
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

export default App;

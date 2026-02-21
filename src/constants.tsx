
import React from 'react';
import { StudentInfo, PricingConfig, ProgramType } from './types';

export const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "";

// Monthly pricing tables - prices automatically selected based on current date
// Bachelor/Language: Original 12990dh, File fees: 2790dh
// Master/PhD: Original 12990dh, File fees: 3490dh
// Special (Mars + Sept): Original 14590dh, File fees: 2790dh

interface MonthlyPrice {
  month: string; // Format: "YYYY-MM"
  price: number;
  discount: number; // Percentage
}

// Bachelor, Master, Language program monthly prices
const BACHELOR_MASTER_PRICES: MonthlyPrice[] = [
  { month: "2025-12", price: 8390, discount: 35.4 },
  { month: "2026-01", price: 8550, discount: 34.1 },
  { month: "2026-02", price: 8720, discount: 32.8 },
  { month: "2026-03", price: 8850, discount: 31.9 },
  { month: "2026-04", price: 8950, discount: 31.1 },
  { month: "2026-05", price: 9000, discount: 30.7 },
  { month: "2026-06", price: 9250, discount: 28.8 },
  { month: "2026-07", price: 9500, discount: 26.9 },
  { month: "2026-08", price: 9800, discount: 24.6 },
  { month: "2026-09", price: 10000, discount: 23.0 },
  { month: "2026-10", price: 8490, discount: 34.7 },
  { month: "2026-11", price: 8642, discount: 33.5 },
  { month: "2026-12", price: 8794, discount: 32.3 },
  { month: "2027-01", price: 8946, discount: 31.2 },
  { month: "2027-02", price: 9098, discount: 29.9 },
  { month: "2027-03", price: 9250, discount: 28.8 },
  { month: "2027-04", price: 9402, discount: 27.6 },
  { month: "2027-05", price: 9554, discount: 26.4 },
  { month: "2027-06", price: 9706, discount: 25.2 },
  { month: "2027-07", price: 9858, discount: 24.1 },
  { month: "2027-08", price: 10010, discount: 23.0 },
  { month: "2027-09", price: 10162, discount: 21.8 },
  { month: "2027-10", price: 10314, discount: 20.6 },
];

// Special program (Mars + September) monthly prices
const SPECIAL_PRICES: MonthlyPrice[] = [
  { month: "2025-12", price: 10797, discount: 26.0 },
  { month: "2026-01", price: 11490, discount: 21.3 },
  { month: "2026-02", price: 11890, discount: 18.5 },
  { month: "2026-03", price: 11890, discount: 18.5 },
  { month: "2026-04", price: 11890, discount: 18.5 },
  { month: "2026-05", price: 11890, discount: 18.5 },
  { month: "2026-06", price: 11890, discount: 18.5 },
  { month: "2026-07", price: 11890, discount: 18.5 },
  { month: "2026-08", price: 11890, discount: 18.5 },
  { month: "2026-09", price: 9790, discount: 32.9 },
  { month: "2026-10", price: 10290, discount: 29.5 },
  { month: "2026-11", price: 10590, discount: 27.4 },
  { month: "2026-12", price: 10797, discount: 26.0 },
  { month: "2027-01", price: 11490, discount: 21.3 },
  { month: "2027-02", price: 11890, discount: 18.5 },
  { month: "2027-03", price: 11890, discount: 18.5 },
  { month: "2027-04", price: 11890, discount: 18.5 },
  { month: "2027-05", price: 11890, discount: 18.5 },
  { month: "2027-06", price: 11890, discount: 18.5 },
  { month: "2027-07", price: 11890, discount: 18.5 },
  { month: "2027-08", price: 11890, discount: 18.5 },
  { month: "2027-09", price: 9970, discount: 31.7 },
  { month: "2027-10", price: 10290, discount: 29.5 },
];

// Resident students in China (الطلبة المقيمين بالصين) - File fees: 0dh, Original: 6000dh
const RESIDENT_PRICES: MonthlyPrice[] = [
  { month: "2025-12", price: 4890, discount: 18.5 },
  { month: "2026-01", price: 5590, discount: 6.8 },
  { month: "2026-02", price: 5890, discount: 1.8 },
  { month: "2026-03", price: 5890, discount: 1.8 },
  { month: "2026-04", price: 5890, discount: 1.8 },
  { month: "2026-05", price: 5890, discount: 1.8 },
  { month: "2026-06", price: 5890, discount: 1.8 },
  { month: "2026-07", price: 5890, discount: 1.8 },
  { month: "2026-08", price: 5890, discount: 1.8 },
  { month: "2026-09", price: 5890, discount: 1.8 },
  { month: "2026-10", price: 4890, discount: 18.5 },
  { month: "2026-11", price: 4890, discount: 18.5 },
  { month: "2026-12", price: 4890, discount: 18.5 },
  { month: "2027-01", price: 5490, discount: 8.5 },
  { month: "2027-02", price: 5890, discount: 1.8 },
  { month: "2027-03", price: 5890, discount: 1.8 },
  { month: "2027-04", price: 5890, discount: 1.8 },
  { month: "2027-05", price: 5890, discount: 1.8 },
  { month: "2027-06", price: 5890, discount: 1.8 },
  { month: "2027-07", price: 5890, discount: 1.8 },
  { month: "2027-08", price: 5890, discount: 1.8 },
  { month: "2027-09", price: 5890, discount: 1.8 },
  { month: "2027-10", price: 4890, discount: 18.5 },
];

// Get current month's price for a program type
export const getCurrentMonthPrice = (programType: ProgramType): { price: number; discount: number } => {
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  
  let priceTable: MonthlyPrice[];
  if (programType === 'special') {
    priceTable = SPECIAL_PRICES;
  } else if (programType === 'resident') {
    priceTable = RESIDENT_PRICES;
  } else {
    priceTable = BACHELOR_MASTER_PRICES;
  }
  
  // Find exact month match
  const monthPrice = priceTable.find(p => p.month === currentMonth);
  if (monthPrice) {
    return { price: monthPrice.price, discount: monthPrice.discount };
  }
  
  // If no match, find nearest future or use last available
  const sortedPrices = [...priceTable].sort((a, b) => a.month.localeCompare(b.month));
  
  // Find first month >= current
  const futurePrice = sortedPrices.find(p => p.month >= currentMonth);
  if (futurePrice) {
    return { price: futurePrice.price, discount: futurePrice.discount };
  }
  
  // Use last available price
  const lastPrice = sortedPrices[sortedPrices.length - 1];
  return { price: lastPrice.price, discount: lastPrice.discount };
};

// Get file fees for program type
export const getFileFees = (programType: ProgramType): number => {
  if (programType === 'resident') {
    return 0; // No file fees for resident students
  }
  if (programType === 'master') {
    return 3490;
  }
  return 2790; // bachelor, special (includes language program)
};

// Get original price for program type
export const getOriginalPrice = (programType: ProgramType): number => {
  if (programType === 'resident') {
    return 6000;
  }
  if (programType === 'special') {
    return 14590;
  }
  return 12990; // bachelor, master
};

export const DEFAULT_PRICING_CONFIG: PricingConfig = {
  bachelor: {
    fileFees: 2790,
    serviceFees: 8390,
    originalPrice: 12990,
  },
  master: {
    fileFees: 3490,
    serviceFees: 8390,
    originalPrice: 12990,
  },
  special: {
    fileFees: 2790,
    serviceFees: 10797,
    originalPrice: 14590,
  },
  resident: {
    fileFees: 0,
    serviceFees: 4890,
    originalPrice: 6000,
  },
  reapplication: 4900,
  reapplicationOriginal: 5990
};

// --- Typography Components (Relative Units for PDF Scaling) ---

const SectionTitle = ({ children }: { children?: React.ReactNode }) => (
  <h3 className="font-bold mb-1.5 mt-3 border-b border-zinc-200 pb-0.5" style={{ fontSize: '1.1em' }}>
    {children}
  </h3>
);

const Paragraph = ({ children }: { children?: React.ReactNode }) => (
  <p className="mb-1.5 text-justify text-zinc-700 leading-snug" style={{ fontSize: '1em' }}>
    {children}
  </p>
);

const List = ({ children }: { children?: React.ReactNode }) => (
  <div className="mb-1.5 space-y-0.5 text-zinc-700 leading-snug" style={{ fontSize: '1em', paddingInlineStart: '0.5rem' }}>
    {children}
  </div>
);

const ListItem = ({ children }: { children?: React.ReactNode }) => (
  <div style={{ display: 'flex', gap: '0.5em', alignItems: 'flex-start' }}>
    <span style={{ flexShrink: 0 }}>•</span>
    <span>{children}</span>
  </div>
);

// --- Contract Part 1 (Articles 1 - 19) ---

export const ContractPart1 = ({ studentInfo }: { studentInfo: StudentInfo }) => {
  return (
    <>
      {/* Fees Summary Box at Top */}
      <div className="bg-zinc-100 border-2 border-zinc-300 rounded-lg p-4 mb-4">
        <h3 className="font-bold text-center mb-2 text-lg border-b border-zinc-300 pb-2">ملخص الرسوم المستحقة</h3>
        <div className="flex justify-between items-center py-1 text-base">
          <span>نوع الخدمة:</span>
          <span className="font-bold">{
            studentInfo.program === 'bachelor' ? 'البكالوريوس / برنامج اللغة' :
            studentInfo.program === 'master' ? 'الماستر والدكتوراه' :
            studentInfo.program === 'special' ? 'دورة مارس + شتنبر' :
            studentInfo.program === 'resident' ? 'الطلبة المقيمين بالصين' : ''
          }</span>
        </div>
        <div className="flex justify-between items-center py-1 font-bold text-lg">
          <span>مصاريف الخدمة:</span>
          <span>{studentInfo.fees?.serviceBase || 0} درهم</span>
        </div>
      </div>

      <SectionTitle>المادة 1 – تعريف الأطراف</SectionTitle>
      <Paragraph>
        <strong>الطرف الأول:</strong> Opportunity Solutions SARL، شركة ذات مسؤولية محدودة.<br />
        العنوان: Avenue falal Ould Oumir, Immeuble 55, Appt 4, Agdal Riyad – Rabat.<br />
        ICE: 003376797000079 | RC: 26165 | Patente: 12000|2023|104674<br />
        ويُشار إليه في هذا العقد بـ "مقدّم الخدمة" أو "الطرف الأول".
      </Paragraph>
      <Paragraph>
        <strong>الطرف الثاني (الزبون):</strong><br />
        الاسم الكامل: <strong className="text-black underline">{studentInfo.fullName}</strong> | الهاتف: <strong className="text-black underline">{studentInfo.phone}</strong><br />
        رقم البطاقة الوطنية: <strong className="text-black underline">{studentInfo.nationalId}</strong><br />
        {studentInfo.guardianName ? (
          <>مُمثِّلًا بصفته وليًّا على: <strong className="text-black underline">{studentInfo.guardianName}</strong> (هوية الولي: {studentInfo.guardianId})<br /></>
        ) : (
          <>مُمثِّلًا لنفسه<br /></>
        )}
        وفي حالة كان الزبون قاصراً، يجب توقيع الوليّ القانوني ويُعتبر مسؤولاً بشكل كامل عن الملف.
      </Paragraph>

      <SectionTitle>المادة 2 – موضوع العقد</SectionTitle>
      <Paragraph>
        يهدف هذا العقد إلى تحديد الإطار القانوني للخدمات التي يقدمها الطرف الأول للزبون قصد مساعدته على استكمال الدراسة بالجامعات الصينية، وتشمل الخدمات التالية:
      </Paragraph>
      <List>
        <ListItem>دراسة وتقييم الملف الدراسي للزبون.</ListItem>
        <ListItem>تحديد الجامعات المناسبة لمساره الدراسي.</ListItem>
        <ListItem>التوجيه الأكاديمي ومساعدة الزبون في اختيار التخصص.</ListItem>
        <ListItem>تقديم الطلبات للجامعات الصينية ومتابعتها.</ListItem>
        <ListItem>مرافقة الزبون في إعداد ملف التأشيرة.</ListItem>
        <ListItem>تقديم الإرشادات الخاصة بالسفر والاستقرار الأولى في الصين.</ListItem>
        <ListItem>توجيه الزبون بخصوص السكن الجامعي.</ListItem>
      </List>

      <SectionTitle>المادة 3 – الالتزامات</SectionTitle>
      <Paragraph>
        يلتزم الطرف الأول بتقديم الخدمات المتفق عليها وفقاً للمبادئ القانونية المعمول بها، وطبقاً للتوجه الأكاديمي الذي يحدده الزبون، مع الالتزام ببذل العناية اللازمة في مسطرة استخلاص القبول الجامعي.
      </Paragraph>

      <SectionTitle>المادة 4 – البرنامج الزمني للخدمات</SectionTitle>
      <Paragraph>
        يقوم الطرف الأول بإشعار الطرف الثاني بالبرنامج المعتمد لتقديم الخدمات، ويلتزم الطرف الثاني باحترام هذا البرنامج والعمل وفق المراحل الزمنية المحددة فيه، وذلك طبقاً لمقتضيات الاتفاق بين الطرفين.
      </Paragraph>

      <SectionTitle>المادة 5 – تنفيذ البرنامج</SectionTitle>
      <Paragraph>
        يسهر الطرف الأول على تنفيذ برنامج تقديم الخدمات كما تم تحديده، ويُعفى من أي مسؤولية عن أي تأخير ناتج عن أسباب خارجة عن إرادته أو بسبب عدم التزام الطرف الثاني بالآجال المحددة. ويلتزم الطرف الأول ببذل العناية وليس تحقيق النتيجة، لأن قرار القبول والمنح والتأشيرة والسكن يخضع حصرياً لقرارات الجامعات والسلطات الصينية المختصة.
      </Paragraph>

      <SectionTitle>المادة 6 – مدة العقد</SectionTitle>
      <Paragraph>
        يمتد هذا العقد من تاريخ توقيعه إلى حين إنهاء جميع الخدمات المتفق عليها، دون الارتباط بأي مدة زمنية محددة طالما الطرف الأول مستمر في تنفيذ التزاماته.
      </Paragraph>

      <SectionTitle>المادة 7 – آجال وإجراءات القبول وإصدار الوثائق</SectionTitle>
      <Paragraph>
        يتولّى الطرف الأول تنفيذ إجراءات التقديم للجامعات وفقاً لما تم الاتفاق عليه مع الزبون، غير أنه لا يملك أي سلطة للتحكّم في المدة التي تستغرقها الجامعات لدراسة الملفات أو مراجعة الوثائق أو إصدار الردود. كما لا يتحكم الطرف الأول في تواريخ إصدار الوثائق الرسمية المرتبطة بالقبول أو التأشيرة، والتي قد تعرف تأخيراً لأسباب تنظيمية أو إدارية خارجة عن إرادة الطرف الأول.
      </Paragraph>

      <SectionTitle>المادة 8 – حدود المسؤولية</SectionTitle>
      <Paragraph>
        لا يتحمّل الطرف الأول أيّ مسؤولية عن الأداء الأكاديمي للزبون أو فقدان المنحة، كما لا يُسأل عن السلوكيات الشخصية داخل أو خارج الجامعة. وتشمل حدود مسؤوليته أيضاً جميع القرارات الصادرة عن الجامعات مثل تغيير التخصص أو تقليص المقاعد أو تعديل البرامج الدراسية. ولا يتحمّل الطرف الأول مسؤولية نتائج الفحص الطبي أو اختبار المخدرات، ولا التأخر في إصدار الوثائق أو الردود من الجامعات. كما لا يتحمّل أي تبعات ناتجة عن ضياع وثائق الطالب أو إهماله للرسائل والتعليمات، أو عن رفض التأشيرة أو طلب السفارة لوثائق إضافية. ولا يضمن الطرف الأول نظافة السكن الجامعي أو جودة الغرف أو إمكانية تغييرها، ولا يتحمّل مسؤولية عدم توفير السكن الجامعي واضطرار الطالب للبحث عن سكن خارجي.
      </Paragraph>

      <SectionTitle>المادة 9 – شروط القبول والمنح</SectionTitle>
      <Paragraph>
        تخصص الجامعات الصينية عدداً محدداً من المقاعد لكل دولة، وتعتمد منحها على النتائج الدراسية، والمقابلات، أو الاختبارات المعتمدة. وفي الغالب تُمنح المنحة للسنة الأولى فقط، ويُطلب من الطالب التقديم سنوياً من أجل تجديدها. ويظل القرار النهائي للتجديد بيد الجامعة وفق أداء الطالب في سنته الأولى، وعدد المقاعد المتاحة، والسياسة الداخلية لكل جامعة. كما أن قرار القبول يبقى من اختصاص الجامعة وحدها، وبمجرد حصولك على القبول من إحدى الجامعات، يتمّ إلغاء جميع طلباتك الأخرى تلقائياً في الجامعات التي اخترتها. وقد تشترط بعض الجامعات تقديم كشف حساب بنكي يفوق 40.000 درهم أو أكثر، وذلك تبعاً لمتطلباتها الخاصة.
      </Paragraph>

      <SectionTitle>المادة 10 – السكن الجامعي</SectionTitle>
      <Paragraph>
        يعتمد السكن الجامعي على الطاقة الاستيعابية ومبدأ الأسبقية، وتمتلك الجامعة كامل الصلاحية في تغيير نوع الغرفة أو موقعها، كما أن الصور قد لا تعكس السكن الفعلي. وقد يكون السكن ممتلئاً أحياناً مما يضطر الطالب إلى الإقامة خارج الحرم الجامعي، مع الإشارة إلى أن الطرف الأول غير مسؤول عن الأعطال أو النظافة داخل السكن. كما قد يخضع السكن خارج الجامعة لإجراءات ترخيص مسبق يلتزم الطالب باحترامها.
      </Paragraph>

      <SectionTitle>المادة 11 – السكن خارج الجامعة</SectionTitle>
      <Paragraph>
        في حالة عدم توفر السكن الجامعي، يتحمّل الزبون مسؤولية إيجاد السكن ودفع تكاليف الإيجار والالتزام بالقوانين المحلية، دون أي تدخل من الطرف الأول في عملية البحث أو التفاوض. وتجدر الإشارة إلى أن عدداً كبيراً من الجامعات الصينية لا يسمح للطلبة بالسكن خارج الحرم الجامعي خلال السنة الأولى، وفي حال رغبة الطالب في السكن الخارجي، يجب عليه الحصول على موافقة مسبقة من جامعته، إذ يبقى القرار النهائي بيد الجامعة حصرياً وفق سياساتها الداخلية.
      </Paragraph>

      <SectionTitle>المادة 12 – إعداد ملف التأشيرة</SectionTitle>
      <Paragraph>
        يلتزم الطرف الأول بتقديم لائحة الوثائق المطلوبة، ومراجعة ملف الزبون، وتوجيهه خلال عملية إيداع طلب التأشيرة، مع التأكيد على أن القرار النهائي يبقى حصرياً للقنصلية. وتشترط القنصلية تقديم كشف حساب بنكي لا يقل عن 60.000 درهم، ويمكن أن يكون هذا الحساب باسم الطالب أو أحد الوالدين أو الضامن المالي.
      </Paragraph>

      <SectionTitle>المادة 13 – فيزا X2</SectionTitle>
      <Paragraph>
        قد يحصل الطالب على تأشيرة X2 بدل تأشيرة X1 إذا أصدرت الجامعة وثيقة القبول (JW) بمدة قصيرة، كما يحدث غالباً في دورة مارس، مما يدفع القنصلية إلى منح تأشيرة قصيرة المدة — لتكون مدتها حوالي 6 أشهر — وذلك بناءً على المدة المحددة في الوثيقة وليس حسب نوع البرنامج.
      </Paragraph>
      
      <SectionTitle>المادة 14 – برنامج اللغة والبرنامج التحضيري / دورة مارس</SectionTitle>
      <Paragraph>
        قد يضطر الطالب إلى مغادرة الصين بعد انتهاء البرنامج نتيجة انتهاء مدة الإقامة أو اختلاف تواريخ الدخول، أو امتثالاً للتوجيهات الصادرة عن الجامعة.
      </Paragraph>

      <SectionTitle>المادة 15 – صحة الوثائق</SectionTitle>
      <Paragraph>
        يجب أن تكون جميع الوثائق صحيحة وقانونية. أي تزوير يؤدي إلى فسخ العقد فوراً دون استرجاع.
      </Paragraph>

      <SectionTitle>المادة 16 – التعاون واحترام الآجال</SectionTitle>
      <Paragraph>
        يلتزم الزبون بتقديم الوثائق خلال 15 يوماً، وحضور المقابلات والاختبارات، وتتبع البريد الإلكتروني والواتساب والرد داخل آجال معقولة، ويؤدي عدم التفاعل لمدة تتجاوز 10 أيام إلى تعليق الملف.
      </Paragraph>

      <SectionTitle>المادة 17 – التخصص والجامعات</SectionTitle>
      <Paragraph>
        يُعدّ اختيار التخصص مسؤولية الزبون، مع العلم أن بعض التخصصات تتطلب عدداً أدنى من الطلبة، وقد تقوم الجامعة بتغيير التخصص إلى شعبة مماثلة عند الضرورة دون أن يترتب عن ذلك أي مسؤولية على الطرف الأول.
      </Paragraph>

      <SectionTitle>المادة 18 – الرسوم الجامعية</SectionTitle>
      <Paragraph>
        يعلم الزبون أن بعض الجامعات قد تطلب أداء رسوم الملف تتراوح بين 200 و800 يوان. قبل إصدار القبول أو المنحة، وأن هذه الشروط تخضع حصرياً لقرارات الجامعة. كما قد تطلب بعض الجامعات من الطالب أداء جزء من الرسوم الدراسية أو رسوم السكن كـ Deposit بعد إصدار القبول المبدئي، وذلك لتأكيد حجز المقعد. ويُخصم هذا المبلغ لاحقاً من الدفعات المستقبلية التي يؤديها الطالب للجامعة.
      </Paragraph>

      <SectionTitle>المادة 19 – الطلبة المقيمين في الصين</SectionTitle>
      <Paragraph>
        إذا كان الطالب يدرس حالياً داخل الصين، فيجب عليه تقديم الوثائق التالية:
      </Paragraph>
      <List>
        <ListItem>شهادة حسن السيرة.</ListItem>
        <ListItem>شهادة متابعة الدراسة.</ListItem>
        <ListItem>بيان النقط.</ListItem>
        <ListItem>السجل الجنائي داخل الصين.</ListItem>
      </List>
      <Paragraph>
        وبعد إنهاء البرنامج الدراسي، يكون الطالب ملزماً بتقديم شهادة التخرج. وفي حال كان الطالب مسجّلاً في برنامج دراسي ويرغب في تغييره، فيتعيّن عليه تقديم رسالة تحويل (Transfer Letter) من جامعته الحالية كوثيقة إضافية إلى جانب الوثائق المذكورة سابقاً، وليس بديلاً عنها.
      </Paragraph>
    </>
  );
};

// --- Contract Part 2 (Articles 20 - 34) ---

export const ContractPart2 = ({ studentInfo, pricing }: { studentInfo: StudentInfo, pricing: PricingConfig }) => {
  // Helper to determine highlight class
  const getRowClass = (isActive: boolean) => 
    isActive ? 'bg-zinc-900 text-white font-bold border-zinc-900' : 'hover:bg-zinc-50';

  // Helper to cell class
  const getCellClass = (isActive: boolean, isBorderLeft: boolean) => 
    `py-2 align-middle ${isBorderLeft ? (isActive ? 'border-white/20 border-l' : 'border-l border-zinc-300') : ''}`;


  return (
    <>
      <SectionTitle>المادة 20 – اختبار CSCA</SectionTitle>
      <Paragraph>
        اختبار CSCA ضروري لأكثر من 300 جامعة في الصين، حيث تُعطي بعض الجامعات أهمية كبيرة لهذا الاختبار وتعتبره شرطاً أساسياً، بينما تتعامل جامعات أخرى معه بشكل شكلي فقط دون تأثير كبير على القبول. تراوح رسوم الاختبار بين 450 و 700 يوان.
      </Paragraph>

      <SectionTitle>المادة 21 – الالتزامات التأديبية</SectionTitle>
      <Paragraph>
        تتمتّع الجامعات الصينية بالصلاحية الكاملة في اتخاذ الإجراءات التأديبية لأسباب مثل الإهمال الدراسي، ضعف التحصيل، الغياب المتكرر، مخالفة القوانين، الإساءة أو التطاول، أو ارتكاب أفعال مخالِفة للقانون الصيني. وتتراوح العقوبات بين تخفيض المنحة، أو سحبها، أو فرض غرامات، أو الطرد النهائي من الصين. ويُقرّ الزبون بأنه يتحمّل المسؤولية الكاملة عن أي عقوبات، ولا يتحمل الطرف الأول أي مسؤولية عن القرارات التأديبية أو تبعاتها.
      </Paragraph>

      <SectionTitle>المادة 22 – الحالة الصحية</SectionTitle>
      <Paragraph>
        يجب التصريح بأي مرض جسدي أو نفسي مسبقاً. ولا يتحمل الطرف الأول أي مسؤولية إذا كشف الفحص الطبي عن مرض لم يُصرّح به. كما لا يتحمل أي مسؤولية عن نتائج اختبار تعاطي المخدرات، بما في ذلك فشل الزبون في اجتيازه.
      </Paragraph>

      <SectionTitle>المادة 23 – الأداء</SectionTitle>
      <div className="my-3 border border-zinc-300 rounded-lg overflow-hidden text-[0.9em]">
        <table className="w-full text-center">
          <thead className="bg-zinc-100 font-bold border-b border-zinc-300">
            <tr>
              <th className="py-2 border-l border-zinc-300">نوع البرنامج</th>
              <th className="py-2 border-l border-zinc-300">مصاريف الملف (درهم)</th>
              <th className="py-2">مصاريف الخدمة (درهم)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
             <tr className={getRowClass(studentInfo.program === 'bachelor')}>
              <td className={getCellClass(studentInfo.program === 'bachelor', true)}>البكالوريوس / برنامج اللغة</td>
              <td className={getCellClass(studentInfo.program === 'bachelor', true)}>{pricing.bachelor.fileFees}</td>
              <td className={getCellClass(studentInfo.program === 'bachelor', false)}>{pricing.bachelor.originalPrice}</td>
            </tr>
            <tr className={getRowClass(studentInfo.program === 'master')}>
              <td className={getCellClass(studentInfo.program === 'master', true)}>الماستر والدكتوراه</td>
              <td className={getCellClass(studentInfo.program === 'master', true)}>{pricing.master.fileFees}</td>
              <td className={getCellClass(studentInfo.program === 'master', false)}>{pricing.master.originalPrice}</td>
            </tr>
            <tr className={getRowClass(studentInfo.program === 'special')}>
              <td className={getCellClass(studentInfo.program === 'special', true)}>دورة مارس + شتنبر</td>
              <td className={getCellClass(studentInfo.program === 'special', true)}>{pricing.special.fileFees}</td>
              <td className={getCellClass(studentInfo.program === 'special', false)}>{pricing.special.originalPrice}</td>
            </tr>
            <tr className={getRowClass(studentInfo.program === 'resident')}>
              <td className={getCellClass(studentInfo.program === 'resident', true)}>الطلبة المقيمين بالصين</td>
              <td className={getCellClass(studentInfo.program === 'resident', true)}>-</td>
              <td className={getCellClass(studentInfo.program === 'resident', false)}>{pricing.resident.originalPrice}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <SectionTitle>المادة 24 – التأخير في الأداء</SectionTitle>
      <Paragraph>
        يتم سداد رسوم الخدمة مباشرة بعد حصول الطالب على القبول الأوّلي من إحدى الجامعات التي قام باختيارها وذلك وفقاً لما هو منصوص عليه في المادة 23. ويترتّب عن أي تأخير في السداد غرامة مالية قدرها 500 درهم أو بنسبة 10% من المبلغ المستحق.
      </Paragraph>

      <SectionTitle>المادة 25 – سياسة الاسترجاع</SectionTitle>
      <Paragraph>
        يتم استرجاع 100% من مصاريف الملف مكتب فرصة خلال الثمانية والأربعين (48) ساعة الأولى من أداء الرسوم، شريطة عدم تقديم أي طلب للجامعات خلال هذه الفترة.
      </Paragraph>
      
      <SectionTitle>المادة 25 مكرّر – حالات الرفض وتأجيل الملف</SectionTitle>
      <Paragraph>
        في حالة رفض طلب الالتحاق من طرف الجامعة أو الجامعات التي تم التقديم لها، يلتزم الزبون باختيار إحدى الجامعات الجديدة المقترَحة من مقدّم الخدمة. ولا يكون الطرف الأول ملزماً بتقديم تقرير مكتوب أو تفسير رسمي لسبب الرفض، باعتبار أن أغلب الجامعات الصينية لا تصدر مراسلات أو تقارير توضيحية بهذا الخصوص، ويُعتبر قرار الرفض نهائياً وغير قابل للاستئناف.
      </Paragraph>
      <Paragraph>
        يتم استرجاع 100% من مصاريف ملف مكتب فرصة إذا تحققت الشروط التالية مجتمعة: تم التقديم إلى جميع الجامعات المتوفّر بها التخصص المطلوب، كان الملف كاملاً ومستوفياً لجميع الوثائق، ولم يحصل الزبون على أي قبول نهائياً.
      </Paragraph>
      <Paragraph>
        <strong>لا يحق للزبون المطالبة بالاسترجاع في الحالات التالية:</strong>
      </Paragraph>
      <List>
        <ListItem>التأخر في تقديم الوثائق المطلوبة.</ListItem>
        <ListItem>الرسوب في اختبار CSCA.</ListItem>
        <ListItem>عدم بلوغ مستوى اللغة المطلوب من الجامعة.</ListItem>
        <ListItem>قيام الزبون بأي فعل يجعل تقديم الخدمة مستحيلاً.</ListItem>
        <ListItem>رفض التأشيرة من القنصلية الصينية لأي سبب.</ListItem>
        <ListItem>عدم ردّ الزبون على المكتب أو الجامعات داخل الآجال المعقولة.</ListItem>
      </List>
      <Paragraph>
        وفي حالة رسوب الزبون في امتحان البكالوريا، يحق له تأجيل ملف التقديم للسنة الجامعية الموالية دون رسوم إضافية، شريطة إبلاغ الطرف الأول داخل أجل لا يتجاوز 7 أيام من تاريخ الإعلان الرسمي عن النتائج. ويظل هذا العقد سارياً، ويتم الاحتفاظ بالخدمات المقدّمة سابقاً، مع إمكانية تحديث الوثائق عند الحاجة.
      </Paragraph>

      <SectionTitle>المادة 26 – المصاريف عند الوصول</SectionTitle>
      <Paragraph>
        تتراوح المصاريف الإجمالية عند الوصول بين 2000 و2600 يوان، وتشمل الفحص الطبي، رخصة الإقامة، التأمين الصحي، والكتب الدراسية.
      </Paragraph>

      <SectionTitle>المادة 27 – الإشعارات</SectionTitle>
      <Paragraph>
        كل المراسلات عبر البريد الإلكتروني أو الواتساب تُعتبر مُبلّغة فور إرسالها. ويجب إبلاغ المكتب بأي مشكل خلال 72 ساعة.
      </Paragraph>

      <SectionTitle>المادة 28 – حصرية التواصل</SectionTitle>
      <Paragraph>
        يُمنع على الزبون التواصل مع الجامعات مباشرة أو مع أي وسيط أو موظف، أو تقديم أي طلبات خارج المكتب إلا بإذن مكتوب، ويترتب عن أي خرق لهذا البند إنهاء العقد دون استرجاع.
      </Paragraph>

      <SectionTitle>المادة 29 – الملكية الفكرية</SectionTitle>
      <Paragraph>
        كل المحتوى والمراسلات والوثائق ملك للطرف الأول ولا يجوز استعمالها دون موافقة رسمية.
      </Paragraph>

      <SectionTitle>المادة 30 – عدم التشهير</SectionTitle>
      <Paragraph>
        يلتزم الزبون بعدم نشر أي محتوى مسيء ضد الطرف الأول. وأي خرق يُخوّل للمكتب متابعة الزبون قضائياً.
      </Paragraph>

      <SectionTitle>المادة 31 – القوة القاهرة</SectionTitle>
      <Paragraph>
        يعفى الطرفان من أي مسؤولية عند وقوع أحداث خارجة عن الإرادة مثل الأوبئة، الإغلاقات، أو القرارات الحكومية.
      </Paragraph>

      <SectionTitle>المادة 32 – إنهاء العقد</SectionTitle>
      <Paragraph>
        يحق للزبون إنهاء العقد في أي وقت عبر رسالة مكتوبة (بريد إلكتروني أو واتساب رسمي). ولا يترتب أي استرجاع إلا وفق المادة الخاصة بالاسترجاع.
      </Paragraph>

      <SectionTitle>المادة 33 – فض النزاعات</SectionTitle>
      <Paragraph>
        في حال تعذّر حلّ النزاع بين الطرف الأول والطرف الثاني بشكل ودي، يقرّ الطرف الثاني بأنه اطّلع على جميع بنود هذا العقد ووافق عليها بكامل إرادته. وعند عدم التوصل إلى تسوية، يُحال النزاع إلى التحكيم أمام الجهة المختصة بمدينة الرباط أو لدى "ICOMA"، وذلك طبقاً للقوانين المغربية الجاري بها العمل.
      </Paragraph>

      <SectionTitle>المادة 34 – الإقرار والتوقيع</SectionTitle>
      <Paragraph>
        يُصرّح الطرف الثاني أنه قرأ العقد بالكامل وفهم جميع بنوده ووافق عليها دون إكراه.
      </Paragraph>
    </>
  );
};

// --- Web View Helper (Displays both parts continuously) ---
export const ContractContent = ({ studentInfo, pricing }: { studentInfo: StudentInfo, pricing: PricingConfig }) => (
  <div className="space-y-4 text-right" dir="rtl">
    <ContractPart1 studentInfo={studentInfo} />
    <ContractPart2 studentInfo={studentInfo} pricing={pricing} />
  </div>
);

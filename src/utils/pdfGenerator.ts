
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { StudentInfo, BrandingConfig } from '../types';

// Helper to wait for an image to fully load and decode
const waitForImage = (img: HTMLImageElement): Promise<void> => {
  return new Promise((resolve) => {
    if (img.complete && img.naturalWidth > 0) {
      resolve();
      return;
    }
    
    const onLoad = () => {
      img.removeEventListener('load', onLoad);
      img.removeEventListener('error', onError);
      resolve();
    };
    
    const onError = () => {
      img.removeEventListener('load', onLoad);
      img.removeEventListener('error', onError);
      console.warn('Image failed to load:', img.id || img.src?.substring(0, 50));
      resolve();
    };
    
    img.addEventListener('load', onLoad);
    img.addEventListener('error', onError);
    
    setTimeout(resolve, 3000);
  });
};

// Fetch image as base64 using fetch API
const fetchImageAsBase64 = async (url: string): Promise<string> => {
  if (!url) return '';
  if (url.startsWith('data:')) return url;
  
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const blob = await response.blob();
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (err) {
    console.warn(`Failed to fetch image ${url}:`, err);
    return '';
  }
};

// Main PDF generation function
export const generatePDF = async (
  studentInfo: StudentInfo, 
  signatureDataUrl: string, 
  withStamp: boolean,
  branding: BrandingConfig
): Promise<File | void> => {
  
  const page1 = document.getElementById('pdf-page-1');
  const page2 = document.getElementById('pdf-page-2');

  if (!page1 || !page2) {
    console.error('Template pages not found');
    return;
  }

  console.log('Starting PDF generation...');

  // Step 1: Pre-load ALL images as base64
  console.log('Step 1: Loading images as base64...');
  
  const [logoBase64, stampBase64, watermarkBase64] = await Promise.all([
    fetchImageAsBase64(branding.logoUrl),
    fetchImageAsBase64(branding.stampUrl),
    fetchImageAsBase64(branding.watermarkUrl)
  ]);
  
  console.log('Logo loaded:', logoBase64 ? 'YES' : 'NO');
  console.log('Stamp loaded:', stampBase64 ? 'YES' : 'NO');
  console.log('Watermark loaded:', watermarkBase64 ? 'YES' : 'NO');

  // Step 2: Populate dynamic text fields (using safe DOM methods to prevent XSS)
  const populate = (prefix: string) => {
    const nameEl = document.getElementById(`${prefix}-name`);
    const idEl = document.getElementById(`${prefix}-id`);
    const dateEl = document.getElementById(`${prefix}-date`);
    
    if (nameEl) {
       nameEl.textContent = '';
       nameEl.appendChild(document.createTextNode(studentInfo.fullName));
       if (studentInfo.guardianName) {
         const guardianSpan = document.createElement('span');
         guardianSpan.style.fontSize = '0.8em';
         guardianSpan.style.color = '#555';
         guardianSpan.textContent = ` (الولي: ${studentInfo.guardianName})`;
         nameEl.appendChild(guardianSpan);
       }
    }
    
    if (idEl) {
       idEl.textContent = '';
       idEl.appendChild(document.createTextNode(studentInfo.nationalId));
       if (studentInfo.guardianId) {
         const guardianIdSpan = document.createElement('span');
         guardianIdSpan.style.fontSize = '0.8em';
         guardianIdSpan.style.color = '#555';
         guardianIdSpan.textContent = ` (هوية الولي: ${studentInfo.guardianId})`;
         idEl.appendChild(guardianIdSpan);
       }
    }

    if (dateEl) {
      dateEl.textContent = new Date().toLocaleDateString('ar-MA', { 
        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
      });
    }
  };

  populate('p1');
  populate('p2');

  // Step 3: Update all images BY ID with base64 data
  console.log('Step 2: Updating image sources by ID...');
  
  const allImagesToWait: HTMLImageElement[] = [];
  
  // Logo (page 1 only)
  const logoImg = document.getElementById('pdf-logo') as HTMLImageElement;
  if (logoImg && logoBase64) {
    logoImg.src = logoBase64;
    allImagesToWait.push(logoImg);
    console.log('Logo src updated');
  }
  
  // Watermarks (both pages)
  const watermark1 = document.getElementById('pdf-watermark-1') as HTMLImageElement;
  if (watermark1 && watermarkBase64) {
    watermark1.src = watermarkBase64;
    allImagesToWait.push(watermark1);
    console.log('Watermark 1 src updated');
  }
  
  const watermark2 = document.getElementById('pdf-watermark-2') as HTMLImageElement;
  if (watermark2 && watermarkBase64) {
    watermark2.src = watermarkBase64;
    allImagesToWait.push(watermark2);
    console.log('Watermark 2 src updated');
  }
  
  // Signature
  const sigImg = document.getElementById('pdf-signature-img') as HTMLImageElement;
  if (sigImg && signatureDataUrl) {
    sigImg.src = signatureDataUrl;
    allImagesToWait.push(sigImg);
    console.log('Signature src updated');
  }
  
  // Stamp - CRITICAL
  const stampOverlay = document.getElementById('pdf-stamp-overlay') as HTMLImageElement;
  if (stampOverlay) {
    if (withStamp && stampBase64) {
      stampOverlay.src = stampBase64;
      stampOverlay.style.opacity = '1';
      stampOverlay.style.visibility = 'visible';
      stampOverlay.style.display = 'block';
      allImagesToWait.push(stampOverlay);
      console.log('Stamp src updated and set to VISIBLE');
    } else {
      stampOverlay.style.opacity = '0';
      stampOverlay.style.visibility = 'hidden';
      console.log('Stamp hidden');
    }
  }

  // Step 4: Move container into view for capture
  console.log('Step 3: Preparing DOM for capture...');
  
  const parentContainer = page1.parentElement;
  let originalParentStyle = '';
  if (parentContainer) {
    originalParentStyle = parentContainer.getAttribute('style') || '';
    parentContainer.style.cssText = 'position: fixed; top: 0; left: 0; z-index: -9999; opacity: 1; pointer-events: none;';
  }
  
  page1.style.display = 'block';
  page2.style.display = 'block';
  
  // Force layout recalculation
  void page1.offsetHeight;
  void page2.offsetHeight;

  // Step 5: Wait for ALL images to fully load
  console.log(`Step 4: Waiting for ${allImagesToWait.length} images to load...`);
  await Promise.all(allImagesToWait.map(waitForImage));
  
  // Extra delay to ensure rendering is complete
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Verify all images are loaded
  console.log('Image verification:');
  allImagesToWait.forEach(img => {
    console.log(`  ${img.id}: complete=${img.complete}, naturalWidth=${img.naturalWidth}`);
  });
  
  try {
    // Step 6: Capture pages
    console.log('Step 5: Capturing pages...');
    
    const options = {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      width: 1600,
      windowWidth: 1600,
      height: 1131,
      windowHeight: 1131,
      backgroundColor: '#ffffff'
    };

    const canvas1 = await html2canvas(page1, options);
    console.log('Page 1 captured');
    
    const canvas2 = await html2canvas(page2, options);
    console.log('Page 2 captured');

    // Step 7: Create PDF
    console.log('Step 6: Creating PDF...');
    
    const pdf = new jsPDF('l', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgData1 = canvas1.toDataURL('image/jpeg', 0.95);
    pdf.addImage(imgData1, 'JPEG', 0, 0, pdfWidth, pdfHeight);

    pdf.addPage();
    const imgData2 = canvas2.toDataURL('image/jpeg', 0.95);
    pdf.addImage(imgData2, 'JPEG', 0, 0, pdfWidth, pdfHeight);

    const fileName = `Foorsa X ${studentInfo.fullName}.pdf`;
    pdf.save(fileName);
    
    console.log('PDF generated successfully!');

    const blob = pdf.output('blob');
    return new File([blob], fileName, { type: 'application/pdf' });

  } catch (err) {
    console.error('PDF Generation failed:', err);
  } finally {
    // Restore hidden state
    page1.style.display = 'none';
    page2.style.display = 'none';
    
    if (parentContainer) {
      parentContainer.setAttribute('style', originalParentStyle);
    }
  }
};

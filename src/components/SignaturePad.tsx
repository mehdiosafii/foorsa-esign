import React, { useRef, useState, useEffect } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Eraser, Check, PenTool } from 'lucide-react';

interface SignaturePadProps {
  onSave: (dataUrl: string) => void;
  onCancel: () => void;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({ onSave, onCancel }) => {
  const sigCanvas = useRef<SignatureCanvas>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isEmpty, setIsEmpty] = useState(true);
  const [canvasWidth, setCanvasWidth] = useState(300);

  // Resize canvas to fit container
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setCanvasWidth(containerRef.current.offsetWidth);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const clear = () => {
    sigCanvas.current?.clear();
    setIsEmpty(true);
  };

  const save = () => {
    if (sigCanvas.current && !sigCanvas.current.isEmpty()) {
      // Get data with trimming to ensure tight crop
      const dataUrl = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');
      onSave(dataUrl);
    }
  };

  const handleBegin = () => {
    setIsEmpty(false);
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex justify-between items-center mb-3 px-1">
        <h4 className="text-sm font-semibold text-zinc-800 flex items-center gap-2">
            <PenTool size={16} />
            منطقة التوقيع
        </h4>
        <span className="text-xs text-zinc-400">يرجى التوقيع في المساحة أدناه</span>
      </div>

      <div 
        ref={containerRef}
        className="relative group w-full touch-none" 
      >
        <div className="bg-white rounded-2xl overflow-hidden shadow-card border border-zinc-200 transition-colors hover:border-zinc-300 relative">
            {/* Background Lines for Writing Aid */}
            <div className="absolute inset-0 pointer-events-none opacity-5 flex flex-col justify-center">
                <div className="border-b border-black w-3/4 mx-auto"></div>
            </div>
            
            <SignatureCanvas
                ref={sigCanvas}
                penColor="black"
                // Tuning for perfect touch response
                velocityFilterWeight={0.5} // Controls smoothness based on speed
                minWidth={1.5} // Minimum stroke width
                maxWidth={3.5} // Maximum stroke width (pressure simulation)
                dotSize={1.5} // Dot size for single taps
                canvasProps={{
                    className: 'w-full h-64 cursor-crosshair bg-transparent',
                    style: { width: '100%', height: '256px' }
                }}
                onBegin={handleBegin}
            />
            
            {isEmpty && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-zinc-200 text-4xl font-serif italic opacity-30">Sign Here</span>
                </div>
            )}
        </div>
      </div>
      
      <div className="flex gap-3 justify-end mt-4">
        <button
          onClick={clear}
          className="px-5 py-2.5 text-xs font-medium text-zinc-500 bg-zinc-100 rounded-xl hover:bg-zinc-200 hover:text-black transition-all flex items-center gap-2"
        >
          <Eraser size={14} />
          مسح
        </button>
        <button
          onClick={save}
          disabled={isEmpty}
          className={`px-8 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all transform shadow-lg
            ${isEmpty 
              ? 'bg-zinc-100 text-zinc-300 shadow-none cursor-not-allowed' 
              : 'bg-black text-white hover:bg-zinc-800 hover:scale-105 active:scale-95'}`}
        >
          <span>اعتماد التوقيع</span>
          <Check size={16} />
        </button>
      </div>
    </div>
  );
};
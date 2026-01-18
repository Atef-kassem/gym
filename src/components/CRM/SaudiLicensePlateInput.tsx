import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

interface SaudiLicensePlateInputProps {
  plateLetters: string[];
  plateDigits: string[];
  onLetterChange: (index: number, value: string) => void;
  onDigitChange: (index: number, value: string) => void;
  className?: string;
}

export function SaudiLicensePlateInput({
  plateLetters,
  plateDigits,
  onLetterChange,
  onDigitChange,
  className = ""
}: SaudiLicensePlateInputProps) {

  const handleLetterChange = (index: number, value: string) => {
    if (value.length <= 1 && /^[أ-ي]*$/.test(value)) {
      onLetterChange(index, value);
      
      // الانتقال للحقل التالي تلقائياً
      if (value && index < 2) {
        const nextInput = document.getElementById(`saudi-letter-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleDigitChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      onDigitChange(index, value);
      
      // الانتقال للحقل التالي تلقائياً
      if (value && index < 3) {
        const nextInput = document.getElementById(`saudi-digit-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <Label className="text-right block font-semibold text-gray-700">رقم اللوحة *</Label>
      
      {/* اللوحة المصرية - تصميم مطابق للصورة */}
      <div className="relative bg-white border-2 border-black rounded-lg mx-auto max-w-md">
        <div className="flex" dir="rtl">
          
          {/* القسم الأيمن - شعار المملكة */}
          <div className="w-16 flex flex-col items-center justify-center border-l-2 border-black py-4">
            <div className="text-black text-xs font-bold mb-1">🏛️</div>
            <div className="text-black text-[10px] font-bold leading-tight">K<br/>S<br/>A</div>
            <div className="w-3 h-3 bg-black rounded-full mt-2"></div>
          </div>

          {/* القسم الأوسط - الأحرف العربية */}
          <div className="flex-1 flex items-center justify-center py-6 border-l-2 border-black">
            <div className="flex gap-2">
              {plateLetters.map((letter, index) => (
                <Input
                  key={`saudi-letter-${index}`}
                  id={`saudi-letter-${index}`}
                  type="text"
                  value={letter}
                  onChange={(e) => handleLetterChange(index, e.target.value)}
                  className="w-12 h-14 text-center text-3xl font-bold border-none bg-transparent focus:outline-none focus:ring-0 p-0"
                  maxLength={1}
                  style={{
                    fontFamily: "'Noto Sans Arabic', 'Arial', sans-serif",
                    color: "#000"
                  }}
                />
              ))}
            </div>
          </div>

          {/* القسم الأيسر - الأرقام */}
          <div className="flex-1 flex items-center justify-center py-6" dir="ltr">
            <div className="flex gap-2">
              {plateDigits.map((digit, index) => (
                <Input
                  key={`saudi-digit-${index}`}
                  id={`saudi-digit-${index}`}
                  type="text"
                  value={digit}
                  onChange={(e) => handleDigitChange(index, e.target.value)}
                  className="w-12 h-14 text-center text-3xl font-bold border-none bg-transparent focus:outline-none focus:ring-0 p-0"
                  maxLength={1}
                  dir="ltr"
                  style={{
                    fontFamily: "'Arial', 'Helvetica', sans-serif",
                    color: "#000"
                  }}
                />
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* معاينة رقم اللوحة الكامل */}
      <div className="text-center">
        <div className="inline-block bg-gray-100 px-4 py-2 rounded-lg border">
          <span className="text-sm text-gray-600">رقم اللوحة:</span>
          <div className="font-mono text-lg font-bold text-gray-800 mt-1" dir="rtl">
            {plateLetters.filter(l => l).join(' ')} {plateDigits.filter(d => d).join('')}
          </div>
        </div>
      </div>
    </div>
  );
}
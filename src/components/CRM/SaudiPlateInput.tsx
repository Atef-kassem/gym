import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SaudiPlateInputProps {
  value?: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
}

type PlateType = 'private' | 'commercial' | 'taxi' | 'diplomatic';

export function SaudiPlateInput({ value, onChange, error, required }: SaudiPlateInputProps) {
  const [plateType, setPlateType] = useState<PlateType>('private');
  
  // الصف العلوي - عربي
  const [arabicLetters, setArabicLetters] = useState(['', '', '']);
  const [arabicNumbers, setArabicNumbers] = useState(['', '', '', '']);
  
  // الصف السفلي - إنجليزي
  const [englishLetters, setEnglishLetters] = useState(['', '', '']);
  const [englishNumbers, setEnglishNumbers] = useState(['', '', '', '']);

  // خريطة التحويل بين الأحرف العربية والإنجليزية
  const arabicToEnglish = {
    'أ': 'A', 'ا': 'A', 'ب': 'B', 'ج': 'C', 'د': 'D', 'ر': 'R', 
    'س': 'S', 'ص': 'X', 'ط': 'T', 'ع': 'E', 'ق': 'G', 'ك': 'K', 
    'ل': 'L', 'ز': 'Z', 'ن': 'N', 'ه': 'H', 'و': 'U', 'ي': 'V',
    'ح': 'J', 'م': 'Z'
  };
  
  const englishToArabic = {
    'A': 'أ', 'B': 'ب', 'C': 'ج', 'D': 'د', 'R': 'ر', 'S': 'س', 
    'X': 'ص', 'T': 'ط', 'E': 'ع', 'G': 'ق', 'K': 'ك', 'L': 'ل', 
    'Z': 'م', 'N': 'ن', 'H': 'ه', 'U': 'و', 'V': 'ي',
    'J': 'ح'
  };

  // أرقام عربية وإنجليزية
  const arabicToEnglishNumbers = {
    '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4', 
    '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9'
  };
  
  const englishToArabicNumbers = {
    '0': '٠', '1': '١', '2': '٢', '3': '٣', '4': '٤', 
    '5': '٥', '6': '٦', '7': '٧', '8': '٨', '9': '٩'
  };

  // أنواع اللوحات
  const plateTypes = {
    private: { name: 'لوحة خاصة', color: 'bg-white', border: 'border-black', sideColor: 'bg-gray-200' },
    commercial: { name: 'لوحة تجارية', color: 'bg-white', border: 'border-black', sideColor: 'bg-yellow-400' },
    taxi: { name: 'لوحة تاكسي', color: 'bg-white', border: 'border-black', sideColor: 'bg-blue-400' },
    diplomatic: { name: 'لوحة دبلوماسية', color: 'bg-white', border: 'border-black', sideColor: 'bg-green-400' }
  };

  // تحديث القيمة الكاملة
  const updateFullValue = () => {
    if (!plateType) return;
    const arabicLettersText = arabicLetters.filter(l => l).join(' ');
    const arabicNumbersText = arabicNumbers.filter(n => n).join('');
    const englishLettersText = englishLetters.filter(l => l).join(' ');
    const englishNumbersText = englishNumbers.filter(n => n).join('');
    
    const arabicRow = arabicLettersText && arabicNumbersText ? `${arabicLettersText} ${arabicNumbersText}` : (arabicLettersText || arabicNumbersText);
    const englishRow = englishLettersText && englishNumbersText ? `${englishLettersText} ${englishNumbersText}` : (englishLettersText || englishNumbersText);
    const fullValue = `[${plateTypes[plateType].name}] ${arabicRow} | ${englishRow}`;
    onChange(fullValue);
  };

  // التعامل مع الأحرف العربية
  const handleArabicLetterChange = (index: number, value: string) => {
    const input = value.slice(-1).toUpperCase(); // آخر حرف مكتوب
    let arabicChar = '';
    let englishChar = '';

    // تحديد ما إذا كان الحرف عربي أم إنجليزي
    if (/[ا-ي]/.test(input)) {
      arabicChar = input;
      englishChar = arabicToEnglish[input] || '';
    } else if (/[A-Z]/.test(input)) {
      englishChar = input;
      arabicChar = englishToArabic[input] || '';
    }

    if (arabicChar) {
      // تحديث الأحرف العربية
      const newArabicLetters = [...arabicLetters];
      newArabicLetters[index] = arabicChar;
      setArabicLetters(newArabicLetters);

      // تحديث الأحرف الإنجليزية المقابلة
      const newEnglishLetters = [...englishLetters];
      newEnglishLetters[index] = englishChar;
      setEnglishLetters(newEnglishLetters);

      // الانتقال للمربع التالي
      if (index < 2) {
        const nextInput = document.getElementById(`arabic-letter-${index + 1}`);
        nextInput?.focus();
      } else {
        const nextInput = document.getElementById(`arabic-number-0`);
        nextInput?.focus();
      }

      setTimeout(updateFullValue, 0);
    }
  };

  // التعامل مع الأرقام العربية
  const handleArabicNumberChange = (index: number, value: string) => {
    const input = value.slice(-1); // آخر رقم مكتوب
    let arabicNum = '';
    let englishNum = '';

    // تحديد ما إذا كان الرقم عربي أم إنجليزي
    if (/[٠-٩]/.test(input)) {
      arabicNum = input;
      englishNum = arabicToEnglishNumbers[input] || '';
    } else if (/[0-9]/.test(input)) {
      englishNum = input;
      arabicNum = englishToArabicNumbers[input] || '';
    }

    if (arabicNum) {
      // تحديث الأرقام العربية
      const newArabicNumbers = [...arabicNumbers];
      newArabicNumbers[index] = arabicNum;
      setArabicNumbers(newArabicNumbers);

      // تحديث الأرقام الإنجليزية المقابلة
      const newEnglishNumbers = [...englishNumbers];
      newEnglishNumbers[index] = englishNum;
      setEnglishNumbers(newEnglishNumbers);

      // الانتقال للمربع التالي
      if (index < 3) {
        const nextInput = document.getElementById(`arabic-number-${index + 1}`);
        nextInput?.focus();
      } else {
        const nextInput = document.getElementById(`english-letter-0`);
        nextInput?.focus();
      }

      setTimeout(updateFullValue, 0);
    }
  };

  // التعامل مع الأحرف الإنجليزية
  const handleEnglishLetterChange = (index: number, value: string) => {
    const input = value.slice(-1).toUpperCase(); // آخر حرف مكتوب
    let arabicChar = '';
    let englishChar = '';

    // تحديد ما إذا كان الحرف عربي أم إنجليزي
    if (/[ا-ي]/.test(input)) {
      arabicChar = input;
      englishChar = arabicToEnglish[input] || '';
    } else if (/[A-Z]/.test(input)) {
      englishChar = input;
      arabicChar = englishToArabic[input] || '';
    }

    if (englishChar) {
      // تحديث الأحرف الإنجليزية
      const newEnglishLetters = [...englishLetters];
      newEnglishLetters[index] = englishChar;
      setEnglishLetters(newEnglishLetters);

      // تحديث الأحرف العربية المقابلة
      const newArabicLetters = [...arabicLetters];
      newArabicLetters[index] = arabicChar;
      setArabicLetters(newArabicLetters);

      // الانتقال للمربع التالي
      if (index < 2) {
        const nextInput = document.getElementById(`english-letter-${index + 1}`);
        nextInput?.focus();
      } else {
        const nextInput = document.getElementById(`english-number-0`);
        nextInput?.focus();
      }

      setTimeout(updateFullValue, 0);
    }
  };

  // التعامل مع الأرقام الإنجليزية
  const handleEnglishNumberChange = (index: number, value: string) => {
    const input = value.slice(-1); // آخر رقم مكتوب
    let arabicNum = '';
    let englishNum = '';

    // تحديد ما إذا كان الرقم عربي أم إنجليزي
    if (/[٠-٩]/.test(input)) {
      arabicNum = input;
      englishNum = arabicToEnglishNumbers[input] || '';
    } else if (/[0-9]/.test(input)) {
      englishNum = input;
      arabicNum = englishToArabicNumbers[input] || '';
    }

    if (englishNum) {
      // تحديث الأرقام الإنجليزية
      const newEnglishNumbers = [...englishNumbers];
      newEnglishNumbers[index] = englishNum;
      setEnglishNumbers(newEnglishNumbers);

      // تحديث الأرقام العربية المقابلة
      const newArabicNumbers = [...arabicNumbers];
      newArabicNumbers[index] = arabicNum;
      setArabicNumbers(newArabicNumbers);

      // الانتقال للمربع التالي
      if (index < 3) {
        const nextInput = document.getElementById(`english-number-${index + 1}`);
        nextInput?.focus();
      }

      setTimeout(updateFullValue, 0);
    }
  };

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium text-gray-700">
        رقم اللوحة {required && <span className="text-red-500">*</span>}
      </Label>
      
      {/* اختيار نوع اللوحة */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-600">نوع اللوحة</Label>
        <Select value={plateType} onValueChange={(value: PlateType) => setPlateType(value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="اختر نوع اللوحة" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(plateTypes).map(([key, type]) => (
              <SelectItem key={key} value={key}>
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded ${type.color} ${type.border}`}></div>
                  {type.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* لوحة المشروب المصرية */}
      <div className={`${plateTypes[plateType].color} border-2 ${plateTypes[plateType].border} rounded-lg overflow-hidden max-w-sm mx-auto`}>
        
        {/* القسم الجانبي - KSA */}
        <div className="flex">
          <div className={`w-12 ${plateTypes[plateType].sideColor} border-r-2 border-black flex flex-col items-center justify-center py-4`}>
            {/* الشعار المصري */}
            <div className="text-black text-xs mb-1">
              <img 
                src="/lovable-uploads/64fbe939-a9e1-4339-9eff-8ba024552326.png" 
                alt="شعار المملكة العربية المصرية"
                className="w-4 h-4 object-contain"
              />
            </div>
            {/* KSA */}
            <div className="text-black text-[10px] font-bold leading-tight text-center">K<br/>S<br/>A</div>
            {/* النقطة السوداء */}
            <div className="w-2 h-2 bg-black rounded-full mt-2"></div>
          </div>
          
          <div className="flex-1 p-4">
            {/* الصف العلوي - عربي */}
            <div className="flex items-center justify-center gap-2 mb-3 pb-3 border-b border-gray-400">
              {/* الأحرف العربية */}
              <div className="flex gap-1" dir="rtl">
                {arabicLetters.map((letter, index) => (
                  <Input
                    key={`arabic-letter-${index}`}
                    id={`arabic-letter-${index}`}
                    value={letter}
                    onChange={(e) => handleArabicLetterChange(index, e.target.value)}
                    className="w-8 h-10 text-center border-none bg-transparent focus:ring-0 text-lg font-bold text-black p-0"
                    maxLength={1}
                    dir="rtl"
                    placeholder="ل"
                  />
                ))}
              </div>
              
              {/* خط فاصل */}
              <div className="w-px h-6 bg-black mx-2"></div>
              
              {/* الأرقام العربية */}
              <div className="flex gap-1" dir="rtl">
                {arabicNumbers.map((number, index) => (
                  <Input
                    key={`arabic-number-${index}`}
                    id={`arabic-number-${index}`}
                    value={number}
                    onChange={(e) => handleArabicNumberChange(index, e.target.value)}
                    className="w-8 h-10 text-center border-none bg-transparent focus:ring-0 text-lg font-bold text-black p-0"
                    maxLength={1}
                    dir="rtl"
                    placeholder="٧"
                  />
                ))}
              </div>
            </div>

            {/* الصف السفلي - إنجليزي */}
            <div className="flex items-center justify-center gap-2">
              {/* الأحرف الإنجليزية */}
              <div className="flex gap-1" dir="ltr">
                {englishLetters.map((letter, index) => (
                  <Input
                    key={`english-letter-${index}`}
                    id={`english-letter-${index}`}
                    value={letter}
                    onChange={(e) => handleEnglishLetterChange(index, e.target.value)}
                    className="w-8 h-10 text-center border-none bg-transparent focus:ring-0 text-lg font-bold text-black p-0"
                    maxLength={1}
                    dir="ltr"
                    placeholder="T"
                  />
                ))}
              </div>
              
              {/* خط فاصل */}
              <div className="w-px h-6 bg-black mx-2"></div>
              
              {/* الأرقام الإنجليزية */}
              <div className="flex gap-1" dir="ltr">
                {englishNumbers.map((number, index) => (
                  <Input
                    key={`english-number-${index}`}
                    id={`english-number-${index}`}
                    value={number}
                    onChange={(e) => handleEnglishNumberChange(index, e.target.value)}
                    className="w-8 h-10 text-center border-none bg-transparent focus:ring-0 text-lg font-bold text-black p-0"
                    maxLength={1}
                    dir="ltr"
                    placeholder="7"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* عرض القيمة النهائية */}
      <div className="text-center">
        <div className="text-sm text-gray-600">
          النتيجة: <span className="font-mono font-bold text-blue-600">{value || 'لم يتم الإدخال'}</span>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 mt-1 text-center">{error}</p>
      )}
    </div>
  );
}
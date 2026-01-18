import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, AlertCircle } from "lucide-react";

interface SaudiPlateInputProps {
  value?: string;
  onChange: (value: string) => void;
  onValidChange?: (isValid: boolean) => void;
  placeholder?: string;
  className?: string;
}

const englishToArabicMap: Record<string, string> = {
  A: "أ",
  B: "ب",
  J: "ج",
  D: "د",
  R: "ر",
  S: "س",
  X: "ص",
  T: "ط",
  U: "ع",
  G: "ق",
  K: "ك",
  L: "ل",
  Z: "م",
  N: "ن",
  H: "ه",
  W: "و",
  Y: "ي",
  V: "ف",
};

const arabicToEnglishMap: Record<string, string> = {
  أ: "A",
  ب: "B",
  ج: "J",
  د: "D",
  ر: "R",
  س: "S",
  ص: "X",
  ط: "T",
  ع: "U",
  ق: "G",
  ك: "K",
  ل: "L",
  م: "Z",
  ن: "N",
  ه: "H",
  و: "W",
  ي: "Y",
  ف: "V",
};

// الحروف المسموحة في لوحات  الكافية المصرية
const allowedArabicLetters = Object.keys(arabicToEnglishMap);
const allowedEnglishLetters = Object.keys(englishToArabicMap);

export function SaudiPlateInput({
  value = "",
  onChange,
  onValidChange,
  placeholder = "مثال: أبج1234",
  className,
}: SaudiPlateInputProps) {
  const [letter1, setLetter1] = useState("");
  const [letter2, setLetter2] = useState("");
  const [letter3, setLetter3] = useState("");
  const [number1, setNumber1] = useState("");
  const [number2, setNumber2] = useState("");
  const [number3, setNumber3] = useState("");
  const [number4, setNumber4] = useState("");

  const [isValid, setIsValid] = useState(false);
  const [showEnglish, setShowEnglish] = useState(false);

  const letter1Ref = useRef<HTMLInputElement>(null);
  const letter2Ref = useRef<HTMLInputElement>(null);
  const letter3Ref = useRef<HTMLInputElement>(null);
  const number1Ref = useRef<HTMLInputElement>(null);
  const number2Ref = useRef<HTMLInputElement>(null);
  const number3Ref = useRef<HTMLInputElement>(null);
  const number4Ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value) {
      const arabicMatch = value.match(
        /^([أبجدرسصطعقكلمنهوىيف]{1,3})(\d{1,4})$/
      );
      const englishMatch = value.match(
        /^([ABJDRSXTUGKLZNHWYV]{1,3})(\d{1,4})$/
      );

      if (arabicMatch || englishMatch) {
        const letters = arabicMatch ? arabicMatch[1] : englishMatch[1];
        const numbers = arabicMatch ? arabicMatch[2] : englishMatch[2];

        setLetter1(letters[0] || "");
        setLetter2(letters[1] || "");
        setLetter3(letters[2] || "");
        setNumber1(numbers[0] || "");
        setNumber2(numbers[1] || "");
        setNumber3(numbers[2] || "");
        setNumber4(numbers[3] || "");

        setShowEnglish(!!englishMatch);
      } else {
        setLetter1("");
        setLetter2("");
        setLetter3("");
        setNumber1("");
        setNumber2("");
        setNumber3("");
        setNumber4("");
      }
    } else {
      setLetter1("");
      setLetter2("");
      setLetter3("");
      setNumber1("");
      setNumber2("");
      setNumber3("");
      setNumber4("");
    }
  }, [value]);

  useEffect(() => {
    const valid =
      letter1 && letter2 && letter3 && number1 && number2 && number3 && number4;
    setIsValid(!!valid);
    onValidChange?.(!!valid);
  }, [
    letter1,
    letter2,
    letter3,
    number1,
    number2,
    number3,
    number4,
    onValidChange,
  ]);

  useEffect(() => {
    const letters = letter1 + letter2 + letter3;
    const numbers = number1 + number2 + number3 + number4;
    const fullValue = letters + numbers;

    if (fullValue !== value && (letters.length > 0 || numbers.length > 0)) {
      onChange(fullValue);
    }
  }, [letter1, letter2, letter3, number1, number2, number3, number4]);

  const handleLetterChange =
    (
      currentValue: string,
      setValue: React.Dispatch<React.SetStateAction<string>>,
      nextRef: React.RefObject<HTMLInputElement> | null
    ) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let input = e.target.value.toUpperCase();

      input = input.replace(/[0-9\s]/g, "");

      const hasArabic = /[أبجدرسصطعقكلمنهوىيف]/.test(input);
      const hasEnglish = /[ABJDRSXTUGKLZNHWYV]/.test(input);

      if (hasArabic && hasEnglish) {
        input = input
          .split("")
          .map((char) => englishToArabicMap[char] || char)
          .join("");
        setShowEnglish(false);
      } else if (hasEnglish) {
        setShowEnglish(true);
      } else if (hasArabic) {
        setShowEnglish(false);
      }

      if (showEnglish || hasEnglish) {
        input = input
          .split("")
          .filter((char) => allowedEnglishLetters.includes(char))
          .join("");
      } else {
        input = input
          .split("")
          .filter((char) => allowedArabicLetters.includes(char))
          .join("");
      }

      const firstChar = input.slice(0, 1);
      setValue(firstChar);

      if (firstChar && nextRef?.current) {
        setTimeout(() => {
          nextRef.current?.focus();
        }, 10);
      }
    };

  const handleNumberChange =
    (
      setValue: React.Dispatch<React.SetStateAction<string>>,
      nextRef: React.RefObject<HTMLInputElement> | null
    ) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let input = e.target.value;

      input = input.replace(/[^0-9]/g, "");

      const firstDigit = input.slice(0, 1);
      setValue(firstDigit);

      if (firstDigit && nextRef?.current) {
        setTimeout(() => {
          nextRef.current?.focus();
        }, 10);
      }
    };

  const handleKeyDown =
    (currentValue: string, prevRef: React.RefObject<HTMLInputElement> | null) =>
    (e: React.KeyboardEvent) => {
      if (e.key === "Backspace" && currentValue === "" && prevRef?.current) {
        e.preventDefault();
        prevRef.current.focus();
      }
    };

  const letters = letter1 + letter2 + letter3;
  const numbers = number1 + number2 + number3 + number4;

  const getConvertedDisplay = () => {
    if (!letters) return "";

    if (showEnglish) {
      return (
        letters
          .split("")
          .map((char) => englishToArabicMap[char] || char)
          .join("") + numbers
      );
    } else {
      return (
        letters
          .split("")
          .map((char) => arabicToEnglishMap[char] || char)
          .join("") + numbers
      );
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {/* حقول الإدخال مباشرة بدون حاوية خلفية */}
      <div className="flex items-center justify-center gap-1 mb-4">
        {/* حقول الحروف */}
        <div className="flex gap-1">
          <Input
            ref={letter1Ref}
            value={letter1}
            onChange={handleLetterChange(letter1, setLetter1, letter2Ref)}
            onKeyDown={handleKeyDown(letter1, null)}
            placeholder="أ"
            maxLength={1}
            className="w-8 h-8 text-center text-sm font-bold rounded border border-gray-300 focus:border-blue-500 transition-all duration-200"
            dir={showEnglish ? "ltr" : "rtl"}
          />

          <Input
            ref={letter2Ref}
            value={letter2}
            onChange={handleLetterChange(letter2, setLetter2, letter3Ref)}
            onKeyDown={handleKeyDown(letter2, letter1Ref)}
            placeholder="ب"
            maxLength={1}
            className="w-8 h-8 text-center text-sm font-bold rounded border border-gray-300 focus:border-blue-500 transition-all duration-200"
            dir={showEnglish ? "ltr" : "rtl"}
          />

          <Input
            ref={letter3Ref}
            value={letter3}
            onChange={handleLetterChange(letter3, setLetter3, number1Ref)}
            onKeyDown={handleKeyDown(letter3, letter2Ref)}
            placeholder="ج"
            maxLength={1}
            className="w-8 h-8 text-center text-sm font-bold rounded border border-gray-300 focus:border-blue-500 transition-all duration-200"
            dir={showEnglish ? "ltr" : "rtl"}
          />
        </div>

        {/* فاصل صغير */}
        <div className="w-2 h-px bg-gray-300 mx-1"></div>

        {/* حقول الأرقام */}
        <div className="flex gap-1">
          <Input
            ref={number1Ref}
            value={number1}
            onChange={handleNumberChange(setNumber1, number2Ref)}
            onKeyDown={handleKeyDown(number1, letter3Ref)}
            placeholder="1"
            maxLength={1}
            className="w-8 h-8 text-center text-sm font-bold rounded border border-gray-300 focus:border-green-500 transition-all duration-200"
            inputMode="numeric"
          />

          <Input
            ref={number2Ref}
            value={number2}
            onChange={handleNumberChange(setNumber2, number3Ref)}
            onKeyDown={handleKeyDown(number2, number1Ref)}
            placeholder="2"
            maxLength={1}
            className="w-8 h-8 text-center text-sm font-bold rounded border border-gray-300 focus:border-green-500 transition-all duration-200"
            inputMode="numeric"
          />

          <Input
            ref={number3Ref}
            value={number3}
            onChange={handleNumberChange(setNumber3, number4Ref)}
            onKeyDown={handleKeyDown(number3, number2Ref)}
            placeholder="3"
            maxLength={1}
            className="w-8 h-8 text-center text-sm font-bold rounded border border-gray-300 focus:border-green-500 transition-all duration-200"
            inputMode="numeric"
          />

          <Input
            ref={number4Ref}
            value={number4}
            onChange={handleNumberChange(setNumber4, null)}
            onKeyDown={handleKeyDown(number4, number3Ref)}
            placeholder="4"
            maxLength={1}
            className="w-8 h-8 text-center text-sm font-bold rounded border border-gray-300 focus:border-green-500 transition-all duration-200"
            inputMode="numeric"
          />
        </div>
      </div>

      {/* مؤشر الصحة */}
      <div className="flex justify-center">
        {isValid ? (
          <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-200">
            <Check className="h-3 w-3" />
            <span className="text-xs font-medium">صالحة</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            <AlertCircle className="h-3 w-3" />
            <span className="text-xs font-medium">
              يحتاج {3 - letters.length} حروف و {4 - numbers.length} أرقام
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

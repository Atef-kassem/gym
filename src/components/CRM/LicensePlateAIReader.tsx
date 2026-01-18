import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  Camera, 
  Scan, 
  CheckCircle, 
  X, 
  RotateCcw,
  Zap,
  Eye
} from 'lucide-react';

interface LicensePlateAIReaderProps {
  onPlateDetected: (plateValue: string) => void;
}

export function LicensePlateAIReader({ onPlateDetected }: LicensePlateAIReaderProps) {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [detectedText, setDetectedText] = useState<string>('');
  const [isCapturing, setIsCapturing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // تشغيل الكاميرا
  const startCamera = async () => {
    try {
      setIsCapturing(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment', // الكاميرا الخلفية للجوال
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (error) {
      console.error('خطأ في تشغيل الكاميرا:', error);
      toast({
        title: "خطأ في الكاميرا",
        description: "لا يمكن الوصول للكاميرا. تأكد من السماح بالوصول للكاميرا.",
        variant: "destructive"
      });
      setIsCapturing(false);
    }
  };

  // إيقاف الكاميرا
  const stopCamera = () => {
    const stream = videoRef.current?.srcObject as MediaStream;
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setIsCapturing(false);
  };

  // التقاط صورة من الكاميرا
  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
    setPreviewImage(imageDataUrl);
    stopCamera();
    processImage(imageDataUrl);
  };

  // معالجة الصورة بالذكاء الاصطناعي
  const processImage = async (imageDataUrl: string) => {
    setIsProcessing(true);
    setDetectedText('');

    try {
      // محاكاة معالجة بالذكاء الاصطناعي
      // في التطبيق الفعلي، ستتصل بخدمة OCR مثل Google Vision API أو Azure Cognitive Services
      
      await new Promise(resolve => setTimeout(resolve, 2000)); // محاكاة التأخير

      // نص تجريبي لاختبار الوظيفة
      const mockDetectedTexts = [
        'أ ب ج 1234',
        'ن م ل 5678', 
        'س ع د 9876',
        'ر ي ض 1357'
      ];
      
      const randomText = mockDetectedTexts[Math.floor(Math.random() * mockDetectedTexts.length)];
      setDetectedText(randomText);
      
      // استخراج الأحرف والأرقام
      const extractedData = extractPlateData(randomText);
      
      if (extractedData) {
        const fullPlateNumber = `${extractedData.letters.join(' ')} ${extractedData.digits.join('')}`;
        onPlateDetected(fullPlateNumber);
        toast({
          title: "تم استخراج رقم اللوحة بنجاح!",
          description: `رقم اللوحة: ${fullPlateNumber}`,
        });
      } else {
        toast({
          title: "فشل في استخراج رقم اللوحة",
          description: "لم يتم العثور على رقم لوحة صالح في الصورة",
          variant: "destructive"
        });
      }

    } catch (error) {
      console.error('خطأ في معالجة الصورة:', error);
      toast({
        title: "خطأ في المعالجة",
        description: "حدث خطأ أثناء معالجة الصورة. حاول مرة أخرى.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // استخراج بيانات اللوحة من النص المكتشف
  const extractPlateData = (text: string) => {
    // إزالة المسافات الزائدة وتنظيف النص
    const cleanText = text.replace(/\s+/g, ' ').trim();
    
    // البحث عن نمط اللوحة المصرية: 3 أحرف عربية + 4 أرقام
    const arabicLetters = cleanText.match(/[أ-ي]/g) || [];
    const digits = cleanText.match(/\d/g) || [];
    
    if (arabicLetters.length >= 3 && digits.length >= 4) {
      return {
        letters: arabicLetters.slice(0, 3), // أول 3 أحرف
        digits: digits.slice(0, 4) // أول 4 أرقام
      };
    }
    
    return null;
  };

  // إعادة تعيين
  const resetReader = () => {
    setPreviewImage(null);
    setDetectedText('');
    stopCamera();
  };

  return (
    <Card className="border-purple-200 bg-purple-50/30">
      <CardHeader>
        <CardTitle className="text-lg text-purple-600 text-right flex items-center gap-2">
          <Zap className="h-5 w-5" />
          🤖 قراءة رقم اللوحة بالذكاء الاصطناعي
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {!previewImage && !isCapturing && (
          <div className="flex justify-center">
            <Button
              type="button"
              onClick={startCamera}
              className="bg-purple-600 text-white border-purple-600 hover:bg-purple-700 transition-all duration-300 px-6 py-3"
            >
              <Camera className="h-5 w-5 mr-2" />
              تصوير رقم اللوحة بالكاميرا
            </Button>
          </div>
        )}

        {/* الكاميرا */}
        {isCapturing && (
          <div className="space-y-3">
            <div className="relative rounded-lg overflow-hidden bg-black">
              <video
                ref={videoRef}
                className="w-full h-64 object-cover"
                autoPlay
                playsInline
                muted
              />
              
              {/* إطار توجيهي للوحة */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="border-2 border-purple-500 rounded-lg p-4 bg-purple-500/10">
                  <div className="w-48 h-24 border-2 border-dashed border-white rounded flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">ضع اللوحة هنا</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={captureImage}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                <Scan className="h-4 w-4 mr-2" />
                التقاط وقراءة
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={stopCamera}
                className="border-red-600 text-red-600 hover:bg-red-50"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* معاينة الصورة */}
        {previewImage && (
          <div className="space-y-3">
            <div className="relative">
              <img 
                src={previewImage} 
                alt="صورة اللوحة" 
                className="w-full h-48 object-cover rounded-lg border-2 border-purple-200"
              />
              
              {isProcessing && (
                <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                    <p className="text-sm">جاري قراءة اللوحة...</p>
                  </div>
                </div>
              )}
            </div>

            {/* النص المكتشف */}
            {detectedText && (
              <div className="bg-green-100 border border-green-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-semibold text-green-800">تم اكتشاف النص:</span>
                </div>
                <p className="text-green-700 font-mono text-lg text-center" dir="rtl">
                  {detectedText}
                </p>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={resetReader}
                className="flex-1 border-gray-300 hover:bg-gray-50"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                مسح والعودة
              </Button>
              
              {!isProcessing && (
                <Button
                  type="button"
                  onClick={() => processImage(previewImage)}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  إعادة قراءة
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Canvas مخفي للمعالجة */}
        <canvas ref={canvasRef} className="hidden" />

        {/* معلومات إرشادية */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
          <p className="text-blue-800 text-right mb-2">📷 <strong>نصائح للتصوير المثالي:</strong></p>
          <ul className="text-blue-700 text-right space-y-1">
            <li>• تأكد من وضوح اللوحة وعدم وجود انعكاسات</li>
            <li>• تصوير في إضاءة جيدة (نهار أو إضاءة قوية)</li>
            <li>• محاذاة اللوحة في منتصف الإطار</li>
            <li>• تجنب الحركة أثناء التصوير</li>
            <li>• ابقاء مسافة مناسبة من اللوحة</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
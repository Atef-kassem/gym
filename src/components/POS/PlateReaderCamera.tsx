import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Camera, X, RotateCcw, Check, AlertCircle, Zap } from 'lucide-react';

interface PlateReaderCameraProps {
  isOpen: boolean;
  onClose: () => void;
  onPlateDetected: (plateData: {
    arabicNumbers: string[];
    arabicLetters: string[];
    englishNumbers: string[];
    englishLetters: string[];
    confidence: number;
    plateType: string;
  }) => void;
}

export function PlateReaderCamera({ isOpen, onClose, onPlateDetected }: PlateReaderCameraProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [detectedPlate, setDetectedPlate] = useState<any>(null);
  const [confidence, setConfidence] = useState(0);
  const [stream, setStream] = useState<MediaStream | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // خريطة التحويل بين الأحرف العربية والإنجليزية
  const arabicToEnglish: { [key: string]: string } = {
    'أ': 'A', 'ا': 'A', 'ب': 'B', 'ج': 'C', 'د': 'D', 'ر': 'R', 
    'س': 'S', 'ص': 'X', 'ط': 'T', 'ع': 'E', 'ق': 'G', 'ك': 'K', 
    'ل': 'L', 'ز': 'Z', 'ن': 'N', 'ه': 'H', 'و': 'U', 'ي': 'V',
    'ح': 'J', 'م': 'Z'
  };
  
  const englishToArabic: { [key: string]: string } = {
    'A': 'أ', 'B': 'ب', 'C': 'ج', 'D': 'د', 'R': 'ر', 'S': 'س', 
    'X': 'ص', 'T': 'ط', 'E': 'ع', 'G': 'ق', 'K': 'ك', 'L': 'ل', 
    'Z': 'م', 'N': 'ن', 'H': 'ه', 'U': 'و', 'V': 'ي',
    'J': 'ح'
  };

  const englishToArabicNumbers: { [key: string]: string } = {
    '0': '٠', '1': '١', '2': '٢', '3': '٣', '4': '٤', 
    '5': '٥', '6': '٦', '7': '٧', '8': '٨', '9': '٩'
  };

  // بدء الكاميرا
  const startCamera = async () => {
    try {
      setIsLoading(true);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment', // استخدام الكاميرا الخلفية
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
      
      toast({
        title: "تم تشغيل الكاميرا",
        description: "وجه الكاميرا نحو لوحة المشروب",
        variant: "default"
      });
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "خطأ في الكاميرا",
        description: "لا يمكن الوصول للكاميرا. تأكد من الصلاحيات",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // إيقاف الكاميرا
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  // التقاط صورة ومعالجتها
  const captureAndAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    setIsScanning(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const video = videoRef.current;
    
    // تحديد أبعاد الكانفاس
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // رسم الصورة على الكانفاس
    ctx?.drawImage(video, 0, 0);
    
    // تحويل إلى base64
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    setCapturedImage(imageData);
    
    // محاكاة معالجة الصورة بـ AI
    setTimeout(() => {
      const mockPlateData = simulatePlateDetection();
      setDetectedPlate(mockPlateData);
      setConfidence(mockPlateData.confidence);
      setIsScanning(false);
      
      toast({
        title: "تم اكتشاف اللوحة!",
        description: `دقة الاكتشاف: ${mockPlateData.confidence}%`,
        variant: "default"
      });
    }, 2000);
  };

  // محاكاة اكتشاف اللوحة (يمكن استبدالها بـ AI حقيقي)
  const simulatePlateDetection = () => {
    const samplePlates = [
      { 
        arabicNumbers: ['١', '٢', '٣', '٤'], 
        arabicLetters: ['أ', 'ب', 'ج'],
        englishNumbers: ['1', '2', '3', '4'],
        englishLetters: ['A', 'B', 'C'],
        plateType: 'private',
        confidence: 92
      },
      { 
        arabicNumbers: ['٥', '٦', '٧', '٨'], 
        arabicLetters: ['د', 'ه', 'و'],
        englishNumbers: ['5', '6', '7', '8'],
        englishLetters: ['D', 'H', 'U'],
        plateType: 'private',
        confidence: 88
      },
      { 
        arabicNumbers: ['٩', '٠', '١', '٢'], 
        arabicLetters: ['ر', 'س', 'ت'],
        englishNumbers: ['9', '0', '1', '2'],
        englishLetters: ['R', 'S', 'T'],
        plateType: 'commercial',
        confidence: 95
      }
    ];
    
    return samplePlates[Math.floor(Math.random() * samplePlates.length)];
  };

  // تأكيد وإرسال البيانات
  const confirmAndSend = () => {
    if (detectedPlate) {
      onPlateDetected(detectedPlate);
      onClose();
      toast({
        title: "تم تطبيق بيانات اللوحة",
        description: "تم ملء حقول اللوحة تلقائياً",
        variant: "default"
      });
    }
  };

  // إعادة المسح
  const retryScanning = () => {
    setCapturedImage(null);
    setDetectedPlate(null);
    setConfidence(0);
  };

  // تنظيف الموارد عند الإغلاق
  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
      setCapturedImage(null);
      setDetectedPlate(null);
      setConfidence(0);
    }
    
    return () => {
      stopCamera();
    };
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white">
              <Camera className="h-6 w-6" />
            </div>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              قراءة اللوحة بالكاميرا
            </span>
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white animate-pulse">
              AI مُحسَّن
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* منطقة الكاميرا */}
          <Card className="overflow-hidden shadow-xl border-0 bg-gradient-to-br from-gray-900 to-black">
            <CardContent className="p-0 relative">
              {/* الكاميرا */}
              <div className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  playsInline
                />
                
                {/* خطوط الاستهداف */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="border-2 border-green-500 bg-green-500/10 backdrop-blur-sm rounded-xl p-4" style={{ width: '300px', height: '120px' }}>
                    <div className="border border-green-400 border-dashed w-full h-full rounded-lg flex items-center justify-center">
                      <span className="text-green-400 text-sm font-medium animate-pulse">
                        وجه الكاميرا نحو اللوحة
                      </span>
                    </div>
                  </div>
                </div>

                {/* حالة التحميل */}
                {isLoading && (
                  <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                      <p>جاري تشغيل الكاميرا...</p>
                    </div>
                  </div>
                )}

                {/* حالة المسح */}
                {isScanning && (
                  <div className="absolute inset-0 bg-blue-600/80 flex items-center justify-center">
                    <div className="text-center text-white">
                      <Zap className="h-16 w-16 animate-pulse mx-auto mb-4" />
                      <p className="text-xl font-bold">جاري معالجة الصورة...</p>
                      <p className="text-blue-200">يرجى الانتظار</p>
                    </div>
                  </div>
                )}
              </div>

              {/* أزرار التحكم */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3">
                <Button
                  onClick={captureAndAnalyze}
                  disabled={isLoading || isScanning || !stream}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 px-6 py-3"
                >
                  <Camera className="h-5 w-5 ml-2" />
                  {isScanning ? 'جاري المسح...' : 'مسح اللوحة'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* النتائج */}
          {detectedPlate && (
            <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 shadow-xl animate-fade-in">
              <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                <CardTitle className="flex items-center gap-3">
                  <Check className="h-6 w-6" />
                  تم اكتشاف اللوحة بنجاح!
                  <Badge className="bg-white/20 text-white">
                    دقة {confidence}%
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* الصورة المُلتقطة */}
                  <div>
                    <h4 className="font-bold text-gray-800 mb-3">الصورة المُلتقطة</h4>
                    {capturedImage && (
                      <img 
                        src={capturedImage} 
                        alt="Captured plate" 
                        className="w-full rounded-lg border shadow-lg"
                      />
                    )}
                  </div>

                  {/* البيانات المكتشفة */}
                  <div>
                    <h4 className="font-bold text-gray-800 mb-3">البيانات المكتشفة</h4>
                    <div className="space-y-4">
                      <div className="bg-white p-4 rounded-lg border shadow-sm">
                        <h5 className="font-medium text-gray-700 mb-2">الأرقام العربية</h5>
                        <div className="flex gap-2">
                          {detectedPlate.arabicNumbers.map((num: string, idx: number) => (
                            <div key={idx} className="w-10 h-10 bg-blue-100 border border-blue-300 rounded flex items-center justify-center font-bold text-blue-800">
                              {num}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-lg border shadow-sm">
                        <h5 className="font-medium text-gray-700 mb-2">الحروف العربية</h5>
                        <div className="flex gap-2">
                          {detectedPlate.arabicLetters.map((letter: string, idx: number) => (
                            <div key={idx} className="w-10 h-10 bg-green-100 border border-green-300 rounded flex items-center justify-center font-bold text-green-800">
                              {letter}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Button
                          onClick={confirmAndSend}
                          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white flex-1"
                        >
                          <Check className="h-4 w-4 ml-2" />
                          تأكيد وتطبيق
                        </Button>
                        <Button
                          onClick={retryScanning}
                          variant="outline"
                          className="border-orange-300 text-orange-600 hover:bg-orange-50"
                        >
                          <RotateCcw className="h-4 w-4 ml-2" />
                          إعادة المسح
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* تعليمات الاستخدام */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-1" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-2">نصائح للحصول على أفضل النتائج:</p>
                  <ul className="space-y-1 text-blue-700">
                    <li>• تأكد من وضوح الإضاءة</li>
                    <li>• ضع اللوحة داخل الإطار الأخضر</li>
                    <li>• تأكد من عدم وجود انعكاسات</li>
                    <li>• اجعل اللوحة مستقيمة وواضحة</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* الكانفاس المخفي للمعالجة */}
        <canvas ref={canvasRef} className="hidden" />
      </DialogContent>
    </Dialog>
  );
}
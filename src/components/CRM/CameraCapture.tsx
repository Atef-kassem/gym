import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Camera, 
  X, 
  RotateCcw,
  Check,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CameraCaptureProps {
  onCapture: (imageFile: File) => void;
  onClose: () => void;
  title: string;
}

export function CameraCapture({ onCapture, onClose, title }: CameraCaptureProps) {
  const [isCapturing, setIsCapturing] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  // تشغيل الكاميرا
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment', // الكاميرا الخلفية
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setIsCapturing(true);
      }
    } catch (error) {
      console.error('خطأ في تشغيل الكاميرا:', error);
      toast({
        title: "خطأ في الكاميرا",
        description: "تعذر الوصول إلى الكاميرا. تأكد من السماح للموقع باستخدام الكاميرا.",
        variant: "destructive",
      });
    }
  };

  // إيقاف الكاميرا
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCapturing(false);
  };

  // التقاط الصورة
  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setPreviewImage(imageDataUrl);
        stopCamera();
      }
    }
  };

  // تأكيد الصورة
  const confirmImage = () => {
    if (previewImage && canvasRef.current) {
      canvasRef.current.toBlob((blob) => {
        if (blob) {
          const timestamp = new Date().getTime();
          const file = new File([blob], `captured_image_${timestamp}.jpg`, { type: 'image/jpeg' });
          onCapture(file);
          toast({
            title: "تم التقاط الصورة",
            description: "تم حفظ الصورة بنجاح",
            variant: "default",
          });
        }
      }, 'image/jpeg', 0.8);
    }
  };

  // إعادة التقاط
  const retakeImage = () => {
    setPreviewImage(null);
    startCamera();
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-6 space-y-4">
        {/* العنوان */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-right">{title}</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* منطقة التصوير */}
        <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
          {isCapturing && (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          )}

          {previewImage && (
            <img
              src={previewImage}
              alt="الصورة الملتقطة"
              className="w-full h-full object-cover"
            />
          )}

          {!isCapturing && !previewImage && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center space-y-4">
                <Camera className="h-16 w-16 mx-auto text-gray-400" />
                <p className="text-gray-600">اضغط على "بدء التصوير" لتشغيل الكاميرا</p>
              </div>
            </div>
          )}
        </div>

        {/* أزرار التحكم */}
        <div className="flex justify-center gap-3">
          {!isCapturing && !previewImage && (
            <Button
              onClick={startCamera}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6"
            >
              <Camera className="h-4 w-4 mr-2" />
              بدء التصوير
            </Button>
          )}

          {isCapturing && (
            <>
              <Button
                onClick={stopCamera}
                variant="outline"
                className="px-6"
              >
                <X className="h-4 w-4 mr-2" />
                إلغاء
              </Button>
              <Button
                onClick={captureImage}
                className="bg-green-600 hover:bg-green-700 text-white px-6"
              >
                <Camera className="h-4 w-4 mr-2" />
                التقاط الصورة
              </Button>
            </>
          )}

          {previewImage && (
            <>
              <Button
                onClick={retakeImage}
                variant="outline"
                className="px-6"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                إعادة التقاط
              </Button>
              <Button
                onClick={confirmImage}
                className="bg-green-600 hover:bg-green-700 text-white px-6"
              >
                <Check className="h-4 w-4 mr-2" />
                تأكيد الصورة
              </Button>
            </>
          )}
        </div>

        {/* Canvas مخفي للمعالجة */}
        <canvas ref={canvasRef} className="hidden" />

        {/* نصائح */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="text-right">
              <p className="text-yellow-800 font-medium">نصائح للحصول على أفضل النتائج:</p>
              <ul className="text-yellow-700 mt-1 space-y-1">
                <li>• تأكد من وجود إضاءة جيدة</li>
                <li>• احرص على استقرار اليد أثناء التصوير</li>
                <li>• تأكد من وضوح العنصر المراد تصويره</li>
                <li>• تجنب الانعكاسات والظلال</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Camera,
  CheckCircle,
  Loader2,
  Zap,
  Eye,
  Upload,
  AlertTriangle,
  Info,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { pipeline, env } from "@huggingface/transformers";

interface DetectedPlate {
  plateNumber: string;
  confidence: number;
  region: string;
}

interface CustomerData {
  name: string;
  phone: string;
  cars: Array<{
    plate: string;
    type: string;
    model: string;
    year: string;
    color: string;
  }>;
  lastVisit: string;
  totalVisits: number;
  isVIP: boolean;
}

const mockCustomerDatabase: Record<string, CustomerData> = {
  أبج1234: {
    name: "أحمد محمد علي",
    phone: "0501234567",
    cars: [
      {
        plate: "أبج1234",
        type: "كامري",
        model: "Camry",
        year: "2020",
        color: "أبيض",
      },
    ],
    lastVisit: "2024-01-10",
    totalVisits: 12,
    isVIP: true,
  },
  دهو5678: {
    name: "فاطمة أحمد",
    phone: "0509876543",
    cars: [
      {
        plate: "دهو5678",
        type: "لكزس ES",
        model: "ES 350",
        year: "2021",
        color: "أسود",
      },
    ],
    lastVisit: "2024-01-08",
    totalVisits: 8,
    isVIP: false,
  },
  زحط9012: {
    name: "محمد علي",
    phone: "0551112233",
    cars: [
      {
        plate: "زحط9012",
        type: "BMW X5",
        model: "X5",
        year: "2019",
        color: "أزرق",
      },
    ],
    lastVisit: "2024-01-12",
    totalVisits: 5,
    isVIP: false,
  },
};

interface LicensePlateReaderProps {
  onPlateDetected: (
    plateData: DetectedPlate,
    customerData?: CustomerData
  ) => void;
  autoStart?: boolean;
}

export function LicensePlateReader({
  onPlateDetected,
  autoStart = false,
}: LicensePlateReaderProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectedPlate, setDetectedPlate] = useState<DetectedPlate | null>(
    null
  );
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [aiProgress, setAiProgress] = useState("");
  const [ocrPipeline, setOcrPipeline] = useState<any>(null);
  const [cameraError, setCameraError] = useState<string>("");
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const checkCameraPermission = async () => {
      try {
        if ("permissions" in navigator) {
          const permission = await navigator.permissions.query({
            name: "camera" as PermissionName,
          });
          setHasPermission(permission.state === "granted");

          permission.addEventListener("change", () => {
            setHasPermission(permission.state === "granted");
          });
        }
      } catch (error) {
        console.log("Could not check camera permission:", error);
      }
    };

    checkCameraPermission();
  }, []);

  useEffect(() => {
    const initializeAI = async () => {
      try {
        env.allowLocalModels = false;
        env.useBrowserCache = true;

        setAiProgress("جاري تحميل نموذج التعرف على النصوص...");

        const pipeline_instance = await pipeline(
          "image-to-text",
          "Xenova/trocr-base-printed",
          { device: "webgpu" }
        );

        setOcrPipeline(pipeline_instance);
        setAiProgress("");

        toast({
          title: "الذكاء الاصطناعي جاهز",
          description: "تم تحميل نموذج قراءة النصوص بنجاح",
          variant: "default",
        });
      } catch (error) {
        console.error("Error initializing AI:", error);
        setAiProgress("");
        toast({
          title: "تحذير",
          description: "سيتم استخدام النمط التجريبي بدلاً من الذكاء الاصطناعي",
          variant: "destructive",
        });
      }
    };

    initializeAI();
  }, []);

  useEffect(() => {
    if (autoStart && hasPermission !== false) {
      startCamera();
    }
  }, [autoStart, hasPermission]);

  const performAIPlateRecognition = useCallback(
    async (canvas: HTMLCanvasElement): Promise<DetectedPlate> => {
      try {
        if (!ocrPipeline) {
          return simulatePlateRecognition();
        }

        setAiProgress("الذكاء الاصطناعي يحلل الصورة...");

        const imageDataUrl = canvas.toDataURL("image/jpeg", 0.8);

        setAiProgress("استخراج النص من الصورة...");

        const result = await ocrPipeline(imageDataUrl);

        setAiProgress("تحليل النص المستخرج...");

        let extractedText = "";
        if (Array.isArray(result)) {
          extractedText = result.map((r) => r.generated_text || "").join(" ");
        } else if (result.generated_text) {
          extractedText = result.generated_text;
        }

        const cleanedText = extractedText.replace(/\s+/g, "").trim();

        const platePattern = /[ا-ي]{1,3}\s*\d{1,4}/g;
        const matches = cleanedText.match(platePattern);

        let plateNumber = cleanedText;
        let confidence = 70;

        if (matches && matches.length > 0) {
          plateNumber = matches[0];
          confidence = 90;
        } else if (cleanedText.length >= 4 && cleanedText.length <= 8) {
          confidence = 80;
        }

        setAiProgress("");

        return {
          plateNumber: plateNumber || "غير مكتشف",
          confidence: Math.min(confidence, 99),
          region: "المملكة العربية المصرية",
        };
      } catch (error) {
        console.error("AI Recognition Error:", error);
        setAiProgress("");
        return simulatePlateRecognition();
      }
    },
    [ocrPipeline]
  );

  const simulatePlateRecognition =
    useCallback(async (): Promise<DetectedPlate> => {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const mockPlates = [
        "أبج1234",
        "دهو5678",
        "زحط9012",
        "يكل3456",
        "منس7890",
      ];
      const randomPlate =
        mockPlates[Math.floor(Math.random() * mockPlates.length)];
      const confidence = Math.random() * 0.4 + 0.6;

      return {
        plateNumber: randomPlate,
        confidence: Math.round(confidence * 100),
        region: "المملكة العربية المصرية",
      };
    }, []);

  const startCamera = async () => {
    setCameraError("");

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("المتصفح لا يدعم الوصول إلى الكاميرا");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
        setShowDialog(true);
        setHasPermission(true);

        toast({
          title: "تم تشغيل الكاميرا",
          description: "وجه الكاميرا نحو لوحة المشروب",
          variant: "default",
        });
      }
    } catch (error: any) {
      console.error("Camera access error:", error);
      setCameraActive(false);
      setHasPermission(false);

      let errorMessage = "حدث خطأ في الوصول إلى الكاميرا";

      if (error.name === "NotAllowedError") {
        errorMessage =
          "تم رفض إذن الوصول إلى الكاميرا. يرجى السماح بالوصول إلى الكاميرا من إعدادات المتصفح.";
        setCameraError("permission_denied");
      } else if (error.name === "NotFoundError") {
        errorMessage = "لم يتم العثور على كاميرا متاحة على هذا الجهاز.";
        setCameraError("no_camera");
      } else if (error.name === "NotSupportedError") {
        errorMessage =
          "المتصفح لا يدعم الوصول إلى الكاميرا أو يتطلب اتصال آمن (HTTPS).";
        setCameraError("not_supported");
      } else {
        setCameraError("unknown");
      }

      toast({
        title: "خطأ في الكاميرا",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
    }
    setCameraActive(false);
    setShowDialog(false);
    setCameraError("");
  };

  const captureImage = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    setIsProcessing(true);

    try {
      const result = await performAIPlateRecognition(canvas);
      setDetectedPlate(result);

      const customer = mockCustomerDatabase[result.plateNumber];
      setCustomerData(customer || null);

      toast({
        title: "تم اكتشاف لوحة المشروب بالذكاء الاصطناعي",
        description: `رقم اللوحة: ${result.plateNumber} - دقة: ${result.confidence}%`,
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "خطأ في التحليل",
        description: "فشل في تحليل الصورة. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      stopCamera();
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "نوع ملف غير صالح",
        description: "يرجى اختيار ملف صورة صالح",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        setIsProcessing(true);

        const img = new Image();
        img.onload = async () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          if (!ctx) return;

          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);

          const result = await performAIPlateRecognition(canvas);
          setDetectedPlate(result);

          const customer = mockCustomerDatabase[result.plateNumber];
          setCustomerData(customer || null);

          toast({
            title: "تم تحليل الصورة بالذكاء الاصطناعي",
            description: `رقم اللوحة: ${result.plateNumber} - دقة: ${result.confidence}%`,
            variant: "default",
          });
        };

        img.src = e.target?.result as string;
      } catch (error) {
        toast({
          title: "خطأ في تحليل الصورة",
          description: "فشل في تحليل الصورة. يرجى المحاولة مرة أخرى.",
          variant: "destructive",
        });
      } finally {
        setIsProcessing(false);
      }
    };

    reader.readAsDataURL(file);
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const confirmPlate = () => {
    if (detectedPlate) {
      onPlateDetected(detectedPlate, customerData || undefined);
      setDetectedPlate(null);
      setCustomerData(null);
    }
  };

  const retryRecognition = () => {
    setDetectedPlate(null);
    setCustomerData(null);
    startCamera();
  };

  return (
    <div className="space-y-4">
      {!cameraActive && !autoStart && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                <Camera className="h-5 w-5" />
              </div>
              قارئ لوحات  الكافية بالذكاء الاصطناعي
              <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                AI Powered
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* رسالة تحميل الذكاء الاصطناعي */}
            {aiProgress && (
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                <div>
                  <p className="font-semibold text-blue-900">
                    تحميل الذكاء الاصطناعي
                  </p>
                  <p className="text-sm text-blue-700">{aiProgress}</p>
                </div>
              </div>
            )}

            {/* رسائل أخطاء الكاميرا */}
            {cameraError && (
              <Alert className="border-orange-200 bg-orange-50">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800">
                  {cameraError === "permission_denied" && (
                    <div className="space-y-2">
                      <p className="font-semibold">
                        تم رفض إذن الوصول إلى الكاميرا
                      </p>
                      <p className="text-sm">لتمكين الكاميرا:</p>
                      <ul className="list-disc list-inside text-sm space-y-1">
                        <li>اضغط على أيقونة الكاميرا في شريط العنوان</li>
                        <li>اختر "السماح دائماً"</li>
                        <li>أعد تحديث الصفحة</li>
                      </ul>
                    </div>
                  )}
                  {cameraError === "no_camera" && (
                    <div>
                      <p className="font-semibold">لم يتم العثور على كاميرا</p>
                      <p className="text-sm">
                        يمكنك رفع صورة اللوحة من جهازك بدلاً من ذلك.
                      </p>
                    </div>
                  )}
                  {cameraError === "not_supported" && (
                    <div>
                      <p className="font-semibold">المتصفح لا يدعم الكاميرا</p>
                      <p className="text-sm">
                        تأكد من استخدام اتصال آمن (HTTPS) أو جرب متصفح حديث.
                      </p>
                    </div>
                  )}
                  {cameraError === "unknown" && (
                    <div>
                      <p className="font-semibold">حدث خطأ غير متوقع</p>
                      <p className="text-sm">يمكنك رفع صورة اللوحة من جهازك.</p>
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}

            {/* معلومات الأذونات */}
            {hasPermission === false && !cameraError && (
              <Alert className="border-blue-200 bg-blue-50">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  <p className="font-semibold">يتطلب إذن الوصول إلى الكاميرا</p>
                  <p className="text-sm">
                    لاستخدام ميزة قراءة اللوحة المباشرة، يرجى السماح بالوصول إلى
                    الكاميرا.
                  </p>
                </AlertDescription>
              </Alert>
            )}

            {/* خيارات الإدخال */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                onClick={startCamera}
                disabled={isProcessing || !!aiProgress}
                className="flex items-center gap-2 h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Camera className="h-5 w-5" />
                <Zap className="h-4 w-4" />
                تصوير مباشر
              </Button>

              <Button
                onClick={triggerFileUpload}
                disabled={isProcessing || !!aiProgress}
                variant="outline"
                className="flex items-center gap-2 h-12 border-2 border-dashed border-purple-300 hover:border-purple-400 hover:bg-purple-50"
              >
                <Upload className="h-5 w-5" />
                <Zap className="h-4 w-4" />
                رفع صورة
              </Button>
            </div>

            {/* حقل رفع الملفات المخفي */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </CardContent>
        </Card>
      )}

      {isProcessing && (
        <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              <Zap className="h-3 w-3 text-yellow-500 absolute -top-1 -right-1" />
            </div>
            <div>
              <p className="font-semibold text-blue-900">
                الذكاء الاصطناعي يحلل الصورة...
              </p>
              <p className="text-sm text-blue-700">
                {aiProgress ||
                  "تحليل متقدم للوحة المشروب باستخدام تقنيات التعلم العميق"}
              </p>
            </div>
          </div>
        </Card>
      )}

      {detectedPlate && (
        <Card className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <Eye className="h-4 w-4 text-blue-500" />
                <Zap className="h-4 w-4 text-yellow-500" />
              </div>
              <div>
                <p className="font-bold text-green-900 flex items-center gap-2">
                  تم اكتشاف لوحة المشروب بالذكاء الاصطناعي
                  <Badge className="bg-green-100 text-green-800">
                    AI Detection
                  </Badge>
                </p>
                <p className="text-lg font-mono bg-white px-3 py-1 rounded border-2 border-green-200 inline-block mt-1">
                  {detectedPlate.plateNumber}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Badge
                variant={
                  detectedPlate.confidence > 85 ? "default" : "secondary"
                }
              >
                دقة: {detectedPlate.confidence}%
              </Badge>
              <Badge variant="outline">{detectedPlate.region}</Badge>
            </div>

            {customerData && (
              <Card className="bg-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    بيانات العميل
                    {customerData.isVIP && (
                      <Badge
                        variant="default"
                        className="bg-gold text-yellow-900"
                      >
                        VIP
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <Label>الاسم</Label>
                      <p className="font-semibold">{customerData.name}</p>
                    </div>
                    <div>
                      <Label>رقم الجوال</Label>
                      <p className="font-semibold">{customerData.phone}</p>
                    </div>
                    <div>
                      <Label>نوع المشروب</Label>
                      <p className="font-semibold">
                        {customerData.cars[0]?.type}
                      </p>
                    </div>
                    <div>
                      <Label>اللون</Label>
                      <p className="font-semibold">
                        {customerData.cars[0]?.color}
                      </p>
                    </div>
                    <div>
                      <Label>آخر زيارة</Label>
                      <p className="font-semibold">{customerData.lastVisit}</p>
                    </div>
                    <div>
                      <Label>عدد الزيارات</Label>
                      <p className="font-semibold">
                        {customerData.totalVisits} زيارة
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex gap-2">
              <Button onClick={confirmPlate} className="flex-1">
                <CheckCircle className="h-4 w-4 mr-2" />
                تأكيد البيانات
              </Button>
              <Button variant="outline" onClick={retryRecognition}>
                إعادة المحاولة
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Camera Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>قارئ لوحات  الكافية</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full rounded-lg"
                style={{ maxHeight: "400px" }}
              />
              <div className="absolute inset-0 border-2 border-dashed border-blue-400 rounded-lg pointer-events-none">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-600 bg-blue-100 px-4 py-2 rounded-lg">
                  وجه الكاميرا نحو لوحة المشروب
                </div>
              </div>
            </div>

            <canvas ref={canvasRef} className="hidden" />

            <div className="flex gap-2">
              <Button
                onClick={captureImage}
                disabled={!cameraActive || isProcessing}
                className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
              >
                <Camera className="h-4 w-4 mr-2" />
                <Zap className="h-3 w-3 mr-1" />
                التقاط + تحليل بالـ AI
              </Button>
              <Button variant="outline" onClick={stopCamera}>
                إلغاء
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

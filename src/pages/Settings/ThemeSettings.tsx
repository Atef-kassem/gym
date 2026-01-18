import { useState, useRef } from "react";
import { Palette, Save, RotateCcw, Eye, Upload, Copy, Check, Pipette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

// Extended color palette with more options
const colorPalette = [
  // Blues
  { name: "أزرق فاتح", hex: "#3b82f6", hsl: "hsl(217, 91%, 60%)" },
  { name: "أزرق داكن", hex: "#1e40af", hsl: "hsl(227, 71%, 39%)" },
  { name: "أزرق بحري", hex: "#1e3a8a", hsl: "hsl(233, 67%, 32%)" },
  // Greens
  { name: "أخضر فاتح", hex: "#10b981", hsl: "hsl(158, 64%, 52%)" },
  { name: "أخضر داكن", hex: "#059669", hsl: "hsl(158, 90%, 42%)" },
  { name: "أخضر زيتوني", hex: "#84cc16", hsl: "hsl(82, 84%, 43%)" },
  // Purples
  { name: "بنفسجي فاتح", hex: "#8b5cf6", hsl: "hsl(258, 90%, 66%)" },
  { name: "بنفسجي داكن", hex: "#7c3aed", hsl: "hsl(262, 83%, 58%)" },
  { name: "بنفسجي ملكي", hex: "#6d28d9", hsl: "hsl(271, 81%, 50%)" },
  // Reds
  { name: "أحمر فاتح", hex: "#ef4444", hsl: "hsl(0, 84%, 60%)" },
  { name: "أحمر داكن", hex: "#dc2626", hsl: "hsl(0, 84%, 51%)" },
  { name: "أحمر وردي", hex: "#ec4899", hsl: "hsl(330, 81%, 60%)" },
  // Oranges
  { name: "برتقالي فاتح", hex: "#f97316", hsl: "hsl(21, 95%, 52%)" },
  { name: "برتقالي داكن", hex: "#ea580c", hsl: "hsl(20, 91%, 48%)" },
  { name: "برتقالي ذهبي", hex: "#f59e0b", hsl: "hsl(45, 93%, 47%)" },
  // Grays
  { name: "رمادي فاتح", hex: "#6b7280", hsl: "hsl(220, 9%, 46%)" },
  { name: "رمادي داكن", hex: "#374151", hsl: "hsl(215, 25%, 27%)" },
  { name: "رمادي أسود", hex: "#1f2937", hsl: "hsl(214, 32%, 17%)" },
];

// Color palette options
const colorOptions = [
  { name: "أزرق احترافي", value: "blue", color: "hsl(215, 85%, 55%)" },
  { name: "أخضر طبيعي", value: "green", color: "hsl(142, 76%, 36%)" },
  { name: "بنفسجي أنيق", value: "purple", color: "hsl(262, 83%, 58%)" },
  { name: "أحمر قوي", value: "red", color: "hsl(0, 84%, 60%)" },
  { name: "برتقالي دافئ", value: "orange", color: "hsl(25, 95%, 53%)" },
  { name: "رمادي عصري", value: "gray", color: "hsl(220, 13%, 40%)" },
];

const fontOptions = [
  { name: "Cairo - كايرو", value: "cairo", preview: "مرحباً بكم في نظام إدارة مغاسل  الكافية" },
  { name: "Tajawal - تجوال", value: "tajawal", preview: "مرحباً بكم في نظام إدارة مغاسل  الكافية" },
  { name: "Almarai - المراعي", value: "almarai", preview: "مرحباً بكم في نظام إدارة مغاسل  الكافية" },
  { name: "GE SS - جي إي", value: "gess", preview: "مرحباً بكم في نظام إدارة مغاسل  الكافية" },
];

const iconStyles = [
  { name: "خطوط هندسية", value: "geometric" },
  { name: "خطوط دائرية", value: "rounded" },
  { name: "خطوط ناعمة", value: "soft" },
  { name: "أسلوب مسطح", value: "flat" },
];

export default function ThemeSettings() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [customColor, setCustomColor] = useState("#3b82f6");
  const [secondaryColor, setSecondaryColor] = useState("#6b7280");
  const [copiedColor, setCopiedColor] = useState("");
  const [logoColors, setLogoColors] = useState<string[]>([]);
  const [logoImage, setLogoImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [themeSettings, setThemeSettings] = useState({
    primaryColor: "blue",
    secondaryColor: "gray",
    fontFamily: "cairo",
    fontSize: [16],
    iconStyle: "geometric",
    borderRadius: [12],
    darkMode: false,
    animations: true,
    shadows: true,
    compactMode: false,
    specialMode: "normal", // normal, national, religious
  });

  // Special mode themes with proper HSL values
  const specialModes = {
    normal: {
      name: "المظهر العادي",
      colors: { primary: "#3b82f6", secondary: "#6b7280" },
      hsl: { primary: "217 91% 60%", secondary: "220 9% 46%" },
      description: "المظهر الافتراضي للنظام"
    },
    national: {
      name: "مود اليوم الوطني",
      colors: { primary: "#16a34a", secondary: "#dc2626" },
      hsl: { primary: "142 71% 36%", secondary: "0 84% 60%" },
      description: "ألوان وطنية للاحتفال باليوم الوطني"
    },
    religious: {
      name: "مود الأعياد الدينية", 
      colors: { primary: "#eab308", secondary: "#16a34a" },
      hsl: { primary: "45 93% 47%", secondary: "142 71% 36%" },
      description: "ألوان إسلامية للمناسبات الدينية"
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "تم الحفظ بنجاح",
        description: "تم حفظ إعدادات المظهر بنجاح",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "خطأ في الحفظ",
        description: "حدث خطأ أثناء حفظ إعدادات المظهر",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Convert HSL to RGB
  const hslToRgb = (h: number, s: number, l: number) => {
    h /= 360;
    s /= 100;
    l /= 100;
    
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => {
      const k = (n + h * 12) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color);
    };
    
    return [f(0), f(8), f(4)];
  };

  // Convert RGB to Hex
  const rgbToHex = (r: number, g: number, b: number) => {
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  // Handle color wheel click for primary/secondary colors
  const handleColorWheelClick = (event: React.MouseEvent<HTMLDivElement>, colorType: 'primary' | 'secondary') => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const x = event.clientX - rect.left - centerX;
    const y = event.clientY - rect.top - centerY;
    
    const angle = Math.atan2(y, x) * 180 / Math.PI;
    const hue = (angle + 360) % 360;
    const distance = Math.sqrt(x * x + y * y);
    const radius = Math.min(centerX, centerY);
    
    if (distance <= radius) {
      const saturation = Math.min(100, (distance / radius) * 100);
      const lightness = 50;
      
      const [r, g, b] = hslToRgb(hue, saturation, lightness);
      const hex = rgbToHex(r, g, b);
      
      if (colorType === 'primary') {
        setCustomColor(hex);
      } else {
        setSecondaryColor(hex);
      }
      
      toast({
        title: "تم اختيار اللون",
        description: `اللون ${colorType === 'primary' ? 'الرئيسي' : 'الثانوي'}: ${hex}`,
      });
    }
  };
  const copyColorToClipboard = async (color: string) => {
    try {
      await navigator.clipboard.writeText(color);
      setCopiedColor(color);
      setTimeout(() => setCopiedColor(""), 2000);
      toast({
        title: "تم النسخ",
        description: `تم نسخ اللون ${color} إلى الحافظة`,
      });
    } catch (error) {
      toast({
        title: "خطأ في النسخ",
        description: "لم يتم نسخ اللون",
        variant: "destructive",
      });
    }
  };

  // Extract colors from uploaded logo
  const extractColorsFromImage = (imageFile: File) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      
      const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
      if (!imageData) return;
      
      const colors = new Map<string, number>();
      const data = imageData.data;
      
      // Sample every 10th pixel to avoid processing too many pixels
      for (let i = 0; i < data.length; i += 40) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];
        
        // Skip transparent pixels
        if (a < 128) continue;
        
        const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
        colors.set(hex, (colors.get(hex) || 0) + 1);
      }
      
      // Get the most common colors
      const sortedColors = Array.from(colors.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([color]) => color);
      
      setLogoColors(sortedColors);
      toast({
        title: "تم استخراج الألوان",
        description: `تم استخراج ${sortedColors.length} ألوان من الشعار`,
      });
    };
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setLogoImage(result);
      img.src = result;
    };
    reader.readAsDataURL(imageFile);
  };

  // Handle logo upload
  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      extractColorsFromImage(file);
    } else {
      toast({
        title: "خطأ في الملف",
        description: "يرجى رفع ملف صورة صالح",
        variant: "destructive",
      });
    }
  };

  // Apply special mode and update CSS variables
  const applySpecialMode = (mode: string) => {
    const selectedMode = specialModes[mode as keyof typeof specialModes];
    if (selectedMode) {
      setCustomColor(selectedMode.colors.primary);
      setSecondaryColor(selectedMode.colors.secondary);
      setThemeSettings(prev => ({ ...prev, specialMode: mode }));
      
      // Apply colors to CSS variables immediately
      const root = document.documentElement;
      root.style.setProperty('--primary', selectedMode.hsl.primary);
      root.style.setProperty('--secondary', selectedMode.hsl.secondary);
      
      toast({
        title: "تم تطبيق المود",
        description: selectedMode.description,
      });
    }
  };

  const handleReset = () => {
    // Reset CSS variables to default
    const root = document.documentElement;
    root.style.setProperty('--primary', '217 91% 60%'); // Default blue
    root.style.setProperty('--secondary', '220 9% 46%'); // Default gray
    
    setThemeSettings({
      primaryColor: "blue",
      secondaryColor: "gray",
      fontFamily: "cairo",
      fontSize: [16],
      iconStyle: "geometric",
      borderRadius: [12],
      darkMode: false,
      animations: true,
      shadows: true,
      compactMode: false,
      specialMode: "normal",
    });
    setLogoColors([]);
    setLogoImage(null);
    setCustomColor("#3b82f6");
    setSecondaryColor("#6b7280");
    
    toast({
      title: "تم الإعادة",
      description: "تم إعادة تعيين إعدادات المظهر للقيم الافتراضية",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">إعدادات المظهر والثيمات</h1>
          <p className="text-muted-foreground">تخصيص مظهر النظام والواجهة البصرية</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset} className="gap-2">
            <RotateCcw className="w-4 h-4" />
            إعادة التعيين
          </Button>
          <Button onClick={handleSave} disabled={isLoading} className="gap-2">
            <Save className="w-4 h-4" />
            {isLoading ? "جاري الحفظ..." : "حفظ التغييرات"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Special Modes Section */}
        <Card className="shadow-card hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-primary" />
              الأمود الخاصة والمناسبات
            </CardTitle>
            <CardDescription>اختر مود خاص للمناسبات الوطنية والدينية</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              {Object.entries(specialModes).map(([key, mode]) => (
                <button
                  key={key}
                  onClick={() => applySpecialMode(key)}
                  className={`p-4 rounded-lg border-2 transition-all hover:scale-105 text-right ${
                    themeSettings.specialMode === key
                      ? "border-primary ring-2 ring-primary/20 bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex gap-1">
                      <div
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: mode.colors.primary }}
                      />
                      <div
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: mode.colors.secondary }}
                      />
                    </div>
                    <h3 className="font-semibold">{mode.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{mode.description}</p>
                  
                  {/* Preview gradient */}
                  <div 
                    className="mt-3 h-2 rounded-full"
                    style={{
                      background: `linear-gradient(90deg, ${mode.colors.primary}, ${mode.colors.secondary})`
                    }}
                  />
                </button>
              ))}
            </div>
            
            {/* Special decorative elements for active modes */}
            {themeSettings.specialMode === 'national' && (
              <div className="text-center p-4 bg-gradient-to-r from-green-50 to-red-50 dark:from-green-950 dark:to-red-950 rounded-lg border">
                <p className="font-semibold text-green-700 dark:text-green-300">🇸🇦 مبروك اليوم الوطني 🇸🇦</p>
                <p className="text-sm text-muted-foreground">تم تطبيق الألوان الوطنية</p>
              </div>
            )}
            
            {themeSettings.specialMode === 'religious' && (
              <div className="text-center p-4 bg-gradient-to-r from-yellow-50 to-green-50 dark:from-yellow-950 dark:to-green-950 rounded-lg border">
                <p className="font-semibold text-yellow-700 dark:text-yellow-300">🌙 ✨ مبارك عليكم الشهر ✨ 🌙</p>
                <p className="text-sm text-muted-foreground">تم تطبيق ألوان المناسبات الدينية</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Enhanced Colors Section */}
        <Card className="shadow-card hover-lift lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-primary" />
              الألوان الأساسية والبالتة المتقدمة
            </CardTitle>
            <CardDescription>اختر الألوان من البالتة أو أدخل رقم اللون المخصص أو حلل شعار المنشأة</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Primary Color Selection */}
            <div>
              <Label>اللون الرئيسي</Label>
              <div className="flex items-center gap-4 mt-3">
                {/* Color Wheel for Primary */}
                <div
                  className="w-16 h-16 rounded-full cursor-crosshair relative overflow-hidden border-2 border-border shadow-md flex-shrink-0"
                  onClick={(e) => handleColorWheelClick(e, 'primary')}
                  style={{
                    background: `conic-gradient(
                      hsl(0, 100%, 50%),
                      hsl(30, 100%, 50%),
                      hsl(60, 100%, 50%),
                      hsl(90, 100%, 50%),
                      hsl(120, 100%, 50%),
                      hsl(150, 100%, 50%),
                      hsl(180, 100%, 50%),
                      hsl(210, 100%, 50%),
                      hsl(240, 100%, 50%),
                      hsl(270, 100%, 50%),
                      hsl(300, 100%, 50%),
                      hsl(330, 100%, 50%),
                      hsl(360, 100%, 50%)
                    )`,
                  }}
                >
                  <div 
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: 'radial-gradient(circle, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 70%)'
                    }}
                  />
                  <div 
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: 'radial-gradient(circle, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 50%)'
                    }}
                  />
                </div>
                
                {/* Color Input and Preview */}
                <div className="flex-1 space-y-2">
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      value={customColor}
                      onChange={(e) => setCustomColor(e.target.value)}
                      placeholder="#3b82f6"
                      className="font-mono flex-1"
                    />
                    <div
                      className="w-12 h-10 rounded-md border border-border cursor-pointer"
                      style={{ backgroundColor: customColor }}
                      onClick={() => copyColorToClipboard(customColor)}
                    />
                  </div>
                  
                  {/* Quick color options */}
                  <div className="flex gap-2 flex-wrap">
                    {colorOptions.slice(0, 6).map((color) => (
                      <button
                        key={color.value}
                        onClick={() => setCustomColor(color.color.match(/#[0-9a-fA-F]{6}/) ? color.color.match(/#[0-9a-fA-F]{6}/)![0] : "#3b82f6")}
                        className="w-6 h-6 rounded-md border border-border hover:scale-110 transition-all"
                        style={{ backgroundColor: color.color }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Secondary Color Selection */}
            <div>
              <Label>اللون الثانوي</Label>
              <div className="flex items-center gap-4 mt-3">
                {/* Color Wheel for Secondary */}
                <div
                  className="w-16 h-16 rounded-full cursor-crosshair relative overflow-hidden border-2 border-border shadow-md flex-shrink-0"
                  onClick={(e) => handleColorWheelClick(e, 'secondary')}
                  style={{
                    background: `conic-gradient(
                      hsl(0, 100%, 50%),
                      hsl(30, 100%, 50%),
                      hsl(60, 100%, 50%),
                      hsl(90, 100%, 50%),
                      hsl(120, 100%, 50%),
                      hsl(150, 100%, 50%),
                      hsl(180, 100%, 50%),
                      hsl(210, 100%, 50%),
                      hsl(240, 100%, 50%),
                      hsl(270, 100%, 50%),
                      hsl(300, 100%, 50%),
                      hsl(330, 100%, 50%),
                      hsl(360, 100%, 50%)
                    )`,
                  }}
                >
                  <div 
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: 'radial-gradient(circle, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 70%)'
                    }}
                  />
                  <div 
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: 'radial-gradient(circle, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 50%)'
                    }}
                  />
                </div>
                
                {/* Color Input and Preview */}
                <div className="flex-1 space-y-2">
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      placeholder="#6b7280"
                      className="font-mono flex-1"
                    />
                    <div
                      className="w-12 h-10 rounded-md border border-border cursor-pointer"
                      style={{ backgroundColor: secondaryColor }}
                      onClick={() => copyColorToClipboard(secondaryColor)}
                    />
                  </div>
                  
                  {/* Quick color options */}
                  <div className="flex gap-2 flex-wrap">
                    {colorOptions.slice(0, 6).map((color) => (
                      <button
                        key={`sec-${color.value}`}
                        onClick={() => setSecondaryColor(color.color.match(/#[0-9A-F]{6}/) ? color.color.match(/#[0-9A-F]{6}/)![0] : "#6b7280")}
                        className="w-6 h-6 rounded-md border border-border hover:scale-110 transition-all"
                        style={{ backgroundColor: color.color }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Logo Upload Section */}
            <div>
              <Label>رفع شعار المنشأة لتحليل الألوان</Label>
              <div className="flex gap-4 mt-3">
                <div className="flex-1">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleLogoUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    رفع الشعار لتحليل الألوان
                  </Button>
                </div>
              </div>
            </div>

            {/* Logo Preview and Extracted Colors */}
            {logoImage && (
              <div className="space-y-4">
                <div className="flex gap-4">
                  <img
                    src={logoImage}
                    alt="Logo"
                    className="w-20 h-20 object-contain border rounded-lg"
                  />
                  <div className="flex-1">
                    <Label>الألوان المستخرجة من الشعار</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {logoColors.map((color, index) => (
                        <div key={index} className="group relative">
                          <button
                            onClick={() => copyColorToClipboard(color)}
                            className="w-12 h-12 rounded-lg border-2 border-border hover:border-primary transition-all hover:scale-110 relative"
                            style={{ backgroundColor: color }}
                          >
                            {copiedColor === color && (
                              <Check className="w-4 h-4 text-white absolute inset-0 m-auto drop-shadow" />
                            )}
                          </button>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            {color}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Apply Colors to UI Elements */}
                    {logoColors.length >= 2 && (
                      <div className="mt-4 space-y-2">
                        <Label>تطبيق الألوان على عناصر الواجهة</Label>
                        <div className="flex gap-2 flex-wrap">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const sidebarColor = logoColors[0];
                              const headerColor = logoColors[1];
                              
                              setCustomColor(sidebarColor);
                              setSecondaryColor(headerColor);
                              
                              // Apply to CSS variables
                              const root = document.documentElement;
                              root.style.setProperty('--sidebar-color', sidebarColor);
                              root.style.setProperty('--header-color', headerColor);
                              
                              toast({
                                title: "تم تطبيق الألوان",
                                description: `اللون ${sidebarColor} للجانب الجانبي و ${headerColor} للعنوان`,
                              });
                            }}
                            className="gap-2"
                          >
                            <Palette className="w-4 h-4" />
                            تطبيق على Sidebar & Header
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const primaryColor = logoColors[0];
                              setCustomColor(primaryColor);
                              
                              // Apply to CSS variables
                              const root = document.documentElement;
                              root.style.setProperty('--primary', primaryColor);
                              
                              toast({
                                title: "تم تطبيق اللون الرئيسي",
                                description: `اللون ${primaryColor} للعناصر الرئيسية`,
                              });
                            }}
                            className="gap-2"
                          >
                            <Palette className="w-4 h-4" />
                            تطبيق على العناصر الرئيسية
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sidebar & Header Colors Section */}
        <Card className="shadow-card hover-lift lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-primary" />
              ألوان الجانب الجانبي والعنوان
            </CardTitle>
            <CardDescription>تخصيص ألوان Sidebar و Header بشكل منفصل</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <Label>لون الجانب الجانبي (Sidebar)</Label>
                <div className="flex items-center gap-4 mt-3">
                  <div
                    className="w-16 h-16 rounded-lg cursor-pointer relative overflow-hidden border-2 border-border shadow-md flex-shrink-0"
                    style={{ backgroundColor: customColor }}
                    onClick={() => {
                      const newColor = prompt("أدخل لون الجانب الجانبي (مثال: #3b82f6):", customColor);
                      if (newColor && /^#[0-9A-F]{6}$/i.test(newColor)) {
                        setCustomColor(newColor);
                        // Apply to CSS variable
                        const root = document.documentElement;
                        root.style.setProperty('--sidebar-color', newColor);
                        toast({
                          title: "تم تحديث لون الجانب الجانبي",
                          description: `اللون الجديد: ${newColor}`,
                        });
                      }
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-tl from-black/20 to-transparent" />
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        value={customColor}
                        onChange={(e) => {
                          const color = e.target.value;
                          setCustomColor(color);
                          if (/^#[0-9A-F]{6}$/i.test(color)) {
                            const root = document.documentElement;
                            root.style.setProperty('--sidebar-color', color);
                          }
                        }}
                        placeholder="#3b82f6"
                        className="font-mono flex-1"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyColorToClipboard(customColor)}
                      >
                        {copiedColor === customColor ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      انقر على المربع الملون لتغيير اللون
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <Label>لون العنوان (Header)</Label>
                <div className="flex items-center gap-4 mt-3">
                  <div
                    className="w-16 h-16 rounded-lg cursor-pointer relative overflow-hidden border-2 border-border shadow-md flex-shrink-0"
                    style={{ backgroundColor: secondaryColor }}
                    onClick={() => {
                      const newColor = prompt("أدخل لون العنوان (مثال: #6b7280):", secondaryColor);
                      if (newColor && /^#[0-9A-F]{6}$/i.test(newColor)) {
                        setSecondaryColor(newColor);
                        // Apply to CSS variable
                        const root = document.documentElement;
                        root.style.setProperty('--header-color', newColor);
                        toast({
                          title: "تم تحديث لون العنوان",
                          description: `اللون الجديد: ${newColor}`,
                        });
                      }
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-tl from-black/20 to-transparent" />
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        value={secondaryColor}
                        onChange={(e) => {
                          const color = e.target.value;
                          setSecondaryColor(color);
                          if (/^#[0-9A-F]{6}$/i.test(color)) {
                            const root = document.documentElement;
                            root.style.setProperty('--header-color', color);
                          }
                        }}
                        placeholder="#6b7280"
                        className="font-mono flex-1"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyColorToClipboard(secondaryColor)}
                      >
                        {copiedColor === secondaryColor ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      انقر على المربع الملون لتغيير اللون
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Apply Extracted Colors */}
            {logoColors.length >= 2 && (
              <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-lg border">
                <Label className="text-base font-semibold mb-3 block">تطبيق الألوان المستخرجة من الشعار</Label>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    size="sm"
                    onClick={() => {
                      const sidebarColor = logoColors[0];
                      const headerColor = logoColors[1];
                      
                      setCustomColor(sidebarColor);
                      setSecondaryColor(headerColor);
                      
                      // Apply to CSS variables
                      const root = document.documentElement;
                      root.style.setProperty('--sidebar-color', sidebarColor);
                      root.style.setProperty('--header-color', headerColor);
                      
                      toast({
                        title: "تم تطبيق ألوان الشعار",
                        description: `اللون ${sidebarColor} للجانب الجانبي و ${headerColor} للعنوان`,
                      });
                    }}
                    className="gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  >
                    <Palette className="w-4 h-4" />
                    تطبيق على Sidebar & Header
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const primaryColor = logoColors[0];
                      setCustomColor(primaryColor);
                      
                      // Apply to CSS variables
                      const root = document.documentElement;
                      root.style.setProperty('--primary', primaryColor);
                      
                      toast({
                        title: "تم تطبيق اللون الرئيسي",
                        description: `اللون ${primaryColor} للعناصر الرئيسية`,
                      });
                    }}
                    className="gap-2"
                  >
                    <Palette className="w-4 h-4" />
                    تطبيق على العناصر الرئيسية
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  سيتم تطبيق أول لونين مستخرجين من الشعار على الجانب الجانبي والعنوان
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Typography Section */}
        <Card className="shadow-card hover-lift">
          <CardHeader>
            <CardTitle>الخطوط والطباعة</CardTitle>
            <CardDescription>تخصيص خطوط النظام وأحجامها</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="fontFamily">نوع الخط</Label>
              <Select 
                value={themeSettings.fontFamily} 
                onValueChange={(value) => setThemeSettings(prev => ({ ...prev, fontFamily: value }))}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="اختر نوع الخط" />
                </SelectTrigger>
                <SelectContent>
                  {fontOptions.map((font) => (
                    <SelectItem key={font.value} value={font.value}>
                      <div className="text-right">
                        <p className="font-medium">{font.name}</p>
                        <p className="text-sm text-muted-foreground">{font.preview}</p>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>حجم الخط الأساسي: {themeSettings.fontSize[0]}px</Label>
              <Slider
                value={themeSettings.fontSize}
                onValueChange={(value) => setThemeSettings(prev => ({ ...prev, fontSize: value }))}
                max={20}
                min={12}
                step={1}
                className="mt-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>صغير (12px)</span>
                <span>متوسط (16px)</span>
                <span>كبير (20px)</span>
              </div>
            </div>

            <div>
              <Label htmlFor="iconStyle">أسلوب الأيقونات</Label>
              <Select 
                value={themeSettings.iconStyle} 
                onValueChange={(value) => setThemeSettings(prev => ({ ...prev, iconStyle: value }))}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="اختر أسلوب الأيقونات" />
                </SelectTrigger>
                <SelectContent>
                  {iconStyles.map((style) => (
                    <SelectItem key={style.value} value={style.value}>
                      {style.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Layout Section */}
        <Card className="shadow-card hover-lift">
          <CardHeader>
            <CardTitle>التخطيط والتصميم</CardTitle>
            <CardDescription>إعدادات تخطيط الواجهة</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label>زوايا العناصر: {themeSettings.borderRadius[0]}px</Label>
              <Slider
                value={themeSettings.borderRadius}
                onValueChange={(value) => setThemeSettings(prev => ({ ...prev, borderRadius: value }))}
                max={20}
                min={0}
                step={2}
                className="mt-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>حادة (0px)</span>
                <span>متوسطة (12px)</span>
                <span>دائرية (20px)</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>الوضع المظلم</Label>
                  <p className="text-sm text-muted-foreground">تفعيل المظهر المظلم</p>
                </div>
                <Switch
                  checked={themeSettings.darkMode}
                  onCheckedChange={(checked) => setThemeSettings(prev => ({ ...prev, darkMode: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>الحركات والانيميشن</Label>
                  <p className="text-sm text-muted-foreground">تفعيل التأثيرات المتحركة</p>
                </div>
                <Switch
                  checked={themeSettings.animations}
                  onCheckedChange={(checked) => setThemeSettings(prev => ({ ...prev, animations: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>الظلال</Label>
                  <p className="text-sm text-muted-foreground">إظهار ظلال العناصر</p>
                </div>
                <Switch
                  checked={themeSettings.shadows}
                  onCheckedChange={(checked) => setThemeSettings(prev => ({ ...prev, shadows: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>الوضع المضغوط</Label>
                  <p className="text-sm text-muted-foreground">واجهة أكثر كثافة</p>
                </div>
                <Switch
                  checked={themeSettings.compactMode}
                  onCheckedChange={(checked) => setThemeSettings(prev => ({ ...prev, compactMode: checked }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preview Section */}
        <Card className="shadow-card hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-primary" />
              معاينة فورية
            </CardTitle>
            <CardDescription>نظرة مسبقة على التغييرات</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
              {/* Preview Header */}
              <div 
                className="flex items-center justify-between p-3 bg-background rounded-md shadow-sm"
                style={themeSettings.specialMode !== 'normal' ? {
                  background: `linear-gradient(135deg, ${specialModes[themeSettings.specialMode as keyof typeof specialModes].colors.primary}15, ${specialModes[themeSettings.specialMode as keyof typeof specialModes].colors.secondary}15)`
                } : {}}
              >
                <h3 className="font-semibold">نموذج العنوان</h3>
                <Button 
                  size="sm" 
                  variant="outline"
                  style={themeSettings.specialMode !== 'normal' ? {
                    borderColor: specialModes[themeSettings.specialMode as keyof typeof specialModes].colors.primary,
                    color: specialModes[themeSettings.specialMode as keyof typeof specialModes].colors.primary
                  } : {}}
                >
                  <Save className="w-4 h-4 ml-2" />
                  حفظ
                </Button>
              </div>

              {/* Preview Cards */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="p-4 bg-background rounded-md shadow-sm">
                  <h4 className="font-medium mb-2">بطاقة العينة</h4>
                  <p className="text-sm text-muted-foreground">
                    هذا نص تجريبي لمعاينة الخط المختار
                  </p>
                </div>
                <div 
                  className="p-4 text-white rounded-md"
                  style={{ 
                    backgroundColor: themeSettings.specialMode !== 'normal' 
                      ? specialModes[themeSettings.specialMode as keyof typeof specialModes].colors.primary
                      : customColor 
                  }}
                >
                  <h4 className="font-medium mb-2">بطاقة ملونة</h4>
                  <p className="text-sm opacity-90">
                    معاينة اللون {themeSettings.specialMode !== 'normal' ? 'للمود الخاص' : 'المختار'}
                  </p>
                </div>
              </div>

              {/* Preview Buttons */}
              <div className="flex gap-2 flex-wrap">
                <Button 
                  size="sm"
                  style={themeSettings.specialMode !== 'normal' ? {
                    backgroundColor: specialModes[themeSettings.specialMode as keyof typeof specialModes].colors.primary
                  } : {}}
                >
                  زر رئيسي
                </Button>
                <Button size="sm" variant="outline">زر ثانوي</Button>
                <Button size="sm" variant="ghost">زر شفاف</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
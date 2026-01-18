// وظائف مساعدة لمعالجة الصور

/**
 * التحقق من صحة URL الصورة
 */
export function isValidImageUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  
  // التحقق من أن URL صحيح
  try {
    new URL(url);
  } catch {
    return false;
  }
  
  // التحقق من أن الملف صورة
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
  const hasImageExtension = imageExtensions.some(ext => 
    url.toLowerCase().includes(ext)
  );
  
  return hasImageExtension;
}

/**
 * إنشاء URL placeholder للصورة
 */
export function createPlaceholderUrl(type: 'customer' | 'car' | 'company' | 'group', size: number = 100): string {
  const baseUrl = '/api/placeholder';
  return `${baseUrl}/${size}/${size}?type=${type}`;
}

/**
 * معالجة خطأ تحميل الصورة
 */
export function handleImageError(
  event: React.SyntheticEvent<HTMLImageElement, Event>,
  fallbackUrl: string
): void {
  const img = event.target as HTMLImageElement;
  if (img.src !== fallbackUrl) {
    img.src = fallbackUrl;
  }
}

/**
 * تحويل ملف إلى URL مؤقت
 */
export function fileToUrl(file: File): string {
  return URL.createObjectURL(file);
}

/**
 * تنظيف URL مؤقت
 */
export function revokeObjectUrl(url: string): void {
  if (url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
}

/**
 * التحقق من حجم الملف
 */
export function validateFileSize(file: File, maxSizeMB: number = 5): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
}

/**
 * التحقق من نوع الملف
 */
export function validateFileType(file: File, allowedTypes: string[] = ['image/*']): boolean {
  return allowedTypes.some(type => {
    if (type === 'image/*') {
      return file.type.startsWith('image/');
    }
    return file.type === type;
  });
}

/**
 * ضغط الصورة
 */
export function compressImage(
  file: File, 
  maxWidth: number = 800, 
  quality: number = 0.8
): Promise<File> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    
    img.onload = () => {
      // حساب الأبعاد الجديدة
      let { width, height } = img;
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // رسم الصورة المضغوطة
      ctx.drawImage(img, 0, 0, width, height);
      
      // تحويل إلى blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            });
            resolve(compressedFile);
          } else {
            resolve(file);
          }
        },
        file.type,
        quality
      );
    };
    
    img.src = URL.createObjectURL(file);
  });
}

/**
 * إنشاء صورة مصغرة
 */
export function createThumbnail(
  file: File, 
  size: number = 150
): Promise<string> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    
    img.onload = () => {
      canvas.width = size;
      canvas.height = size;
      
      // رسم الصورة المصغرة
      ctx.drawImage(img, 0, 0, size, size);
      
      resolve(canvas.toDataURL('image/jpeg', 0.8));
    };
    
    img.src = URL.createObjectURL(file);
  });
}

/**
 * الحصول على معلومات الصورة
 */
export function getImageInfo(file: File): Promise<{
  width: number;
  height: number;
  size: number;
  type: string;
}> {
  return new Promise((resolve) => {
    const img = new Image();
    
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
        size: file.size,
        type: file.type
      });
    };
    
    img.src = URL.createObjectURL(file);
  });
}

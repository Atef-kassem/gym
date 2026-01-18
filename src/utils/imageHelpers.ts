/**
 * تحويل مسار الصورة من الخادم إلى URL كامل
 * @param imagePath - مسار الصورة من قاعدة البيانات
 * @returns URL كامل للصورة أو null إذا لم يكن هناك صورة
 */
export const getImageUrl = (imagePath: string | null | undefined): string | null => {
  if (!imagePath) return null;
  
  // إذا كان المسار يبدأ بـ http:// أو https:// فهو URL كامل
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // إذا كان المسار يبدأ بـ data: فهو base64
  if (imagePath.startsWith('data:')) {
    return imagePath;
  }
  
  // الحصول على API base URL
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://metagym.metacodecx.com';
  
  // إذا كان المسار يبدأ بـ / فهو مسار نسبي من root
  if (imagePath.startsWith('/')) {
    const fullUrl = `${apiBaseUrl}${imagePath}`;
    console.log('🖼️ تحويل مسار الصورة:', { imagePath, fullUrl });
    return fullUrl;
  }
  
  // إذا كان المسار يبدأ بـ Uploads/ فقط
  if (imagePath.startsWith('Uploads/')) {
    const fullUrl = `${apiBaseUrl}/${imagePath}`;
    console.log('🖼️ تحويل مسار الصورة:', { imagePath, fullUrl });
    return fullUrl;
  }
  
  // افتراضياً، اعتبر أنه مسار نسبي من Uploads
  const fullUrl = `${apiBaseUrl}/Uploads/${imagePath}`;
  console.log('🖼️ تحويل مسار الصورة:', { imagePath, fullUrl });
  return fullUrl;
};

/**
 * الحصول على URL صورة المنتج
 * @param product - بيانات المنتج
 * @returns URL الصورة أو placeholder
 */
export const getProductImageUrl = (product: any): string => {
  const imageUrl = getImageUrl(product?.image_url || product?.imageUrl || product?.image);
  return imageUrl || '/placeholder.svg';
};

/**
 * الحصول على URL صورة الخدمة
 * @param service - بيانات الخدمة
 * @returns URL الصورة أو placeholder
 */
export const getServiceImageUrl = (service: any): string => {
  const imageUrl = getImageUrl(service?.imageUrl || service?.image_url || service?.image);
  return imageUrl || '/placeholder.svg';
};

/**
 * الحصول على URL صورة المستهلك
 * @param consumable - بيانات المستهلك
 * @returns URL الصورة أو placeholder
 */
export const getConsumableImageUrl = (consumable: any): string => {
  const imageUrl = getImageUrl(consumable?.attachmentImage || consumable?.imageUrl || consumable?.image);
  return imageUrl || '/placeholder.svg';
};

/**
 * التحقق من صحة URL الصورة
 * @param url - URL الصورة
 * @returns Promise<boolean> - true إذا كانت الصورة موجودة وصالحة
 */
export const validateImageUrl = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
};


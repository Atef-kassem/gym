import '../utils/network/api/network_api.dart';

/// دالة مساعدة لبناء URL الصورة بشكل صحيح
/// 
/// تقوم بتحويل مسار الصورة من السيرفر إلى URL كامل
/// تدعم عدة أشكال من المسارات:
/// - URL كامل (http:// أو https://) - يُعاد كما هو
/// - مسار نسبي يبدأ بـ / - يُضاف إلى baseUrl
/// - مسار يبدأ بـ Uploads/ - يُضاف إلى imageBaseUrl
/// - مسار عادي - يُضاف إلى imageBaseUrl/Uploads/
/// 
/// @param imagePath - مسار الصورة من قاعدة البيانات
/// @returns URL كامل للصورة أو string فارغ إذا لم يكن هناك صورة
String buildImageUrl(String? imagePath) {
  if (imagePath == null || imagePath.isEmpty) {
    return '';
  }

  // إذا كان المسار يبدأ بـ http:// أو https:// فهو URL كامل
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // إذا كان المسار يبدأ بـ data: فهو base64
  if (imagePath.startsWith('data:')) {
    return imagePath;
  }

  // الحصول على imageBaseUrl من NewApi
  final imageBaseUrl = NewApi.imageBaseUrl;
  const mainAppUrl = NewApi.mainAppUrl;

  // إذا كان المسار يبدأ بـ / فهو مسار نسبي من root
  if (imagePath.startsWith('/')) {
    return '$mainAppUrl$imagePath';
  }

  // إذا كان المسار يبدأ بـ Uploads/ فقط
  if (imagePath.startsWith('Uploads/')) {
    return '$mainAppUrl/$imagePath';
  }

  // افتراضياً، اعتبر أنه مسار نسبي من Uploads
  return '$imageBaseUrl/$imagePath';
}


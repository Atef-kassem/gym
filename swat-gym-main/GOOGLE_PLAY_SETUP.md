# دليل التجهيز لرفع التطبيق على Google Play Store

## 📋 المتطلبات الأساسية

### 1. إنشاء حساب Google Play Developer
- قم بزيارة [Google Play Console](https://play.google.com/console)
- أنشئ حساب مطور (رسوم لمرة واحدة: $25)
- أكمل معلومات الحساب

### 2. إنشاء Keystore للتوقيع

```bash
# انتقل إلى مجلد android/app
cd android/app

# أنشئ keystore جديد
keytool -genkey -v -keystore swatgym-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias swatgym

# سيطلب منك:
# - كلمة مرور keystore
# - معلومات عن الشركة/المطور
# - كلمة مرور الـ key
```

### 3. إعداد ملف key.properties

```bash
# انسخ الملف المثال
cp android/key.properties.example android/key.properties

# ثم عدّل الملف واملأ القيم:
# - storeFile: مسار ملف keystore
# - keyAlias: اسم الـ alias (swatgym)
# - storePassword: كلمة مرور keystore
# - keyPassword: كلمة مرور الـ key
```

⚠️ **مهم جداً**: لا ترفع ملف `key.properties` أو `swatgym-release-key.jks` إلى Git!

### 4. إنشاء الأيقونات والشاشة

```bash
# تأكد من وجود الأيقونة في assets/icon/icon.png
# يجب أن تكون الأيقونة:
# - 1024x1024 بكسل
# - PNG بدون شفافية
# - خلفية صلبة

# إنشاء الأيقونات
flutter pub run flutter_launcher_icons

# إنشاء شاشة البداية
flutter pub run flutter_native_splash:create
```

### 5. بناء ملف AAB (Android App Bundle)

```bash
# تنظيف المشروع
flutter clean

# جلب الحزم
flutter pub get

# بناء ملف AAB للتوزيع
flutter build appbundle --release

# الملف سيكون في:
# build/app/outputs/bundle/release/app-release.aab
```

### 6. معلومات التطبيق المطلوبة

#### معلومات أساسية:
- **اسم التطبيق**: Meta Codecx
- **Application ID**: com.swatgym.app
- **Version**: 1.0.0
- **Version Code**: 1

#### معلومات للرفع على Google Play:
1. **قائمة الشاشات** (Screenshots):
   - شاشة هاتف واحدة على الأقل (16:9 أو 9:16)
   - شاشة لوحي (اختياري)
   - حجم: 320-3840 بكسل

2. **الأيقونة**:
   - 512x512 بكسل
   - PNG بدون شفافية

3. **صورة الميزة** (Feature Graphic):
   - 1024x500 بكسل
   - PNG أو JPG

4. **الوصف**:
   - وصف قصير (80 حرف)
   - وصف كامل (4000 حرف)

5. **التصنيف**:
   - Health & Fitness
   - Sports

6. **التصنيف العمري**:
   - Everyone أو 3+

### 7. الأذونات المضافة

تم إضافة الأذونات التالية في AndroidManifest.xml:
- INTERNET
- ACCESS_NETWORK_STATE
- CAMERA
- READ_EXTERNAL_STORAGE (لـ Android 12 وأقل)
- WRITE_EXTERNAL_STORAGE (لـ Android 9 وأقل)
- READ_MEDIA_IMAGES (لـ Android 13+)
- READ_MEDIA_VIDEO (لـ Android 13+)
- ACCESS_FINE_LOCATION
- ACCESS_COARSE_LOCATION
- POST_NOTIFICATIONS (لـ Android 13+)

### 8. خطوات الرفع

1. **سجل الدخول** إلى [Google Play Console](https://play.google.com/console)

2. **أنشئ تطبيق جديد**:
   - اختر "إنشاء تطبيق"
   - أدخل اسم التطبيق: "Meta Codecx"
   - اختر اللغة الافتراضية: العربية
   - اختر نوع التطبيق: تطبيق مجاني أو مدفوع

3. **املأ معلومات المتجر**:
   - الوصف القصير والكامل
   - الأيقونة (512x512)
   - شاشات التطبيق
   - صورة الميزة
   - التصنيفات

4. **رفع ملف AAB**:
   - اذهب إلى "الإنتاج" → "إنشاء إصدار"
   - ارفع ملف `app-release.aab`
   - املأ ملاحظات الإصدار

5. **إكمال المعلومات**:
   - معلومات المحتوى
   - التصنيف العمري
   - سياسة الخصوصية (URL)
   - معلومات الاتصال

6. **مراجعة وإرسال**:
   - راجع جميع المعلومات
   - أرسل للتقييم
   - قد يستغرق التقييم من ساعات إلى أيام

### 9. نصائح مهمة

✅ **قبل الرفع**:
- اختبر التطبيق على أجهزة مختلفة
- تأكد من عمل جميع الميزات
- اختبر على Android 13+ و Android 12 وأقل
- تأكد من عدم وجود أخطاء في Logcat

✅ **الأمان**:
- لا ترفع ملفات keystore إلى Git
- احتفظ بنسخة احتياطية من keystore
- استخدم كلمات مرور قوية

✅ **الأداء**:
- تم تفعيل minifyEnabled و shrinkResources
- تم إضافة ProGuard rules
- حجم التطبيق محسّن

### 10. تحديث التطبيق لاحقاً

عند تحديث التطبيق:
1. زد `versionCode` في `pubspec.yaml` (مثلاً: 1.0.1+2)
2. زد `versionName` (مثلاً: 1.0.1)
3. أعد بناء AAB: `flutter build appbundle --release`
4. ارفع الإصدار الجديد في Google Play Console

---

## 📞 الدعم

إذا واجهت أي مشاكل، راجع:
- [Flutter Deployment Guide](https://docs.flutter.dev/deployment/android)
- [Google Play Console Help](https://support.google.com/googleplay/android-developer)


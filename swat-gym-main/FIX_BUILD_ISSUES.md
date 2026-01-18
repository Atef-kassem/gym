# 🔧 حل مشاكل البناء (Build Issues)

## المشكلة
المشروع موجود في مسار يحتوي على أحرف عربية (`مشاريع 2025`) مما يسبب مشاكل في:
- Kotlin compile daemon
- Flutter shader compiler
- كتابة الملفات

## الحلول المطبقة

### 1. تحديث `gradle.properties`
تم إضافة الإعدادات التالية:
- `android.overridePathCheck=true` - للسماح بمسارات غير ASCII
- `kotlin.daemon.jvmargs` - لتحسين Kotlin daemon
- `-Dfile.encoding=UTF-8` - لضمان الترميز الصحيح

### 2. خطوات إصلاح إضافية

#### أ. إيقاف Gradle daemon
```bash
cd swat-gym-main/android
gradlew.bat --stop
```

#### ب. تنظيف البناء
```bash
cd swat-gym-main
flutter clean
cd android
gradlew.bat clean
```

#### ج. إعادة البناء
```bash
cd swat-gym-main
flutter pub get
flutter build apk --debug
```

## الحل الأفضل (مستحسن)

**نقل المشروع إلى مسار بدون أحرف عربية:**

1. انسخ المشروع إلى مسار جديد مثل:
   ```
   E:\Projects2025\onemillion
   ```

2. افتح المشروع من المسار الجديد

3. شغّل:
   ```bash
   flutter clean
   flutter pub get
   flutter build apk
   ```

## ملاحظات

- المشكلة الأساسية هي أن Windows و Gradle/Flutter لا يتعاملان بشكل جيد مع المسارات التي تحتوي على أحرف غير ASCII
- الحل الحالي (`android.overridePathCheck=true`) يعمل لكن قد تظهر مشاكل أخرى
- نقل المشروع هو الحل الأكثر استقراراً


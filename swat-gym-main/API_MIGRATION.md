# 🔄 دليل انتقال API من القديم إلى الجديد

## نظرة عامة

تم تحديث تطبيق Flutter لاستخدام الـ API الجديد الموجود في `backend/` بدلاً من الـ APIs القديمة.

## التغييرات الرئيسية

### 1. تحديث Base URLs

**قبل:**
- `Api.baseUrl`: `https://alatheer.site/abnaa/qr_c/New_api/`
- `NewApi.baseUrl`: `https://finaal.noamanycenter.com/Api/`
- `CodeApi.baseUrl`: `https://alatheertech.com/basma/Api/`

**بعد:**
- `NewApi.baseUrl`: `https://metagym.metacodecx.com/api/v1` (يمكن تغييره حسب البيئة)
- `CodeApi.baseUrl`: `https://metagym.metacodecx.com/api/v1`

### 2. تحديث Authentication Endpoints

#### Login
- **القديم**: `POST /login_app` (form-urlencoded)
- **الجديد**: `POST /api/v1/auth/login` (JSON)
- **التغييرات**:
  - استخدام `email` بدلاً من `phone`
  - استخدام `password` بدلاً من `user_pass`
  - Content-Type: `application/json`

#### Register
- **القديم**: `POST /register` (form-urlencoded)
- **الجديد**: `POST /api/v1/auth/signup` (JSON)
- **التغييرات**:
  - استخدام `arabicName`, `englinshName`, `email`, `password`, `phoneNumber`, `branchId`
  - Content-Type: `application/json`

### 3. تحديث Endpoints الأخرى

تم تحديث جميع الـ endpoints في `network_api.dart` لاستخدام الـ API الجديد:

- **Subscriptions**: `/api/v1/gym/subscriptions`
- **Members**: `/api/v1/gym/members`
- **Profile**: `/api/v1/auth/me`
- **Branches**: `/api/v1/branches`
- **News**: `/api/v1/news`
- **Offers**: `/api/v1/offers`
- **Exercises**: `/api/v1/exercises`
- **Trainers**: `/api/v1/gym/trainers`
- وغيرها...

### 4. تحديث Response Format

تم تحديث `AdapterInterceptor` للتعامل مع format الـ response الجديد:

**القديم:**
```json
{
  "code": 200,
  "message": "...",
  "data": {...}
}
```

**الجديد:**
```json
{
  "status": "success",
  "token": "...",
  "data": {
    "user": {...}
  }
}
```

الـ interceptor يحول format الجديد تلقائياً إلى format القديم للتوافق مع الكود الموجود.

## الملفات المحدثة

### ملفات Configuration
- `lib/core/utils/network/api/network_api.dart` - تحديث جميع الـ URLs
- `lib/core/utils/network/interceptors.dart` - تحديث AdapterInterceptor

### ملفات Data Sources
- `lib/Features/auth/login/data/dat_source/login_remote_data_source/login_remote_data_source.dart`
- `lib/Features/auth/register/data/data_sources/register_remote_data_source/register_remote_data_source.dart`
- `lib/Features/subscribtions/data/data_sources/subscribtions_remote_data_source.dart`
- `lib/Features/personal_account/data/data_sources/get_profile_remote_data_source.dart`

## كيفية التكوين

### للـ Development
في `network_api.dart`:
```dart
static const String mainAppUrl = "https://metagym.metacodecx.com";
```

### للـ Production
قم بتغيير الـ URL إلى سيرفر الإنتاج:
```dart
static const String mainAppUrl = "https://your-production-server.com";
```

## ملاحظات مهمة

1. **Authentication Token**: الـ API الجديد يرجع token في الـ response. يجب حفظه واستخدامه في الـ headers للطلبات التالية.

2. **Content-Type**: معظم الـ endpoints الآن تستخدم `application/json` بدلاً من `application/x-www-form-urlencoded`.

3. **Error Handling**: تم تحديث معالجة الأخطاء للتعامل مع format الجديد.

4. **Backward Compatibility**: الـ AdapterInterceptor يحافظ على التوافق مع الكود الموجود.

## الخطوات التالية

1. ✅ تحديث جميع ملفات data sources التي تستخدم الـ API القديم
2. ✅ إضافة token authentication في الـ headers (تم إعداد AuthInterceptor)
3. ⚠️ حفظ token بعد تسجيل الدخول (يحتاج إضافة SharedPreferences أو Hive)
4. ⚠️ اختبار جميع الـ endpoints
5. ⚠️ تحديث الـ models إذا لزم الأمر

## ملاحظات إضافية

### Token Management
- الـ API الجديد يرجع token في response بعد تسجيل الدخول
- يجب حفظ token في storage (SharedPreferences أو Hive)
- يجب إضافة token في Authorization header لكل request
- تم إعداد AuthInterceptor لاستخراج token من response
- يجب إضافة كود حفظ token في AdapterInterceptor (السطر 108-115)

### Content-Type Changes
- تم تغيير جميع الـ endpoints من `form-urlencoded` إلى `JSON`
- بعض الـ endpoints التي تستخدم file upload تستخدم `multipart/form-data`

### Response Format
- الـ API الجديد يستخدم `{ status: "success", data: {...}, token: "..." }`
- تم تحديث AdapterInterceptor للتعامل مع format الجديد تلقائياً

## الدعم

إذا واجهت أي مشاكل، راجع:
- `backend/app.js` - لمعرفة جميع الـ endpoints المتاحة
- `backend/routes/` - لمعرفة تفاصيل كل route
- `backend/controllers/` - لمعرفة كيفية معالجة الـ requests


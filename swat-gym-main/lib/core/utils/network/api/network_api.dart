// API القديم - تم إلغاؤه
// class Api {
//   static const String mainAppUrl = "https://alatheer.site/abnaa/qr_c/";
//   static const String baseUrl = "${mainAppUrl}New_api/";
// }

// API الجديد - Backend في Electron
class NewApi {
  // ============================================
  // ⚠️ إعدادات الاتصال بالسيرفر ⚠️
  // ============================================
  //
  // اختر الـ URL المناسب حسب البيئة:
  //
  // 1. للـ Android Emulator:
  //    static const String mainAppUrl = "https://metagym.metacodecx.com";
  //
  // 2. للـ Android/iOS Device (جهاز حقيقي):
  //    - احصل على IP address الكمبيوتر:
  //      * Windows: افتح CMD واكتب: ipconfig
  //      * Mac/Linux: افتح Terminal واكتب: ifconfig أو ip addr
  //    - استبدل XXX بـ IP address الكمبيوتر:
  //    static const String mainAppUrl = "http://192.168.1.XXX:4000";
  //
  // 3. للـ iOS Simulator:
  //    static const String mainAppUrl = "https://metagym.metacodecx.com";
  //
  // 4. للـ Production:
  //    static const String mainAppUrl = "https://your-domain.com";
  //
  // ============================================
  //
  // 🔧 لتغيير الـ URL:
  // 1. غير قيمة mainAppUrl أدناه
  // 2. أعد تشغيل التطبيق (Stop ثم Run) - ليس Hot Reload فقط
  // 3. تأكد من أن السيرفر يعمل على نفس الـ IP والمنفذ
  //
  // ============================================

  // ⚠️ غير هذا الـ URL حسب بيئتك ⚠️
  //
  // إذا كان السيرفر يعمل على 10.0.0.2:
  //
  // 1. للـ Android Emulator: استخدم "https://metagym.metacodecx.com"
  // 2. للـ iOS Simulator: استخدم "https://metagym.metacodecx.com"
  // 3. للـ Android/iOS Device (جهاز حقيقي):
  //    - احصل على IP address الكمبيوتر من CMD/Terminal
  //    - استخدم "http://YOUR_IP:4000" (مثل "https://metagym.metacodecx.com")
  //
  // 🔧 الحل السريع:
  // - إذا كنت تستخدم Emulator: غير السطر التالي إلى "https://metagym.metacodecx.com"
  // - إذا كنت تستخدم Device: احصل على IP الكمبيوتر واستخدمه هنا

  // ⚠️ غير هذا السطر حسب نوع الجهاز ⚠️
  //
  // 🔧 خيارات الاتصال:
  //
  // 1. للـ Production (موصى به - يعمل دائماً):
  //    static const String mainAppUrl = "https://metagym.metacodecx.com";
  //
  // 2. للـ Android Emulator (إذا كان السيرفر على نفس الكمبيوتر):
  //    static const String mainAppUrl = "https://metagym.metacodecx.com";
  //    ⚠️ مهم: Android Emulator يستخدم 10.0.2.2 للوصول إلى 10.0.0.2
  //
  // 3. للـ Android Emulator (إذا كان السيرفر على شبكة محلية):
  //    static const String mainAppUrl = "https://metagym.metacodecx.com";
  //    💡 احصل على IP من: ipconfig (Windows) أو ifconfig (Mac/Linux)
  //
  // 4. للـ iOS Simulator:
  //    static const String mainAppUrl = "https://metagym.metacodecx.com";
  //
  // 5. للـ Android/iOS Device (جهاز حقيقي):
  //    static const String mainAppUrl = "https://metagym.metacodecx.com";
  //    ⚠️ تأكد من أن الجهاز والسيرفر على نفس الشبكة WiFi
  //
  // 💡 للحصول على IP الكمبيوتر:
  // - Windows: افتح CMD واكتب: ipconfig (ابحث عن IPv4 Address في WiFi أو Ethernet)
  // - Mac/Linux: افتح Terminal واكتب: ifconfig أو ip addr
  //
  // ⚠️ تأكد من:
  // - أن السيرفر يعمل على المنفذ 4000 (افتح المتصفح وجرب: https://metagym.metacodecx.com)
  // - أن Firewall يسمح بالاتصالات الواردة على المنفذ 4000
  // - أن الجهاز والسيرفر على نفس الشبكة (WiFi/LAN)
  // - أعد تشغيل التطبيق بعد تغيير الـ URL (Stop ثم Run - ليس Hot Reload)

  // اختر أحد الخيارات التالية:
  static const String mainAppUrl =
      "https://metagym.metacodecx.com"; // Production Server (موصى به)
  // static const String mainAppUrl = "https://metagym.metacodecx.com"; // Android Emulator (10.0.0.2)
  // static const String mainAppUrl = "https://metagym.metacodecx.com"; // Local Network (استبدل IP)
  // static const String mainAppUrl = "https://metagym.metacodecx.com"; // iOS Simulator

  static String get baseUrl => "$mainAppUrl/api/v1";

  static String get imageBaseUrl => "$mainAppUrl/Uploads";

  // Authentication Endpoints
  static const String doServerLoginApiCall = "/auth/login";
  static const String doServerRegisterApiCall = "/auth/signup";
  static const String doServerChangePasswordApiCall = "/auth/updatepassword";
  static const String doServerUpdateProfileApiCall = "/users/updatemydata";
  static const String doServerUpdateSignatureApiCall =
      "/users/upload-signature";
  static const String doServerGetProfileApiCall = "/auth/me";
  static const String doFireBasePhoneTokenApiCall = "/auth/firebase-token";

  // Gym Members Endpoints
  static const String doServerGetMembers = "/gym/members";
  static const String doServerCreateMember = "/gym/members";
  static const String doServerUpdateMember = "/gym/members";
  static const String doServerDeleteMember = "/gym/members";

  // Subscriptions Endpoints
  static const String doServerGetSubscribtions = "/gym/subscription-types/all"; // أنواع الاشتراكات
  static const String doServerAddSubscribtions = "/gym/subscriptions";
  static const String stopedServerSubscribtions = "/gym/subscriptions";

  // My Subscriptions
  static const String doServerGetMySubscribtions = "/gym/subscriptions";

  // Branches
  static const String doServerAllBranches = "/branches";

  // Calendar/Attendance
  static const String doServerCalenderApiCall =
      "/gym/member-attendance/calendar";

  // News
  static const String doServerGetNewsList = "/app/news";

  // InBody
  static const String doServerGetInbodyList = "/gym/inbody";

  // Captains/Trainers
  static const String doServerGetCaptainsList = "/app/trainers";

  // Offers
  static const String doServerGetOfferList = "/app/offers";
  static const String doServerAddFavOffer = "/app/offers/favourite";

  // Send Invitation
  static const String doServerSendInvitation = "/app/invitations";

  // Exercises
  static const String doServerGetExercisesList = "/app/exercises";
  static const String doServerExercisesCat = "/app/exercise-categories";

  // Ads/Sliders
  static const String doServerAdsList = "/app/ads";

  // Messages (if available in new API)
  static const String doServerSendMessageApiCall = "/app/messages";
  static const String doServerAllMessageApiCall = "/app/messages";
  static const String doServerSentMessageApiCall = "/app/messages/sent";
  static const String doServerMessageDetailsApiCall = "/app/messages";
  static const String doServerSeenMessageApiCall = "/app/messages/seen";
  static const String doServerDeleteMessageApiCall = "/app/messages";

  // About App
  static const String doServerAboutAppApiCall = "/app/about";
  static const String doServerPrivacyAndPolicyCall = "/app/policy";

  // Services
  static const String doServerServicesList = "/services";

  // Splash Screens
  static const String doSplashScreens = "/app/splash-screens";

  // Legacy endpoints - قد تحتاج إلى تحديث حسب الـ API الجديد
  static const String doServerNewBasma = "/gym/member-attendance";
  static const String doServerEmployeesApiCall = "/users";
  static const String doServerAlltypeOzonat = "/permissions/types";
  static const String doServerAddEzen = "/permissions";
  static const String doServerAllEznApiCall = "/permissions";
  static const String doServerDeleteEznApiCall = "/permissions";
  static const String doServerEditEzen = "/permissions";
  static const String doServerWaredEznApiCall = "/permissions/received";
  static const String doServerEgraaEznApiCall = "/permissions/approve";
  static const String doServerAlltypeVacation = "/vacations/types";
  static const String doServerAddVacation = "/vacations";
  static const String doServerAllVacationApiCall = "/vacations";
  static const String doServerDeleteVacationApiCall = "/vacations";
  static const String doServerEditVacation = "/vacations";
  static const String doServerEgraaVacationApiCall = "/vacations/approve";
  static const String doServerSeenTa3mem = "/notifications/seen";
  static const String doServerAddAnswerMosalat = "/messages/response";
  static const String doServerGetLawa2hList = "/notifications";
  static const String doServerSeenLayha = "/notifications/seen";
  static const String doServerGetEnzaratList = "/warnings";
  static const String doServerSeenEnzarat = "/warnings/seen";
  static const String doServerEvaluationTypes = "/evaluations/types";
  static const String doServerAllEmpTaqeem = "/evaluations";
  static const String doServerAllManagerTaqeem = "/evaluations/manager";
  static const String doServerAllBnodTaqeem = "/evaluations/branches";
  static const String addTaqeem = "/evaluations";
  static const String editTaqeem = "/evaluations";
  static const String lastTaqeem = "/evaluations/last";
  static const String myTaqeem = "/evaluations/my";
  static const String doServerMonth = "/months";
  static const String doServerEditTaqeem = "/evaluations";
  static const String doServerDeleteTaqeem = "/evaluations";
}

// API القديم - تم إلغاؤه
// class CodeApi {
//   static const String mainAppUrl = "https://alatheertech.com/";
//   static const String baseUrl = "${mainAppUrl}basma/Api/";
//   static const String getCodeUrl = "All_Gym";
// }

// استخدام NewApi بدلاً من CodeApi
class CodeApi {
  // استخدم نفس الـ URL من NewApi
  static const String mainAppUrl = NewApi.mainAppUrl;
  static const String baseUrl = "$mainAppUrl/api/v1";
  static const String getCodeUrl = "/gym/members";
}

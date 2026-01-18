// urls
import 'package:flutter/material.dart';

const fetchLimit = 10;
const baseUrl = "https://www.googleapis.com/books/v1/i";

// Routes
const String initialRoute = '/';
const String kHomeScreen = '/homeScreen';
const String kBookDetailsScreen = '/bookDetailsScreen';
const String kSearchScreen = '/searchScreen';
const String kIntroScreen = '/introScreen';
const String kBookLanguageScreen = '/bookLanguageScreen';
const String kRegisterScreen = "/registerScreen";
const String kCameraScreen = '/codeCameraScreen';
//Subscribtions
const String kSubscribtionsDetailsScreenRoute = '/SubscribtionsDetailsScreen';
const String kSubscribtionsScreen = "/subscribtionsScreen";
const String kAddSubscribtionsScreen = "/addSubscribtionsScreen";
const String kStopedSubscribtionsScreen = "/StopedSubscribtionsScreen";

//MySubscribtions
const String kMySubscribtionsScreen = "/mySubscribtionsScreen";

const String kMySubscribtionsDetailsScreenRoute =
    '/mySubscribtionsDetailsScreen';

///

const String kVerificationScreen = "/verificationScreen";
const String kTapBarScreen = "/tapBarScreen";
const String kRejectedTapScreen = "/rejectedTapScreen";
const String kUpComingTapScreen = "/upcomingTapScreen";
const String kCurrentTapScreen = "/currentTapScreen";
const String kDataTableScreen = "/dataTableScreen";
const String kButtonNav = '/KBottomNav';
const String kRequestStatusScreen = '/kRequestStatusScreen';
const String kAppHomeScreen = '/kAppHomeScreen';
const String kFollowingRequestScreen = '/kFollowingRequestScreen';
const String kCustomStepper = '/kCustomStepper';

const String kLanguageScreenRoute = '/bookLanguageScreen';
const String kLoginScreenRoute = "/kLoginScreen";
const String kCodeScreenRoute = "/kCodeScreen";

const String kBottomNavRoute = '/KBottomNav';
const String kMyOrdersScreenRoute = '/kMyOrdersScreen';
const String kSendInvitationScreenRoute = '/kContactUsScreen';
const String kEditProfileScreenRoute = '/kEditProfileScreen';
const String kVacationRequestScreenRoute = '/kVacationRequestScreen';
const String kPermissionRequestScreenRoute = '/kPermissionRequestScreen';
const String kPersonalAccountScreenRoute = '/kPersonalAccountScreen';
const String kDeptRequestScreenRoute = '/kDeptRequestScreen';
const String kMessagesScreenRoute = '/kMessagesScreen';
const String kNewMessageScreenRoute = '/kNewMessageScreen';
const String kNotificationScreenRoute = '/kNotificationScreen';
const String kEmployeeProfileFormScreenStep2Route =
    '/kEmployeeProfileFormScreenStep2';
const String kChangeBankAccountScreenStep2Route =
    '/kChangeBankAccountScreenStep2';
const String kForgetPasswordScreenRoute = '/kForgetPasswordScreen';
const String kChangePasswordScreenRoute = '/kChangePasswordScreen';
const String kMessageDetailsViewRoute = '/kMessageDetailsView';
const String kPrivecyAndPolicyViewRoute = '/kPrivacyAndPolicyView';

const String kUpdateProfileScreenRoute = '/kUpdateProfileScreen';
const String kUpdateSignatureScreenRoute = '/kUpdateSignatureScreen';
//news
const String kNewsScreenRoute = '/kNewsScreenScreen';
const String kNewsDetailsScreenRoute = '/kNewsDetailsScreenRoute';

//AllIndody
const String kAllIndodyScreenRoute = '/kAllIndodyScreenScreen';
const String kAllIndodyDetailsScreenRoute = '/kAllIndodyDetailsScreenRoute';
//Captains
const String kCaptainsScreenRoute = '/kCaptainsScreenScreen';
const String kCaptainsDetailsScreenRoute = '/kCaptainsDetailsScreenRoute';

//Ads
const String kAdsDetailsScreenRoute = '/kAdsDetailsScreenRoute';

//profile
const String kProfileScreenRoute = '/kProfileScreen';

//aboutApp
const String kAboutAppScreenRoute = '/kAboutAppScreen';

//privacyAndPolicy
const String kPrivacyAndPolicyScreenRoute = '/kPrivacyAndPolicyScreen';

const String kOffersScreenRoute = '/kOffersScreen';
const String kOffersDetailsScreenRoute = '/kOffersDetailsScreenRoute';
const String kExercisesScreenRoute = '/kExercisesScreen';
const String kExercisesDetailsScreenRoute = '/kExercisesDetailsScreenRoute';

// saved sharedPreference
const String locale = 'locale';
const String idEmployee = 'idEmployee';
const String timeIn = 'timeIn';
const String timeOut = 'timeOut';
const String timeDiff = 'timeDiff';

const String english = 'en';
const String arabic = 'ar';

//color
//Box<CodeEntity> boxCode = Hive.box<CodeEntity>(kCodeDataBox);

// Color get baseColor => HexColor(boxCode.get(kCodeDataBox) != null
//     ? boxCode.get(kCodeDataBox)!.color
//     : '#6953C2');

Color kPrimaryColor = const Color(0xff3ed9c9); // خلفية باللون 3ed9c9 (فيروزى مائل للأخضر)
const String logo = "https://alatheertech.com/basma/uploads/logo/noamany.png";

//Color kSecondaryColor = HexColor("#0095b0");
const Color kTextColor = Colors.black; // تكست غامق
const Color kOutPutContainerTextColor = Color(0xffABABAC);
const Color kPinCodeTextFieldColor = Color(0xffE8E8E8);
const Color kSettingIconsColor = Color(0xff707070);

const kTransitionDuration = Duration(milliseconds: 250);
const kGtSectraFine = 'GT Sectra Fine';
const kHacenTunisia = 'Hacen Tunisia';
const kFeaturedBox = 'featured_box';
const kNewestBox = 'newest_box';
const kEmployeeDataBox = 'employee_data_box';
const kLogoutOptionDataBox = 'logout_option';

const kFingerPrintDataBox = 'finger_print_data_box';
const kNewFingerPrintDataBox = 'new_finger_print_data_box';

const kTableDataBox = 'table_data_box';
const kCodeDataBox = 'code_data_box';

const int kPersonalAccountScreen = 0;
const int kMessagesView = 1;
const int kNotificationView = 2;
const int kMyOrdersView = 3;
const int kHomeViews = 4;
const int kRequestVacationScreen = 5;
const int kRequestDeptScreen = 6;
const int kRequestPermissionScreen = 7;
const int kListPermissionScreen = 8;
const int kEmployeeProfileFormScreenStep1 = 9;
const int kPaymentPermissionScreen = 10;
const int kEmployeesProfileFormScreenStep2 = 11;
const int kNewMessageView = 12;
const int kDataTableView = 13;
const int kOrderDetailsScreen = 14;
const int kFollowingRequestsScreen = 15;
const int kChangeBankAccountViewStep1 = 16;
const int kChangeBankAccountViewStep2 = 17;
const int kEditProfileScreen = 18;
const int kContactsUsScreen = 19;
const int kNotificationScreen = 20;
const int kAboutAppView = 3;
const int kCalenderView = 22;
const int kMessagesDetailsView = 23;
const int kPrivecyAndPolicyView = 6;
const int kEditePermissionScreen = 25;

const int kEditeVacationScreen = 26;
const int kDetailsVacationScreen = 27;
const int kAddVacationScreen = 28;
const int kListVacationScreen = 29;
const int kWaredEzenScreen = 30;
const int kTa3memScreen = 31;
const int kTa3memDetailsScreen = 32;
const int kEnzaratScreen = 33;
const int kEnzaratDetailsScreen = 34;
const int kTypesRateScreen = 35;
const int kAllEmpTaqeemScreen = 36;
const int kBnodTaqeemView = 37;
const int kLastTaqeemScreen = 38;
const int kLwae7View = 39;
const int kSeenLwae7Screen = 40;
const int kEditTaqeemScreen = 41;
const int kMosalatListScreen = 42;

const int kMosalatDetailsScreen = 43;

const int kMyTaqeemScreen = 44;

const int kProfileScreen = 45;

class AppConstant {
  static const String appName = "fingerprint";
  static const String mainDir = "/";
  static const String favorite = "favorite";
  static const String data = "data";
  static const String message = "message";
  static const String code = "code";

  static const bool inProduction = bool.fromEnvironment("dart.vm.product");
  static const imageBaseUrl = "https://alatheer.site/abnaa/";
  static const String appLogoPath = "assets/images/ic_arabic_cafe_logo.png";
  // TODO: inject secrets from env/secure storage; keep values out of VCS
  static const String mapApi = String.fromEnvironment('MAP_API_KEY', defaultValue: '');
  static const String tapApiKeyLive = String.fromEnvironment('STRIPE_SECRET_KEY', defaultValue: '');
  // ignore: constant_identifier_names
  static const String privacy =
      'https://pages.flycricket.io/zaheyapp/privacy.html';

  // ignore: non_constant_identifier_names
  static var SOURCE_LOGIN = "LOGIN";
}

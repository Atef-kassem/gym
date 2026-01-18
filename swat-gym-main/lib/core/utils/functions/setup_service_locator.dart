// ignore_for_file: depend_on_referenced_packages

import 'package:get_it/get_it.dart';
import 'package:swat_gym/features/app_home/data/dat_source/finger_print/_remote_data_source/all_services_remote_data_source.dart';
import 'package:swat_gym/features/app_home/presentation/manger/ads_cubit/ads_cubit.dart';
import 'package:swat_gym/features/app_home/presentation/manger/services_cubit/services_cubit.dart';
import 'package:swat_gym/features/app_home/presentation/manger/toggle_cubit.dart';
import 'package:swat_gym/features/auth/register/data/data_sources/register_remote_data_source/branches_remote_data_source.dart';
import 'package:swat_gym/features/auth/register/presentation/manager/cubit/count_down_timer_cubit.dart';
import 'package:swat_gym/features/auth/register/presentation/manager/cubit/phone_auth_cubit.dart';
import 'package:swat_gym/features/auth/register/presentation/manager/cubit/radio_cubit.dart';
import 'package:swat_gym/features/auth/register/presentation/manager/cubit/type_ezen_cubit/type_branches_cubit.dart';
import 'package:swat_gym/features/auth/update_profile/data/data_sources/update_profile_remote_data_source.dart';
import 'package:swat_gym/features/auth/update_profile/data/repositories/update_profile_repo_impl.dart';
import 'package:swat_gym/features/auth/update_profile/domain/repositories/update_profile_repo.dart';
import 'package:swat_gym/features/auth/update_profile/domain/use_cases/update_profile_use_case.dart';
import 'package:swat_gym/features/auth/update_profile/presentation/manager/cubit%20copy/select_file_cubit.dart';
import 'package:swat_gym/features/auth/update_profile/presentation/manager/cubit/update_profile_cubit.dart';
import 'package:swat_gym/features/auth/update_signature/data/data_sources/update_signature_remote_data_source.dart';
import 'package:swat_gym/features/auth/update_signature/data/repositories/update_signature_repo_impl.dart';
import 'package:swat_gym/features/auth/update_signature/domain/repositories/update_signature_repo.dart';
import 'package:swat_gym/features/auth/update_signature/domain/use_cases/update_signature_use_case.dart';
import 'package:swat_gym/features/auth/update_signature/presentation/manager/cubit/update_signature_cubit.dart';
import 'package:swat_gym/features/captains/data/data_sources/remote_data_source/all_captains_remote_data_source.dart';
import 'package:swat_gym/features/captains/data/repositories/captains_repo_impl.dart';
import 'package:swat_gym/features/captains/domain/repositories/captains_repo.dart';
import 'package:swat_gym/features/captains/domain/use_cases/captains_use_case.dart';
import 'package:swat_gym/features/captains/presentation/manager/news_cubit/captains_cubit.dart';
import 'package:swat_gym/features/contact_us/data/data_sources/send_invitation_remote_data_source.dart';
import 'package:swat_gym/features/contact_us/data/repositories/send_invitation_repo.dart';
import 'package:swat_gym/features/contact_us/domain/repositories/send_invitation_repo_impl.dart';
import 'package:swat_gym/features/contact_us/domain/use_cases/send_invitation_use_case.dart';
import 'package:swat_gym/features/contact_us/presentation/manager/add_subscribtions_cubit/send_invitation_cubit.dart';
import 'package:swat_gym/features/exercises/data/data_sources/remote_data_source/all_exercises_remote_data_source.dart';
import 'package:swat_gym/features/exercises/data/repositories/exercise_repo_impl.dart';
import 'package:swat_gym/features/exercises/domain/repositories/exercise_repo.dart';
import 'package:swat_gym/features/exercises/domain/use_cases/exercise_use_case.dart';
import 'package:swat_gym/features/inbody/data/data_sources/remote_data_source/all_inbody_remote_data_source.dart';
import 'package:swat_gym/features/inbody/data/repositories/news_repo_impl.dart';
import 'package:swat_gym/features/inbody/domain/repositories/all_inbody_repo.dart';
import 'package:swat_gym/features/inbody/domain/use_cases/all_inbody_use_case.dart';
import 'package:swat_gym/features/inbody/presentation/manager/news_cubit/all_inbody_cubit.dart';
import 'package:swat_gym/features/introduction/data/dat_source/remote_data_source/all_intro_remote_data_source.dart';
import 'package:swat_gym/features/introduction/data/repository/intro_repository_implementation.dart';
import 'package:swat_gym/features/introduction/domain/repository/intro_repo.dart';
import 'package:swat_gym/features/introduction/domain/use_cases/intro_use_case.dart';
import 'package:swat_gym/features/introduction/presentation/manger/services_cubit/intro_cubit.dart';
import 'package:swat_gym/features/my_subscribtions/data/data_sources/my_subscribtions_remote_data_source.dart';
import 'package:swat_gym/features/my_subscribtions/data/data_sources/stoped_subscribtions_remote_data_source.dart';
import 'package:swat_gym/features/my_subscribtions/data/repositories/my_subscribtions_repo.dart';
import 'package:swat_gym/features/my_subscribtions/domain/repositories/my_subscribtions_repo_impl.dart';
import 'package:swat_gym/features/my_subscribtions/domain/use_cases/my_subscribtions_use_case.dart';
import 'package:swat_gym/features/my_subscribtions/presentation/manager/stoped_subscribtions_cubit/stoped_subscribtions_cubit.dart';
import 'package:swat_gym/features/my_subscribtions/presentation/manager/ta3mem_cubit/my_subscribtions_cubit.dart';
import 'package:swat_gym/features/new_bsama_add_Fingerprint/data/dat_source/finger_print/_remote_data_source/new_finger_print_remote_data_source.dart';
import 'package:swat_gym/features/new_bsama_add_Fingerprint/data/repository/new_finger_print_repository_implementation.dart';
import 'package:swat_gym/features/new_bsama_add_Fingerprint/domain/repository/new_finger_print_repo.dart';
import 'package:swat_gym/features/new_bsama_add_Fingerprint/domain/use_cases/new_finger_print_use_case.dart';
import 'package:swat_gym/features/new_bsama_add_Fingerprint/presentation/manger/new_finger_print_cubit.dart';
import 'package:swat_gym/Features/notification_view/data/data_sources/remote_data_source/all_messages_remote_data_source.dart';
import 'package:swat_gym/Features/notification_view/data/repositories/messages_repo_impl.dart';
import 'package:swat_gym/Features/notification_view/domain/repositories/my_messages_repo.dart';
import 'package:swat_gym/Features/notification_view/domain/use_cases/my_messages_use_case.dart';
import 'package:swat_gym/Features/notification_view/presentation/manager/my_messages_cubit.dart';
import 'package:swat_gym/features/offers/data/data_sources/remote_data_source/all_offers_remote_data_source.dart';
import 'package:swat_gym/features/offers/data/repositories/offers_repo_impl.dart';
import 'package:swat_gym/features/offers/domain/repositories/offers_repo.dart';
import 'package:swat_gym/features/offers/domain/use_cases/offers_use_case.dart';
import 'package:swat_gym/features/offers/presentation/manager/news_cubit/offers_cubit.dart';
import 'package:swat_gym/features/offers/presentation/manager/seen_cubit/add_offers_cubit.dart';
import 'package:swat_gym/features/personal_account/data/data_sources/get_profile_remote_data_source.dart';
import 'package:swat_gym/features/personal_account/data/repositories/get_profile_repo_impl.dart';
import 'package:swat_gym/features/personal_account/domain/repositories/get_profile_repo.dart';
import 'package:swat_gym/features/personal_account/domain/use_cases/get_profile_use_case.dart';
import 'package:swat_gym/features/personal_account/presentation/manager/cubit/get_profile_cubit.dart';
import 'package:swat_gym/features/privacy_and_policy/data/data_sources/privacy_and_policy_remote_data_sources.dart';
import 'package:swat_gym/features/privacy_and_policy/data/repositories/privacy_and_policy_repo_impl.dart';
import 'package:swat_gym/features/privacy_and_policy/domain/repositories/privacy_and_policy_repo.dart';
import 'package:swat_gym/features/privacy_and_policy/domain/use_cases/privacy_and_policy_use_case.dart';
import 'package:swat_gym/features/privacy_and_policy/presentation/manager/cubit/privacy_and_policy_cubit.dart';
import 'package:swat_gym/features/news/data/data_sources/remote_data_source/all_news_remote_data_source.dart';
import 'package:swat_gym/features/news/data/repositories/news_repo_impl.dart';
import 'package:swat_gym/features/news/domain/repositories/news_repo.dart';
import 'package:swat_gym/features/news/domain/use_cases/news_use_case.dart';
import 'package:swat_gym/features/news/presentation/manager/news_cubit/news_cubit.dart';
import 'package:swat_gym/features/subscribtions/data/data_sources/add_subscribtions_remote_data_source.dart';
import 'package:swat_gym/features/subscribtions/data/data_sources/subscribtions_remote_data_source.dart';
import 'package:swat_gym/features/subscribtions/presentation/manager/add_subscribtions_cubit/add_subscribtions_cubit.dart';
import 'package:swat_gym/features/subscribtions/presentation/manager/pick_cubit/pick_date_cubit.dart';
import 'package:swat_gym/features/subscribtions/presentation/manager/ta3mem_cubit/subscribtions_cubit.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../../../features/about_app/data/data_sources/about_app_remote_data_sources.dart';
import '../../../features/about_app/data/repositories/about_app_repo_impl.dart';
import '../../../features/about_app/domain/repositories/about_app_repo.dart';
import '../../../features/about_app/domain/use_cases/about_app_use_case.dart';
import '../../../features/about_app/presentation/manager/cubit/about_app_cubit.dart';
import '../../../features/app_home/data/dat_source/finger_print/_remote_data_source/finger_print_remote_data_source.dart';
import '../../../features/app_home/data/repository/finger_print_repository_implementation.dart';
import '../../../features/app_home/domain/repository/finger_print_repo.dart';
import '../../../features/app_home/domain/use_cases/finger_print_use_case.dart';
import '../../../features/app_home/presentation/manger/finger_print_cubit.dart';
import '../../../features/auth/change_password/data/data_sources/change_password_remote_data_source.dart';
import '../../../features/auth/change_password/data/repositories/change_password_repo_impl.dart';
import '../../../features/auth/change_password/domain/repositories/change_password_repo.dart';
import '../../../features/auth/change_password/domain/use_cases/change_password_use_case.dart';
import '../../../features/auth/change_password/presentation/manager/cubit/change_password_cubit.dart';
import '../../../features/auth/fire_base_token/data/dat_source/token_data_source.dart';
import '../../../features/auth/fire_base_token/data/repository/token_repository_implementation.dart';
import '../../../features/auth/fire_base_token/domain/repository/token_repo.dart';
import '../../../features/auth/fire_base_token/domain/use_cases/token_use_case.dart';
import '../../../features/auth/fire_base_token/presentation/manger/token_cubit.dart';
import '../../../features/auth/login/data/dat_source/login_remote_data_source/login_remote_data_source.dart';
import '../../../features/auth/login/data/repository/login_repository_implementation.dart';
import '../../../features/auth/login/domain/repository/login_repo.dart';
import '../../../features/auth/login/domain/use_cases/login_use_case.dart';
import '../../../features/auth/login/presentation/manger/login_cubit.dart';
import '../../../features/auth/register/data/data_sources/register_remote_data_source/register_remote_data_source.dart';
import '../../../features/auth/register/data/repository/register_repo_impl.dart';
import '../../../features/auth/register/domain/repositories/register_repo.dart';
import '../../../features/auth/register/domain/use_cases/register_use_case.dart';
import '../../../features/auth/register/presentation/manager/cubit/register_cubit.dart';
import '../../../features/bottom_nav/presentation/manger/cubit/bottom_nav_cubit.dart';
import '../../../features/calender/data/data_sources/calender_remote_data_source/calender_remote_data_source.dart';
import '../../../features/calender/data/repository/table_repo_implementation.dart';
import '../../../features/calender/domain/repositories/calender_repository.dart';
import '../../../features/calender/domain/use_case/calender_use_case.dart';
import '../../../features/calender/presentation/manager/cubit/calender_table_cubit.dart';


import '../../../features/exercises/presentation/manager/exercise_cat_cubit/exercise_cat_cubit.dart';
import '../../../features/exercises/presentation/manager/exercise_cubit/exercise_cubit.dart';
import '../../../features/offers/data/data_sources/remote_data_source/add_offer_remote_data_source.dart';
import '../../../features/splash/data/datasources/language_local_data_source.dart';
import '../../../features/splash/data/datasources/language_local_data_source_impl.dart';
import '../../../features/splash/data/repositories/language_repository_impl.dart';
import '../../../features/splash/domain/repositories/language_repository.dart';
import '../../../features/splash/domain/use_case/change_locale_use_case.dart';
import '../../../features/splash/domain/use_case/get_saved_lang_use_case.dart';
import '../../../features/splash/presentation/manger/locale_cubit/locale_cubit.dart';

import '../../../features/subscribtions/data/repositories/subscribtions_repo.dart';
import '../../../features/subscribtions/domain/repositories/subscribtions_repo_impl.dart';
import '../../../features/subscribtions/domain/use_cases/subscribtions_use_case.dart';
import '../network/network_request.dart';

final getIt = GetIt.instance;
Future<void> init() async {
  getIt.registerFactory<LocaleCubit>(() => LocaleCubit(
      changeLocaleUseCase: getIt.call(), getSavedLangUseCase: getIt.call()));

  getIt.registerLazySingleton<GetSavedLangUseCase>(
      () => GetSavedLangUseCase(languageRepository: getIt.call()));
  getIt.registerLazySingleton<ChangeLocaleUseCase>(
      () => ChangeLocaleUseCase(languageRepository: getIt.call()));

  getIt.registerLazySingleton<LanguageRepository>(
      () => LanguageRepositoryImpl(languageLocalDataSource: getIt.call()));

  ///  Login
  getIt.registerFactory<LoginCubit>(() => LoginCubit(getIt.call()));

  getIt.registerLazySingleton<LoginUseCase>(() => LoginUseCase(getIt.call()));

  getIt.registerLazySingleton<LoginRepository>(
      () => LoginRepoImpl(getIt.call()));

  getIt.registerLazySingleton<LoginRemoteDataSource>(
      () => LoginRemoteDataSourceImpl());

  getIt.registerLazySingleton<NetworkRequest>(() => NetworkRequestImp());

///////////////////


  ///Ft3
  ///
  ///  token
  getIt.registerFactory<TokenCubit>(() => TokenCubit(getIt.call()));

  getIt.registerLazySingleton<TokenUseCase>(() => TokenUseCase(getIt.call()));

  getIt.registerLazySingleton<TokenRepository>(
      () => TokenRepoImpl(getIt.call()));

  getIt.registerLazySingleton<TokenRemoteDataSource>(
      () => TokenRemoteDataSourceImpl());

///////////////////
  ///
  /// FingerPrint
  getIt.registerFactory<FingerPrintCubit>(() => FingerPrintCubit(getIt.call()));

  getIt.registerFactory<ServicesCubit>(() => ServicesCubit(getIt.call()));

  getIt.registerFactory<AdsCubit>(() => AdsCubit(getIt.call()));

  getIt.registerLazySingleton<FingerPrintUseCase>(
      () => FingerPrintUseCase(getIt.call()));

  getIt.registerLazySingleton<FingerPrintRepository>(
      () => FingerPrintRepoImpl(getIt.call(), getIt.call()));

  getIt.registerLazySingleton<FingerPrintRemoteDataSource>(
      () => FingerPrintRemoteDataSourceImpl());

  getIt.registerLazySingleton<AllServicesRemoteDataSource>(
      () => AllServicesRemoteDataSourceImpl());

  // Calender Data
  getIt.registerFactory<CalenderCubit>(() => CalenderCubit(getIt.call()));

  getIt.registerLazySingleton<CalenderUseCase>(
      () => CalenderUseCase(getIt.call()));

  getIt.registerLazySingleton<CalenderRepository>(
      () => CalenderRepositoryImp(getIt.call()));

  getIt.registerLazySingleton<CalenderRemoteDataSource>(
      () => CalenderRemoteDataSourceImpl());

  ////
  ///

  ////
  ///OTP PHONE AUTH
  getIt.registerFactory<PhoneAuthCubit>(() => PhoneAuthCubit());
  ////Count down Timer
  getIt.registerFactory<CountDownTimerCubit>(() => CountDownTimerCubit());

  ///REGISTER
  getIt.registerFactory<RegisterCubit>(() => RegisterCubit(getIt.call()));
  getIt.registerFactory<TypeBranchesCubit>(
      () => TypeBranchesCubit(getIt.call()));

  getIt.registerLazySingleton<RegisterUseCase>(
      () => RegisterUseCase(getIt.call()));

  getIt.registerLazySingleton<RegisterRepository>(
      () => RegisterRepoImpl(getIt.call(), getIt.call()));

  getIt.registerLazySingleton<RegisterRemoteDataSource>(
      () => RegisterRemoteDataSourceImpl());

  getIt.registerFactory<TypeBranchesRemoteDataSource>(
      () => TypeBranchesRemoteDataSourceImpl());
////////////
  ///CHANGEPASSWORD
  getIt.registerFactory<ChangePasswordCubit>(
      () => ChangePasswordCubit(getIt.call()));

  getIt.registerLazySingleton<ChangePasswordUseCase>(
      () => ChangePasswordUseCase(getIt.call()));

  getIt.registerLazySingleton<ChangePasswordRepository>(
      () => ChangePasswordRepoImpl(getIt.call()));

  getIt.registerLazySingleton<ChangePasswordRemoteDataSource>(
      () => ChangePasswordRemoteDataSourceImpl());
//////////////
  ///
//////
  ///
  ///  //finger

  getIt.registerFactory<NewFingerPrintCubit>(
      () => NewFingerPrintCubit(getIt.call()));

  getIt.registerLazySingleton<NewFingerPrintUseCase>(
      () => NewFingerPrintUseCase(getIt.call()));

  getIt.registerLazySingleton<NewFingerPrintRepository>(
      () => NewFingerPrintRepoImpl(getIt.call()));

  getIt.registerLazySingleton<NewFingerPrintRemoteDataSource>(
      () => NewFingerPrintRemoteDataSourceImpl());

  ///   intro

  getIt.registerFactory<IntroCubit>(() => IntroCubit(getIt.call()));

  getIt.registerLazySingleton<IntroUseCase>(() => IntroUseCase(getIt.call()));

  getIt.registerLazySingleton<IntroRepository>(
      () => IntroRepoImpl(getIt.call()));

  getIt.registerLazySingleton<AllIntroRemoteDataSource>(
      () => AllIntroRemoteDataSourceImpl());

  ///
  /// /Update profile
  getIt.registerFactory<UpdateProfileCubit>(
      () => UpdateProfileCubit(getIt.call()));

  getIt.registerLazySingleton<UpdateProfileUseCase>(
      () => UpdateProfileUseCase(getIt.call()));

  getIt.registerLazySingleton<UpdateProfileRepository>(
      () => UpdateProfileRepoImpl(getIt.call()));

  getIt.registerLazySingleton<UpdateProfileRemoteDataSource>(
      () => UpdateProfileRemoteDataSourceImpl());

  /// /get profile
  getIt.registerFactory<GetProfileCubit>(() => GetProfileCubit(getIt.call()));

  getIt.registerLazySingleton<GetProfileUseCase>(
      () => GetProfileUseCase(getIt.call()));

  getIt.registerLazySingleton<GetProfileRepository>(
      () => GetProfileRepoImpl(getIt.call()));

  getIt.registerLazySingleton<GetProfileRemoteDataSource>(
      () => GetProfileRemoteDataSourceImpl());

  /// /Update Signature
  getIt.registerFactory<UpdateSignatureCubit>(
      () => UpdateSignatureCubit(getIt.call()));

  getIt.registerLazySingleton<UpdateSignatureUseCase>(
      () => UpdateSignatureUseCase(getIt.call()));

  getIt.registerLazySingleton<UpdateSignatureRepository>(
      () => UpdateSignatureRepoImpl(getIt.call()));

  getIt.registerLazySingleton<UpdateSignatureRemoteDataSource>(
      () => UpdateSignatureRemoteDataSourceImpl());
//////////////
  getIt.registerLazySingleton<LanguageLocalDataSource>(
    () => LanguageLocalDataSourceImpl(sharedPreferences: getIt()),
  );
  getIt.registerFactory<BottomNavCubit>(() => BottomNavCubit());
  getIt.registerFactory<SelectFileCubit>(() => SelectFileCubit());
  getIt.registerFactory<ToggleCubit>(() => ToggleCubit(0));

//////////
  ///About App
  getIt.registerFactory<AboutAppCubit>(() => AboutAppCubit(getIt.call()));

  getIt.registerLazySingleton<AboutAppUseCase>(
      () => AboutAppUseCase(getIt.call()));

  getIt.registerLazySingleton<AboutAppRepo>(
      () => AboutAppRepositoryImpl(getIt.call()));

  getIt.registerLazySingleton<AboutAppRemoteDataSource>(
      () => AboutAppRemoteDataSourceImpl());

  ///
  ///Privacy And Policy
  getIt.registerFactory<PrivacyAndPolicyCubit>(
      () => PrivacyAndPolicyCubit(getIt.call()));

  getIt.registerLazySingleton<PrivacyAndPolicyUseCase>(
      () => PrivacyAndPolicyUseCase(getIt.call()));

  getIt.registerLazySingleton<PrivacyAndPolicyRepo>(
      () => PrivacyAndPolicyImpl(getIt.call()));

  getIt.registerLazySingleton<PrivacyAndPolicyRemoteDataSource>(
      () => PrivacyAndPolicyRemoteDataSourceImpl());

  ///
  ///

  ///

  ///
  ///news
  getIt.registerFactory<NewsCubit>(() => NewsCubit(getIt.call()));

  getIt.registerLazySingleton<NewsUseCase>(() => NewsUseCase(getIt.call()));

  getIt.registerLazySingleton<NewsRepo>(() => NewsRepositoryImp(
        getIt.call(),
      ));

  getIt.registerLazySingleton<AllNewsRemoteDataSource>(
      () => AllNewsRemoteDataSourceImpl());

  ///inbody
  getIt.registerFactory<AllInbodyCubit>(() => AllInbodyCubit(getIt.call()));

  getIt.registerLazySingleton<AllInbodyUseCase>(
      () => AllInbodyUseCase(getIt.call()));

  getIt.registerLazySingleton<AllInbodyRepo>(() => AllInbodyRepositoryImp(
        getIt.call(),
      ));

  getIt.registerLazySingleton<AllInbodyRemoteDataSource>(
      () => AllInbodyRemoteDataSourceImpl());

  /// captions
  getIt.registerFactory<CaptainsCubit>(() => CaptainsCubit(getIt.call()));

  getIt.registerLazySingleton<CaptainsUseCase>(
      () => CaptainsUseCase(getIt.call()));

  getIt.registerLazySingleton<CaptainsRepo>(() => CaptainsRepositoryImp(
        getIt.call(),
      ));

  getIt.registerLazySingleton<AllCaptainsRemoteDataSource>(
      () => AllCaptainsRemoteDataSourceImpl());

  ///offers
  getIt.registerFactory<OffersCubit>(() => OffersCubit(getIt.call()));
  getIt.registerFactory<AddOffersCubit>(() => AddOffersCubit(getIt.call()));

  getIt.registerLazySingleton<OffersUseCase>(() => OffersUseCase(getIt.call()));

  getIt.registerLazySingleton<OffersRepo>(() => OffersRepositoryImp(
        getIt.call(),
        getIt.call(),
      ));

  getIt.registerLazySingleton<AllOffersRemoteDataSource>(
      () => AllOffersRemoteDataSourceImpl());

  getIt.registerLazySingleton<AddOfferRemoteDataSource>(
      () => AddOfferRemoteDataSourceImpl());

  ///send Invitation
  getIt.registerFactory<SendInvitationCubit>(
      () => SendInvitationCubit(getIt.call()));

  getIt.registerLazySingleton<SendInvitationUseCase>(
      () => SendInvitationUseCase(getIt.call()));

  getIt.registerLazySingleton<SendInvitationRepo>(
      () => SendInvitationRepositoryImp(
            getIt.call(),
          ));

  getIt.registerLazySingleton<SendInvitationRemoteDataSource>(
      () => SendInvitationRemoteDataSourceImpl());

  ///excersies
  getIt.registerFactory<ExerciseCubit>(() => ExerciseCubit(getIt.call()));
  getIt.registerFactory<ExerciseCatCubit>(() => ExerciseCatCubit(getIt.call()));

  getIt.registerLazySingleton<ExerciseUseCase>(
      () => ExerciseUseCase(getIt.call()));

  getIt.registerLazySingleton<ExerciseRepo>(() => ExerciseRepositoryImp(
        getIt.call(),
      ));

  getIt.registerLazySingleton<AllExercisesRemoteDataSource>(
      () => AllExercisesRemoteDataSourceImpl());

  ///ALLMESSAGES
  getIt.registerFactory<MyMessagesCubit>(() => MyMessagesCubit(getIt.call()));

  getIt.registerLazySingleton<MyMessagesUseCase>(
      () => MyMessagesUseCase(getIt.call()));

  getIt.registerLazySingleton<MessagesRepo>(() => MessagesRepositoryImp(
        getIt.call(),
      ));
  getIt.registerLazySingleton<AllMessagesRemoteDataSource>(
      () => AllMessagesRemoteDataSourceImpl());

  ///subscribtions
  getIt.registerFactory<SubscribtionsCubit>(
      () => SubscribtionsCubit(getIt.call()));

  getIt.registerFactory<AddSubscribtionsCubit>(
      () => AddSubscribtionsCubit(getIt.call()));

  getIt.registerFactory<PickDateCubit>(() => PickDateCubit());

  getIt.registerLazySingleton<SubscribtionsUseCase>(
      () => SubscribtionsUseCase(getIt.call()));

  getIt.registerLazySingleton<SubscribtionsRepo>(
      () => SubscribtionsRepositoryImp(
            getIt.call(),
            getIt.call(),
          ));

  getIt.registerLazySingleton<SubscribtionsRemoteDataSource>(
      () => SubscribtionsRemoteDataSourceImpl());

  getIt.registerLazySingleton<AddSubscribtionsRemoteDataSource>(
    () => AddSubscribtionsRemoteDataSourceImpl(),
  );

  ///My subscribtions
  getIt.registerFactory<MySubscribtionsCubit>(
      () => MySubscribtionsCubit(getIt.call()));

  getIt.registerFactory<StopedSubscribtionsCubit>(
      () => StopedSubscribtionsCubit(getIt.call()));

  getIt.registerLazySingleton<MySubscribtionsUseCase>(
      () => MySubscribtionsUseCase(getIt.call()));

  getIt.registerLazySingleton<MySubscribtionsRepo>(
      () => MySubscribtionsRepositoryImp(
            getIt.call(),
            getIt.call(),
          ));

  getIt.registerLazySingleton<MySubscribtionsRemoteDataSource>(
      () => MySubscribtionsRemoteDataSourceImpl());

  getIt.registerLazySingleton<StopedSubscribtionsRemoteDataSource>(
      () => StopedSubscribtionsRemoteDataSourceImpl());

  getIt.registerFactory<RadioCubit>(() => RadioCubit());

  //! External
  final sharedPreferences = await SharedPreferences.getInstance();
  getIt.registerLazySingleton(() => sharedPreferences);
}

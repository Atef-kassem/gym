import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:swat_gym/core/utils/functions/setup_service_locator.dart';
import 'package:swat_gym/features/about_app/presentation/about_app_view.dart';
import 'package:swat_gym/features/about_app/presentation/manager/cubit/about_app_cubit.dart';
import 'package:swat_gym/features/app_home/presentation/views/screens/ads_details_view.dart';
import 'package:swat_gym/features/auth/change_password/presentation/manager/cubit/change_password_cubit.dart';
import 'package:swat_gym/features/auth/change_password/presentation/views/change_password_view.dart';
import 'package:swat_gym/features/auth/register/presentation/manager/cubit/phone_auth_cubit.dart';
import 'package:swat_gym/features/auth/register/presentation/manager/cubit/register_cubit.dart';
import 'package:swat_gym/features/auth/register/presentation/manager/cubit/type_ezen_cubit/type_branches_cubit.dart';
import 'package:swat_gym/features/auth/update_profile/presentation/manager/cubit%20copy/select_file_cubit.dart';
import 'package:swat_gym/features/auth/update_profile/presentation/manager/cubit/update_profile_cubit.dart';
import 'package:swat_gym/features/auth/update_profile/presentation/views/update_profile_view.dart';
import 'package:swat_gym/features/auth/update_signature/presentation/manager/cubit/update_signature_cubit.dart';
import 'package:swat_gym/features/auth/update_signature/presentation/views/update_signature_view.dart';
import 'package:swat_gym/features/captains/presentation/manager/news_cubit/captains_cubit.dart';
import 'package:swat_gym/features/captains/presentation/views/screens/captains_details_view.dart';
import 'package:swat_gym/features/captains/presentation/views/screens/captains_view.dart';

import 'package:swat_gym/features/contact_us/presentation/manager/add_subscribtions_cubit/send_invitation_cubit.dart';
import 'package:swat_gym/features/exercises/presentation/manager/exercise_cat_cubit/exercise_cat_cubit.dart';
import 'package:swat_gym/features/exercises/presentation/manager/exercise_cubit/exercise_cubit.dart';
import 'package:swat_gym/features/exercises/presentation/views/screens/exercies_details_view.dart';
import 'package:swat_gym/features/exercises/presentation/views/screens/exercises_view.dart';
import 'package:swat_gym/features/inbody/presentation/manager/news_cubit/all_inbody_cubit.dart';
import 'package:swat_gym/features/inbody/presentation/views/screens/all_inbody_details_view.dart';
import 'package:swat_gym/features/inbody/presentation/views/screens/all_inbody_view.dart';
import 'package:swat_gym/features/introduction/presentation/intro_screen.dart';
import 'package:swat_gym/features/introduction/presentation/manger/services_cubit/intro_cubit.dart';
import 'package:swat_gym/features/my_subscribtions/domain/entities/my_subscribtions_entity.dart';
import 'package:swat_gym/features/my_subscribtions/presentation/manager/stoped_subscribtions_cubit/stoped_subscribtions_cubit.dart';
import 'package:swat_gym/features/my_subscribtions/presentation/manager/ta3mem_cubit/my_subscribtions_cubit.dart';
import 'package:swat_gym/features/my_subscribtions/presentation/views/screens/my_subscribtions_details_view.dart';
import 'package:swat_gym/features/my_subscribtions/presentation/views/screens/my_subscribtions_view.dart';
import 'package:swat_gym/features/my_subscribtions/presentation/views/screens/stoped_subscribtions_screen.dart';
import 'package:swat_gym/features/news/presentation/manager/news_cubit/news_cubit.dart';
import 'package:swat_gym/features/news/presentation/views/screens/news_details_view.dart';
import 'package:swat_gym/features/news/presentation/views/screens/news_view.dart';
import 'package:swat_gym/Features/notification_view/presentation/manager/my_messages_cubit.dart';
import 'package:swat_gym/Features/notification_view/presentation/notification_view.dart';
import 'package:swat_gym/features/offers/presentation/manager/news_cubit/offers_cubit.dart';
import 'package:swat_gym/features/offers/presentation/manager/seen_cubit/add_offers_cubit.dart';
import 'package:swat_gym/features/offers/presentation/views/screens/offers_details_view.dart';
import 'package:swat_gym/features/offers/presentation/views/widgets/argyment.dart';
import 'package:swat_gym/features/personal_account/presentation/views/profile_screen.dart';
import 'package:swat_gym/features/privacy_and_policy/presentation/manager/cubit/privacy_and_policy_cubit.dart';
import 'package:swat_gym/features/privacy_and_policy/presentation/privacy_and_policy_view.dart';
import 'package:swat_gym/features/subscribtions/domain/entities/subscribtions_entity.dart';
import 'package:swat_gym/features/subscribtions/presentation/manager/add_subscribtions_cubit/add_subscribtions_cubit.dart';
import 'package:swat_gym/features/subscribtions/presentation/manager/ta3mem_cubit/subscribtions_cubit.dart';
import 'package:swat_gym/features/subscribtions/presentation/views/screens/add_subscribtions_screen.dart';
import 'package:swat_gym/features/subscribtions/presentation/views/screens/subscribtions_details_view.dart';
import 'package:swat_gym/features/subscribtions/presentation/views/screens/subscribtions_view.dart';

import '../../../features/auth/login/presentation/manger/login_cubit.dart';
import '../../../features/auth/login/presentation/views/login_view.dart';
import '../../../features/auth/register/presentation/views/register_view.dart';
import '../../../features/bottom_nav/presentation/views/bottom_nav.dart';
import '../../../features/contact_us/presentation/views/screens/send_invitation_screen.dart';
import '../../../features/edit_profile/presentation/screens/edit_profile_screen.dart';
import '../../../features/language/presentation/screens/language_screen.dart';
import '../../../features/offers/presentation/views/screens/offers_view.dart';
import '../../../features/personal_account/presentation/views/personal_account_screen.dart';
import '../../../features/splash/presentation/views/connection_page.dart';
import '../../../features/splash/presentation/views/splash_view.dart';
import '../constants.dart';

class AppRoutes {
  static Route? onGenerateRoute(RouteSettings routeSettings) {
    final args = routeSettings.arguments;

    switch (routeSettings.name) {
      case initialRoute:
        return MaterialPageRoute(builder: (_) => const SplashView());

      case kBottomNavRoute:
        return MaterialPageRoute(
            builder: (_) => BottomNav(senderId: args as int));
      case kHomeScreen:
        return MaterialPageRoute(builder: (_) => const MyHomePage());
      // case kBookDetailsScreen:
      //   return MaterialPageRoute(builder: (_) => const BookDetailsView());
      case kIntroScreen:
        return MaterialPageRoute(
            builder: (_) => BlocProvider(
                  create: (_) => getIt<IntroCubit>()..getAllLwae7List(),
                  child: const IntroScreen(),
                ));
      case kLanguageScreenRoute:
        return MaterialPageRoute(builder: (_) => const LanguageScreen());

      case kRegisterScreen:
        return MaterialPageRoute(
          builder: (_) => MultiBlocProvider(providers: [
            BlocProvider(
              create: (_) => getIt<RegisterCubit>(),
            ),
            BlocProvider(
              create: (_) => getIt<PhoneAuthCubit>(),
            ),
            BlocProvider(
              create: (_) => getIt<TypeBranchesCubit>()..getTypesEzen(),
            ),
          ], child: const RegisterView()),
        );

      case kLoginScreenRoute:
        return MaterialPageRoute(
          builder: (context) => MultiBlocProvider(
            providers: [
              BlocProvider(
                create: (context) => getIt<PhoneAuthCubit>(),
              ),
              BlocProvider(
                create: (context) => getIt<LoginCubit>(),
              ),
            ],
            child: const LoginView(),
          ),
        );

      // case kAttendanceScreen:
      //   return MaterialPageRoute(
      //     builder: (_) => const HomeScreen(),
      //   );

      case kSendInvitationScreenRoute:
        return MaterialPageRoute(
          builder: (_) => BlocProvider(
            create: (context) => getIt<SendInvitationCubit>(),
            child: const SendInvitationScreen(),
          ),
        );
      case kEditProfileScreenRoute:
        return MaterialPageRoute(
          builder: (_) => const EditProfileScreen(),
        );

      case kPersonalAccountScreenRoute:
        return MaterialPageRoute(
          builder: (_) => const PersonalAccountScreen(),
        );

      // case kAppHomeScreen:
      //   return MaterialPageRoute(
      //     builder: (_) => BlocProvider(
      //       create: (context) => getIt<AdsCubit>()..getAllAdsList(),
      //       child: const HomeViews(),
      //     ),
      //   );

      case kChangePasswordScreenRoute:
        return MaterialPageRoute(
          builder: (_) => BlocProvider(
            create: (_) => getIt<ChangePasswordCubit>(),
            child: const ChangePasswordView(),
          ),
        );

      case kUpdateProfileScreenRoute:
        return MaterialPageRoute(
          builder: (_) => MultiBlocProvider(
            providers: [
              BlocProvider(
                create: (_) => getIt<UpdateProfileCubit>(),
              ),
              BlocProvider(
                create: (context) => getIt<SelectFileCubit>(),
              ),
            ],
            child: const UpdateProfileView(),
          ),
        );

      case kUpdateSignatureScreenRoute:
        return MaterialPageRoute(
          builder: (_) => MultiBlocProvider(
            providers: [
              BlocProvider(
                create: (_) => getIt<UpdateSignatureCubit>(),
              ),
              BlocProvider(
                create: (context) => getIt<SelectFileCubit>(),
              ),
            ],
            child: const UpdateSignatureView(),
          ),
        );

      case kProfileScreenRoute:
        return MaterialPageRoute(
          builder: (_) => const ProfileScreen(),
        );
      case kAdsDetailsScreenRoute:
        return MaterialPageRoute(
          builder: (_) => const AdsDetailsView(),
        );
      case kNewsScreenRoute:
        return MaterialPageRoute(
          builder: (_) => BlocProvider(
            create: (_) => getIt<NewsCubit>(),
            child: const NewsView(),
          ),
        );
      case kNewsDetailsScreenRoute:
        return MaterialPageRoute(
          builder: (_) => const NewsDetailsView(),
        );
      case kAllIndodyScreenRoute:
        return MaterialPageRoute(
          builder: (_) => BlocProvider(
            create: (_) => getIt<AllInbodyCubit>(),
            child: const AllInbodyView(),
          ),
        );
      case kAllIndodyDetailsScreenRoute:
        return MaterialPageRoute(
          builder: (_) => const AllInbodyDetailsView(),
        );

      case kNotificationScreenRoute:
        return MaterialPageRoute(
          builder: (_) => BlocProvider(
            create: (_) => getIt<MyMessagesCubit>(),
            child: const NotificationView(),
          ),
        );

      case kCaptainsScreenRoute:
        return MaterialPageRoute(
          builder: (_) => BlocProvider(
            create: (_) => getIt<CaptainsCubit>()..getAllCaptains("1"),
            child: const CaptainsView(),
          ),
        );
      case kCaptainsDetailsScreenRoute:
        return MaterialPageRoute(
          builder: (_) => const CaptainsDetailsView(),
        );

      case kOffersScreenRoute:
        return MaterialPageRoute(
          builder: (_) => BlocProvider(
            create: (_) => getIt<OffersCubit>(),
            child: const OffersView(),
          ),
        );

      case kOffersDetailsScreenRoute:
        return MaterialPageRoute(
          builder: (_) => BlocProvider(
            create: (context) => getIt<AddOffersCubit>(),
            child: OffersDetailsView(
              list: args as offerDetails,
            ),
          ),
        );

      case kSubscribtionsScreen:
        return MaterialPageRoute(
            builder: (_) => MultiBlocProvider(
                  providers: [
                    BlocProvider(
                      create: (_) => getIt<SubscribtionsCubit>(),
                    ),
                  ],
                  child: const SubscribtionsView(),
                ));

      case kAddSubscribtionsScreen:
        return MaterialPageRoute(
            builder: (_) => MultiBlocProvider(
                  providers: [
                    BlocProvider(
                      create: (_) => getIt<AddSubscribtionsCubit>(),
                    ),
                  ],
                  child: AddSubscribtionsScreen(
                    exerciseEntity: args as SubscribtionsEntity,
                  ),
                ));

      case kStopedSubscribtionsScreen:
        return MaterialPageRoute(
            builder: (_) => MultiBlocProvider(
                  providers: [
                    BlocProvider(
                      create: (_) => getIt<StopedSubscribtionsCubit>(),
                    ),
                  ],
                  child: StopedSubscribtionsScreen(
                    exerciseEntity: args as MySubscribtionsEntity,
                  ),
                ));
      case kSubscribtionsDetailsScreenRoute:
        return MaterialPageRoute(
          builder: (_) => const SubscribtionsDetailsView(),
        );

      case kMySubscribtionsScreen:
        return MaterialPageRoute(
            builder: (_) => MultiBlocProvider(
                  providers: [
                    BlocProvider(
                      create: (_) => getIt<MySubscribtionsCubit>(),
                    ),
                  ],
                  child: const MySubscribtionsView(),
                ));
      case kMySubscribtionsDetailsScreenRoute:
        return MaterialPageRoute(
          builder: (_) => const MySubscribtionsDetailsView(),
        );

      case kExercisesScreenRoute:
        return MaterialPageRoute(
          builder: (_) => MultiBlocProvider(
            providers: [
              BlocProvider(
                create: (_) => getIt<ExerciseCubit>(),
              ),
              BlocProvider(
                create: (context) => getIt<ExerciseCatCubit>(),
              ),
            ],
            child: const ExercisesView(),
          ),
        );

      case kExercisesDetailsScreenRoute:
        return MaterialPageRoute(
          builder: (_) => const ExerciesDetailsView(),
        );

      case kAboutAppScreenRoute:
        return MaterialPageRoute(
          builder: (_) => BlocProvider(
            create: (context) => getIt<AboutAppCubit>(),
            child: const AboutAppView(),
          ),
        );

      case kPrivacyAndPolicyScreenRoute:
        return MaterialPageRoute(
          builder: (_) => BlocProvider(
            create: (context) => getIt<PrivacyAndPolicyCubit>(),
            child: const PrivacyAndPolicyView(),
          ),
        );
      default:
        return null;
    }
  }
}

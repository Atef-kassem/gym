import 'dart:collection';

import 'package:flutter/cupertino.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:swat_gym/core/utils/functions/setup_service_locator.dart';
import 'package:swat_gym/features/app_home/presentation/manger/ads_cubit/ads_cubit.dart';
import 'package:swat_gym/features/app_home/presentation/manger/finger_print_cubit.dart';
import 'package:swat_gym/features/app_home/presentation/views/screens/home_view.dart';
import 'package:swat_gym/features/calender/presentation/manager/cubit/calender_table_cubit.dart';
import 'package:swat_gym/features/calender/presentation/views/calender.dart';
import 'package:swat_gym/features/new_bsama_add_Fingerprint/presentation/manger/new_finger_print_cubit.dart';
import 'package:swat_gym/features/news/presentation/manager/news_cubit/news_cubit.dart';
import 'package:swat_gym/features/news/presentation/views/screens/news_view.dart';
import 'package:swat_gym/Features/notification_view/presentation/manager/my_messages_cubit.dart';
import 'package:swat_gym/Features/notification_view/presentation/notification_view.dart';
import 'package:swat_gym/features/offers/presentation/manager/news_cubit/offers_cubit.dart';
import 'package:swat_gym/features/personal_account/presentation/manager/cubit/get_profile_cubit.dart';
import 'package:swat_gym/features/personal_account/presentation/views/profile_screen.dart';
import 'package:swat_gym/features/privacy_and_policy/presentation/manager/cubit/privacy_and_policy_cubit.dart';
import 'package:swat_gym/features/privacy_and_policy/presentation/privacy_and_policy_view.dart';

import '../../../../about_app/presentation/about_app_view.dart';
import '../../../../about_app/presentation/manager/cubit/about_app_cubit.dart';
import '../../../../app_home/presentation/manger/toggle_cubit.dart';
import '../../../../personal_account/presentation/views/personal_account_screen.dart';

part 'bottom_nav_state.dart';

class BottomNavCubit extends Cubit<BottomNavState> {
  BottomNavCubit() : super(BottomNavInitial());
  int bottomNavIndex = 4;
  bool drawerIsOpen = false;
  late String? messageId;
  var details;
  var list;

  var forId;

  List<Widget> bottomNavScreens = [
    //FIVE BOTTOM NAV ITEMS
    //0
    BlocProvider(
      create: (context) => getIt<GetProfileCubit>(),
      child: const PersonalAccountScreen(),
    ),

    //1
    BlocProvider(
      create: (context) => getIt<MyMessagesCubit>(),
      child: const NotificationView(),
    ),

    //2

    BlocProvider(
      create: (context) => getIt<NewsCubit>(),
      child: const NewsView(),
    ),

    //3

    BlocProvider(
      create: (context) => getIt<AboutAppCubit>(),
      child: const AboutAppView(),
    ),
//4
    MultiBlocProvider(
      providers: [
        BlocProvider(
          create: (_) => getIt<FingerPrintCubit>(),
        ),
        BlocProvider(
          create: (context) => getIt<ToggleCubit>(),
        ),
        BlocProvider(
          create: (context) => getIt<NewFingerPrintCubit>(),
        ),
        BlocProvider(
          create: (context) => getIt<OffersCubit>(),
        ),
        BlocProvider(
          create: (context) => getIt<AdsCubit>()..getAllAdsList(),
        )
      ],
      child: const HomeView(),
    ),
//5
    BlocProvider(
      create: (context) => getIt<CalenderCubit>(),
      child: const CalenderView(),
    ),

    //6
    BlocProvider(
      create: (context) => getIt<PrivacyAndPolicyCubit>(),
      child: const PrivacyAndPolicyView(),
    ),

//7
    BlocProvider(
      create: (_) => getIt<NewsCubit>(),
      child: const NewsView(),
    ),

    //8

    BlocProvider(
      create: (context) => getIt<GetProfileCubit>(),
      child: const ProfileScreen(),
    ),
  ];

  Widget get selectedBottomNavScreen {
    // التحقق من أن bottomNavIndex في النطاق الصحيح
    if (bottomNavIndex < 0 || bottomNavIndex >= bottomNavScreens.length) {
      print('⚠️ Warning: bottomNavIndex ($bottomNavIndex) is out of range (0-${bottomNavScreens.length - 1}). Resetting to 4 (Home).');
      bottomNavIndex = 4; // Reset to Home screen
    }
    return bottomNavScreens[bottomNavIndex];
  }

  ListQueue<int> navigationQueue = ListQueue();

  void updateBottomNavIndex(int value) {
    emit(BottomNavInitial());
    // التحقق من أن القيمة في النطاق الصحيح
    if (value < 0 || value >= bottomNavScreens.length) {
      print('⚠️ Warning: Attempted to set bottomNavIndex to $value, but valid range is 0-${bottomNavScreens.length - 1}. Ignoring.');
      return; // Ignore invalid index
    }
    bottomNavIndex = value;
    emit(BottomNavIsChanging());
  }

  void changeDrawerState(bool value) {
    emit(BottomNavInitial());
    drawerIsOpen = value;
    emit(DrawerState());
  }

  void getMessageId(String value) {
    emit(BottomNavInitial());
    messageId = value;
    emit(BottomNavIsChanging());
  }

  void getDetails(var value) {
    emit(BottomNavInitial());
    details = value;
    emit(BottomNavIsChanging());
  }

  void getList(var value) {
    emit(BottomNavInitial());
    list = value;
    emit(BottomNavIsChanging());
  }

  void getForIdEmployee(var value) {
    emit(BottomNavInitial());
    forId = value;
    emit(BottomNavIsChanging());
  }
}

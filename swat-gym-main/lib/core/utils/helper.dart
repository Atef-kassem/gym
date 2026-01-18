import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:swat_gym/core/locale/app_localizations.dart';

import '../../features/bottom_nav/presentation/manger/cubit/bottom_nav_cubit.dart';
import 'constants.dart';

extension MediaQueryHelper on BuildContext {
  double get screenHeight => MediaQuery.of(this).size.height;
  double get screenWidth => MediaQuery.of(this).size.width;
  Size get screenSize => MediaQuery.of(this).size;
  AppLocalizations get locale => AppLocalizations.of(this)!;
}

extension NavigatorHelper on BuildContext {
  void push(Widget page) {
    Navigator.push(
      this,
      MaterialPageRoute(builder: (context) => page),
    );
  }
}

extension NavHelper on BuildContext {
  void pushBack() {
    BlocProvider.of<BottomNavCubit>(this).updateBottomNavIndex(kMessagesView);
  }
}

extension SnackbarHelper on BuildContext {
  void showSnackBar(String message) {
    ScaffoldMessenger.of(this).showSnackBar(
      SnackBar(
        content: Text(message),
      ),
    );
  }
}

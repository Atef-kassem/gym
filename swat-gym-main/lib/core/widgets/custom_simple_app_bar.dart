import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:swat_gym/core/utils/constants.dart';
import 'package:swat_gym/core/utils/helper.dart';
import 'package:swat_gym/features/bottom_nav/presentation/manger/cubit/bottom_nav_cubit.dart';

import '../locale/app_localizations.dart';

// ignore: must_be_immutable
class CustomSimpleAppBar extends StatelessWidget {
  CustomSimpleAppBar(
      {super.key,
      required this.appBarTitle,
      this.backHandler,
      this.leadingWidget,
      this.backgroundColor});
  Function? backHandler;
  Widget? leadingWidget;
  Color? backgroundColor;
  final String appBarTitle;

  @override
  Widget build(BuildContext context) {
    late AppLocalizations locale;
    locale = AppLocalizations.of(context)!;
    // final screenSize = MediaQuery.of(context).size;
    return AppBar(
      // systemOverlayStyle: SystemUiOverlayStyle(
      //   statusBarColor: backgroundColor ?? Colors.white,
      //   statusBarBrightness: Brightness.light,
      //   statusBarIconBrightness: Brightness.light,
      // ),

      systemOverlayStyle: SystemUiOverlayStyle(
        // Status bar color
        statusBarColor: kPrimaryColor,

        // Status bar brightness (optional)
        statusBarIconBrightness: Brightness.dark, // For Android (dark icons)
        statusBarBrightness: Brightness.light, // For iOS (dark icons)
      ),
      leadingWidth: context.screenWidth * .22,
      leading: leadingWidget,
      elevation: 0,
      automaticallyImplyLeading: false,
      centerTitle: true,
      actions: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 10),
          child: GestureDetector(
            onTap: () {
              if (backHandler == null) {
                BlocProvider.of<BottomNavCubit>(context).updateBottomNavIndex(
                    BlocProvider.of<BottomNavCubit>(context)
                        .navigationQueue
                        .last);
                BlocProvider.of<BottomNavCubit>(context)
                    .navigationQueue
                    .removeLast();
              } else {
                backHandler!();
              }
            },
            child:

                //   const Icon(Icons.arrow_forward,color: Colors.black,),
                Icon(
              locale.isEnLocale
                  ? FontAwesomeIcons.arrowRightLong
                  : FontAwesomeIcons.arrowLeftLong,
              color: Colors.black,
            ),
          ),
        ),
      ],
      backgroundColor: backgroundColor ?? Colors.white,
      title: Text(
        appBarTitle,
        style: const TextStyle(
          fontWeight: FontWeight.bold,
          color: Colors.black,
          fontSize: 15,
        ),
      ),
    );
  }
}

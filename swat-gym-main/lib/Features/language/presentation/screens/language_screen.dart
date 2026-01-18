import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
// ignore: depend_on_referenced_packages
import 'package:shared_preferences/shared_preferences.dart';

import '../../../../core/locale/app_localizations.dart';
import '../../../../core/utils/assets.dart';
import '../../../../core/utils/constants.dart';
import '../../../../core/widgets/custom_button.dart';
import '../../../../core/widgets/custom_circle_clipper.dart';
import '../../../../core/widgets/custom_elevated_container.dart';
import '../../../../Features/splash/presentation/manger/locale_cubit/locale_cubit.dart';

class LanguageScreen extends StatefulWidget {
  const LanguageScreen({super.key});

  @override
  State<LanguageScreen> createState() => _LanguageScreenState();
}

class _LanguageScreenState extends State<LanguageScreen> {
  late AppLocalizations locale;

  @override
  Widget build(BuildContext context) {
    locale = AppLocalizations.of(context)!;

    final Size screenSize = MediaQuery.of(context).size;
    return Scaffold(
      // نخلي خلفية الصفحة بيضاء افتراضياً
      backgroundColor: Colors.white,
      body: Stack(children: [
        ClipPath(
          clipper: RoundedClipper(),
          child: AnimatedContainer(
            duration: const Duration(seconds: 3),
            height: screenSize.height * .5,
            color: kPrimaryColor,
          ),
        ),
        Center(
          child: CustomElevatedContainer(
            containerHeight: screenSize.height * .6,
            containerWidth: screenSize.width * .85,
            containerChild: Column(
              children: [
                SizedBox(
                  height: screenSize.height * .07,
                ),
                // Gaps.vGap40,
                Text(
                  locale.translate('Choose_language')!,
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: kPrimaryColor,
                  ),
                ),
                SizedBox(
                  height: screenSize.height * .03,
                ),
                Directionality(
                  textDirection: TextDirection.ltr,
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: [
                      GestureDetector(
                        onTap: () {
                          BlocProvider.of<LocaleCubit>(context).toEnglish();
                        },
                        child: Card(
                          elevation: 6,
                          child: Container(
                            decoration: locale.isEnLocale
                                ? BoxDecoration(
                                    border: Border.all(
                                        color: kPrimaryColor, width: 2),
                                    borderRadius: BorderRadius.circular(5))
                                : null,
                            padding: const EdgeInsets.all(20),
                            width: screenSize.width * .32,
                            height: screenSize.height * .18,
                            child: Column(
                              children: [
                                Image.asset(
                                  AssetsData.usFlagImage,
                                  width: screenSize.width * .16,
                                  height: screenSize.height * .07,
                                ),
                                const Text(
                                  "English",
                                  style: TextStyle(fontSize: 13),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                      GestureDetector(
                        onTap: () {
                          BlocProvider.of<LocaleCubit>(context).toArabic();
                        },
                        child: Card(
                          elevation: 6,
                          child: Container(
                            decoration: !locale.isEnLocale
                                ? BoxDecoration(
                                    border: Border.all(
                                        color: kPrimaryColor, width: 2),
                                    borderRadius: BorderRadius.circular(5),
                                  )
                                : null,
                            padding: const EdgeInsets.all(20),
                            alignment: Alignment.center,
                            width: screenSize.width * .32,
                            height: screenSize.height * .18,
                            child: Column(
                              children: [
                                Image.asset(
                                  AssetsData.saudiFlagImage,
                                  width: screenSize.width * .16,
                                  height: screenSize.height * .07,
                                ),
                                const Text(
                                  "عربي",
                                  style: TextStyle(fontSize: 13),
                                )
                              ],
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                SizedBox(
                  height: screenSize.height * .05,
                ),
                Text(
                  locale.translate("language_text")!,
                ),
                SizedBox(
                  height: screenSize.height * .05,
                ),
                CustomButton(
                  buttonText: locale.translate("next")!,
                  screenWidth: screenSize.width * .5,
                  buttonTapHandler: () async {
                    SharedPreferences pref =
                        await SharedPreferences.getInstance();
                    bool? seen = pref.getBool("seen0") ?? false;
                    if (seen == true) {
                      // ignore: use_build_context_synchronously
                      Navigator.pushNamed(context, kBottomNavRoute,
                          arguments: 0);
                    } else {
                      await pref.setBool('seen0', true);
                      // ignore: use_build_context_synchronously
                      Navigator.pushNamed(context, kIntroScreen);
                    }
                  },
                ),
              ],
            ),
          ),
        )
      ]),
    );
  }
}

import 'dart:async';

import 'package:animate_do/animate_do.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
// ignore: depend_on_referenced_packages
import 'package:shared_preferences/shared_preferences.dart';
import '../../../../../core/utils/constants.dart';

class SplashViewBody extends StatefulWidget {
  const SplashViewBody({super.key});

  @override
  State<SplashViewBody> createState() => _SplashViewBodyState();
}

class _SplashViewBodyState extends State<SplashViewBody> {
  // late Timer _timer;
  Future checkFirstSeen(context) async {
    SharedPreferences pref = await SharedPreferences.getInstance();
    bool seen = (pref.getBool('seen') ?? false);
    if (seen) {
      Navigator.pushReplacementNamed(context, kHomeScreen);
      // Navigator.of(context).pushReplacement(
      //     new MaterialPageRoute(builder: (context) => new Home()));
    } else {
      await pref.setBool('seen', true);

      Future.delayed(
        const Duration(seconds: 2),
      );
      await pref.setBool('seen', true);
      // ignore: use_build_context_synchronously
      Navigator.pushNamed(context, kIntroScreen);

      // Navigator.of(context).pushReplacement(
      //     new MaterialPageRoute(builder: (context) => new IntroScreen()));
    }
  }

  @override
  void initState() {
    super.initState();
    // _timer = Timer(const Duration(seconds: 3), () {
    //   Navigator.pushReplacement(
    //     context,
    //     MaterialPageRoute(builder: (context) => const MyHomePage()),
    //   );
    // });
    Future.delayed(
      const Duration(seconds: 3),
      () {
        checkFirstSeen(context);
      },
    );
  }

  @override
  void dispose() {
    // _timer.cancel();

    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        Container(
          width: double.infinity,
          height: double.infinity,
          color: Colors.white, // خلفية بيضاء كاملة لشاشة السبلاتش داخل Flutter
        ),
        Center(
          child: Roulette(
            child: Image.asset(
              'assets/icon/icon.png', // عرض الأيقونة الجديدة بدلاً من صورة اللوجو
              width: 120.w,
            ),
          ),
        ),
      ],
    );
  }
}

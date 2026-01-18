import 'package:animate_do/animate_do.dart';
import 'widgets/splash_view_body.dart';
import 'package:flutter/material.dart';

class SplashView extends StatelessWidget {
  const SplashView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: ZoomIn(child: const SplashViewBody()),
    );
  }
}
//comment

import 'package:animate_do/animate_do.dart';
import 'package:flutter/material.dart';
import 'package:swat_gym/core/utils/constants.dart';

import 'widgets/login_view_body.dart';

class LoginView extends StatelessWidget {
  const LoginView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: kPrimaryColor,
      body: FadeInDown(child: const LoginViewBody()),
    );
  }
}

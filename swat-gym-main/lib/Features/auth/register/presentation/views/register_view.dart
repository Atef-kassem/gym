import 'package:animate_do/animate_do.dart';
import 'widgets/register_view_body.dart';
import 'package:flutter/material.dart';

class RegisterView extends StatelessWidget {
  const RegisterView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: FadeInDown(child: const SafeArea(child: RegisterViewBody())),
    );
  }
}

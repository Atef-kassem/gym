import 'package:animate_do/animate_do.dart';
import 'package:flutter/material.dart';
import 'package:swat_gym/features/auth/update_profile/presentation/views/widgets/update_profile_view_body.dart';

class UpdateProfileView extends StatelessWidget {
  const UpdateProfileView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(child: FadeInDown(child: const UpdateProfileViewBody())),
    );
  }
}

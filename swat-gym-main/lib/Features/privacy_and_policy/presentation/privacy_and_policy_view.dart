import 'package:animate_do/animate_do.dart';
import 'package:flutter/material.dart';

import 'widgets/privacy_and_policy_view_body.dart';

class PrivacyAndPolicyView extends StatelessWidget {
  const PrivacyAndPolicyView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: FadeInUp(child: const PrivacyAndPolicyViewBody()),
    );
  }
}

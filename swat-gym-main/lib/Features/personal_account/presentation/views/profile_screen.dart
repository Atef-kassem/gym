import 'package:animate_do/animate_do.dart';
import 'package:flutter/material.dart';
import 'package:swat_gym/features/personal_account/presentation/views/widgets/profile_screen_body.dart';

import '../../../../core/locale/app_localizations.dart';
import '../../../../core/widgets/custom_simple_app_bar.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    late AppLocalizations locale;
    locale = AppLocalizations.of(context)!;
    final screenSize = MediaQuery.of(context).size;

    return FadeInUp(
      duration: const Duration(milliseconds: 300),
      child: Scaffold(
        backgroundColor: Colors.white,
        appBar: PreferredSize(
          preferredSize: screenSize * .07,
          child: CustomSimpleAppBar(
            appBarTitle: locale.translate('personal_account_view')!,
            backHandler: () {
              Navigator.pop(context);
            },
          ),
        ),
        body: const ProfileScreenBody(),
      ),
    );
  }
}

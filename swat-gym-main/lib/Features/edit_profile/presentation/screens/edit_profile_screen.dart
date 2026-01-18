import 'package:animate_do/animate_do.dart';
import '../../../../core/locale/app_localizations.dart';
import '../../../../core/utils/gaps.dart';
import '../../../../core/widgets/custom_login_text_field.dart';
import 'package:flutter/material.dart';

import '../../../../core/widgets/custom_button.dart';
import '../../../../core/widgets/custom_simple_app_bar.dart';

class EditProfileScreen extends StatefulWidget {
  const EditProfileScreen({super.key});

  @override
  State<EditProfileScreen> createState() => _EditProfileScreenState();
}

class _EditProfileScreenState extends State<EditProfileScreen> {
  @override
  Widget build(BuildContext context) {
    late AppLocalizations locale;
    locale = AppLocalizations.of(context)!;
    final screenSize = MediaQuery.of(context).size;

    return FadeInDown(
      child: Scaffold(
        backgroundColor: Colors.white,
        appBar: PreferredSize(
          preferredSize: screenSize * .07,
          child: CustomSimpleAppBar(
            appBarTitle: locale.translate('modify_the_account')!,
             backHandler: () {
              Navigator.pop(context);
            },
          ),
        ),
        body: SizedBox(
          height: MediaQuery.of(context).size.height * .8,
          child: SingleChildScrollView(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 15),
              child: Column(
                children: [
                  CustomLoginTextField(
                    stringInTextField: locale.translate('name')!,
                    textInputType: TextInputType.text,
                    obscureText: false,
                  ),
                  CustomLoginTextField(
                    stringInTextField: locale.translate('phone')!,
                    textInputType: TextInputType.phone,
                    obscureText: false,
                  ),
                  CustomLoginTextField(
                    stringInTextField: locale.translate('id_number')!,
                    textInputType: TextInputType.number,
                    obscureText: false,
                  ),
                  CustomLoginTextField(
                    stringInTextField: locale.translate('email')!,
                    textInputType: TextInputType.emailAddress,
                    obscureText: false,
                  ),
                  CustomLoginTextField(
                    stringInTextField: locale.translate('password')!,
                    textInputType: TextInputType.visiblePassword,
                    obscureText: true,
                  ),
                  CustomLoginTextField(
                    stringInTextField: locale.translate('confirm_password')!,
                    textInputType: TextInputType.visiblePassword,
                    obscureText: true,
                  ),
                  Gaps.vGap40,
                  CustomButton(
                      buttonText: locale.translate('confirm')!,
                      buttonTapHandler: () {},
                      screenWidth: MediaQuery.of(context).size.width * .6),
                  Gaps.vGap40,
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

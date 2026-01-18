import 'package:flutter/material.dart';

import '../locale/app_localizations.dart';
import '../utils/constants.dart';
import '../utils/gaps.dart';
import 'custom_button.dart';

class CustomErrorWidget extends StatelessWidget {
  final String? textMessage;
  const CustomErrorWidget({super.key, this.textMessage});

  @override
  Widget build(BuildContext context) {
    late AppLocalizations locale;
    locale = AppLocalizations.of(context)!;
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          SizedBox(
            height: MediaQuery.of(context).size.height * .1,
          ),
          Image.asset(
            "assets/images/error_image.png",
            height: MediaQuery.of(context).size.height * .3,
            width: MediaQuery.of(context).size.width * .5,
          ),
          Text(
            locale.translate('sorry')!,
          ),
          Gaps.vGap5,
          Text(
            textMessage ?? locale.translate('sorry_for_having_this_error')!,
          ),
          CustomButton(
            screenWidth: MediaQuery.of(context).size.width * .5,
            buttonTapHandler: () {
              Navigator.pushReplacementNamed(context, kBottomNavRoute,
                  arguments: 0);
            },
            buttonText: locale.translate('back_to_home')!,
          ),
        ],
      ),
    );
  }
}

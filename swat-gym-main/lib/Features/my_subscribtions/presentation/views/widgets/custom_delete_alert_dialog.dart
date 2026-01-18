import 'package:flutter/material.dart';

import '../../../../../../core/locale/app_localizations.dart';
import '../../../../../../core/utils/gaps.dart';
import '../../../../../core/utils/styles2.dart';
import '../../../../../../core/widgets/custom_button.dart';

class CustomDeleteDialog extends StatelessWidget {
  const CustomDeleteDialog({super.key});
  @override
  Widget build(BuildContext context) {
    late AppLocalizations locale;
    locale = AppLocalizations.of(context)!;
    return AlertDialog(
      insetPadding: const EdgeInsets.symmetric(horizontal: 20),
      shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.all(Radius.circular(32.0))),
      contentPadding: const EdgeInsets.only(top: 10.0, right: 10),
      actionsAlignment: MainAxisAlignment.end,
      actionsOverflowDirection: VerticalDirection.up,
      alignment: Alignment.center,
      content: SizedBox(
        width: MediaQuery.of(context).size.width / 1.1,
        height: MediaQuery.of(context).size.height * .32,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            SizedBox(
              width: MediaQuery.of(context).size.height * .32,
              child: Text(
                locale.translate("delete_check")!,
                textAlign: TextAlign.center,
                style: Styles.textStyle14,
              ),
            ),
            Gaps.vGap30,
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                CustomButton(
                    onTapAvailable: true,
                    screenWidth: MediaQuery.of(context).size.width * 0.3,
                    buttonTapHandler: () {
                      Navigator.of(context).pop(true);
                    },
                    buttonText: locale.translate('confirm')!),
                CustomButton(
                    onTapAvailable: true,
                    buttonBackGroundColor: Colors.white,
                    screenWidth: MediaQuery.of(context).size.width * 0.3,
                    buttonTapHandler: () {
                      Navigator.of(context).pop(false);
                    },
                    haveBorder: true,
                    buttonText: locale.translate('cancel')!),
              ],
            )
          ],
        ),
      ),
    );
  }
}

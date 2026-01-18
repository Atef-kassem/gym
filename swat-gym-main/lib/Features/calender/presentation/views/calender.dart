import 'package:animate_do/animate_do.dart';
import 'package:swat_gym/features/calender/presentation/views/widgets/calender_body.dart';

import '../../../../core/locale/app_localizations.dart';
import '../../../../core/widgets/custom_simple_app_bar.dart';
import 'package:flutter/material.dart';

class CalenderView extends StatelessWidget {
  const CalenderView({super.key});

  @override
  Widget build(BuildContext context) {
    late AppLocalizations locale;
    locale = AppLocalizations.of(context)!;
    Size screenSize = MediaQuery.of(context).size;
    return SafeArea(
      child: Scaffold(
        backgroundColor: Colors.white,
        appBar: PreferredSize(
          preferredSize: screenSize * .07,
          child: CustomSimpleAppBar(
            appBarTitle: locale.translate('attendance_and_leaving')!,
             backHandler: () {
              Navigator.pop(context);
            },
          ),
        ),
        body: FadeIn(
          child: const CalenderViewBody(),
        ),
      ),
    );
  }
}

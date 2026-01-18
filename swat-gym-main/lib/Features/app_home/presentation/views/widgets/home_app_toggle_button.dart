import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../../../core/locale/app_localizations.dart';
import '../../../../../core/utils/constants.dart';
import '../../../../../core/utils/media_query_sizes.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:toggle_switch/toggle_switch.dart';

import '../../manger/toggle_cubit.dart';

class HomeAppToggleButton extends StatelessWidget {
  const HomeAppToggleButton({super.key});

  @override
  Widget build(BuildContext context) {
    late AppLocalizations locale;
    locale = AppLocalizations.of(context)!;
    SizeConfig().init(context);
    return ToggleSwitch(
        minWidth: SizeConfig.screenWidth! * 0.17,
        minHeight: 30.sp,
        cornerRadius: 50.0,
        borderColor: const [Colors.white],
        activeBgColors: [
          [kPrimaryColor],
          [kPrimaryColor]
        ],
        activeFgColor: Colors.white,
        inactiveBgColor: Colors.white,
        inactiveFgColor: kPrimaryColor,
        textDirectionRTL: true,
        fontSize: 10.sp,
        initialLabelIndex: 0,
        totalSwitches: 2,
        labels: [locale.translate("attendance")!, locale.translate("leave")!],
        radiusStyle: true,
        onToggle: (index) {
          final cubit = BlocProvider.of<ToggleCubit>(context);
          cubit.toggleIndex(index);
        });
  }
}

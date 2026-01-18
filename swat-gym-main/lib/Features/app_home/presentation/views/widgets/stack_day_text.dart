import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:intl/intl.dart';

import '../../../../../core/locale/app_localizations.dart';
import '../../../../../core/utils/media_query_sizes.dart';

// ignore: must_be_immutable
class StackDayText extends StatelessWidget {
  StackDayText({super.key});
  late AppLocalizations locale;

  @override
  Widget build(BuildContext context) {
    locale = AppLocalizations.of(context)!;
    SizeConfig().init(context);

    var now = DateTime.now();
    var formatterDate = DateFormat('yyyy/MM/dd');
    String formattedDate = formatterDate.format(now);

    //   // 2016-01-25

    return Padding(
      padding: EdgeInsets.only(top: SizeConfig.screenHeight! * 0.010),
      child: FittedBox(
        fit: BoxFit.fill,
        child: Text(formattedDate,
            style: TextStyle(
              color: const Color(0xffffffff),
              fontSize: 14.sp,
              fontWeight: FontWeight.w700,
              fontStyle: FontStyle.normal,
            )),
      ),
    );
  }
}

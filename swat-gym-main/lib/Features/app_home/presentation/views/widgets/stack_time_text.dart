import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:intl/intl.dart';

import '../../../../../core/locale/app_localizations.dart';

// ignore: must_be_immutable
class StackTimeText extends StatelessWidget {
  StackTimeText({super.key});
  late AppLocalizations locale;

  @override
  Widget build(BuildContext context) {
    locale = AppLocalizations.of(context)!;

    var now = DateTime.now();
    var formatterTime = DateFormat('hh:mm aa');

    String formattedTime = formatterTime.format(now);
    return FittedBox(
      fit: BoxFit.fill,
      child: Text("$formattedTime ",
          style: TextStyle(
            fontFamily: 'HacenTunisia',
            color: const Color(0xffffffff),
            fontSize: 14.sp,
            fontWeight: FontWeight.w700,
            fontStyle: FontStyle.normal,
          )),
    );
  }
}

import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import '../../../../../core/utils/constants.dart';
import '../../../../../core/utils/gaps.dart';

// ignore: must_be_immutable
class CustomSettingRow extends StatelessWidget {
  CustomSettingRow(
      {super.key,
      this.deleteAccountColor,
      required this.path,
      required this.text,
      required this.function});

  final String text;
  final String path;
  final Function function;
  late int? deleteAccountColor;
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(top: 10),
      child: InkWell(
        onTap: () {
          function();
        },
        child: Column(
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.start,
              children: [
                Image.asset(
                  path,
                  width: 20.sp,
                  height: 20.sp,
                  color: kSettingIconsColor,
                ),
                Gaps.hGap20,
                Text(
                  text,
                  style: TextStyle(
                      fontWeight: FontWeight.w300,
                      color: deleteAccountColor == null
                          ? const Color(0xff707070)
                          : Color(deleteAccountColor!),
                      fontSize: 12.sp),
                ),
              ],
            ),
            Divider(
              thickness: 1,
              color: Colors.grey[300],
            ),
          ],
        ),
      ),
    );
  }
}

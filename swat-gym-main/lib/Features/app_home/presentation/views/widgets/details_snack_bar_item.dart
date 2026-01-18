import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import '../../../../../core/utils/constants.dart';
import '../../../../../core/utils/media_query_sizes.dart';

class DetailsSnackBarItem extends StatelessWidget {
  const DetailsSnackBarItem({
    super.key,
    required this.icon,
    required this.timeText,
    required this.actionText,
    this.rotate = false,
  });
  final IconData icon;
  final String timeText;
  final String actionText;
  final bool rotate;

  @override
  Widget build(BuildContext context) {
    SizeConfig().init(context);
    return Expanded(
      child: Padding(
        padding:
            EdgeInsets.symmetric(horizontal: SizeConfig.screenWidth! * 0.010),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Transform.rotate(
              angle: rotate == true ? -math.pi : 0.0,
              child: Icon(
                icon,
                color: kPrimaryColor,
                size: 22.sp,
              ),
            ),
            FittedBox(
              fit: BoxFit.fill,
              child: Text(timeText,
                  style: TextStyle(
                    //fontFamily: 'HacenTunisia',
                    color: const Color(0xff636262),
                    fontSize: 9.sp,
                    fontWeight: FontWeight.w900,
                    fontStyle: FontStyle.normal,
                  )),
            ),
            FittedBox(
              fit: BoxFit.fill,
              child: Text(actionText,
                  style: TextStyle(
                    //  fontFamily: 'HacenTunisia',
                    color: Colors.grey,
                    fontSize: 6.5.sp,
                    fontWeight: FontWeight.w400,
                    fontStyle: FontStyle.normal,
                  )),
            )
          ],
        ),
      ),
    );
  }
}

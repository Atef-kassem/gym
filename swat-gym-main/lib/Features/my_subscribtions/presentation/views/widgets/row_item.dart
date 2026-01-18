import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:swat_gym/core/utils/constants.dart';
import 'package:swat_gym/core/utils/gaps.dart';

class IconText extends StatelessWidget {
  final String image;
  final String text;
  const IconText({super.key, required this.image, required this.text});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Image.asset(
          image,
          width: 20.sp,
          height: 20.sp,
          color: kSettingIconsColor,
        ),
        Gaps.hGap5,
        Text(
          text,
          overflow: TextOverflow.ellipsis,
          maxLines: 2,
          style: const TextStyle(fontSize: 15),
        ),
      ],
    );
  }
}

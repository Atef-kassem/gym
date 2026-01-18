import 'package:flutter/material.dart';

import '../utils/constants.dart';
import '../utils/gaps.dart';

class CustomOrdersRawIcon extends StatelessWidget {
  const CustomOrdersRawIcon(
      {super.key, required this.rawText, this.iconImagePath});
  final String rawText;
  final String? iconImagePath;
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(left: 6, right: 6, bottom: 0, top: 10),
      child: Row(
          //mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            iconImagePath != null
                ? Image.asset(
                    iconImagePath!,
                    color: kPrimaryColor,
                    width: MediaQuery.of(context).size.width * .04,
                    height: MediaQuery.of(context).size.height * .04,
                  )
                : Gaps.hGap12,
            Gaps.hGap12,
            Text(rawText,
                style: const TextStyle(
                    color: Color(0xff828282),
                    fontWeight: FontWeight.w800,
                    fontStyle: FontStyle.normal,
                    fontSize: 13.0)),
          ]),
    );
  }
}

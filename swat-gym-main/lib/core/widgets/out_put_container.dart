import 'package:flutter/material.dart';

import '../utils/constants.dart';
import '../utils/gaps.dart';

// ignore: must_be_immutable
class OutPutContainer extends StatelessWidget {
  OutPutContainer({
    super.key,
    required this.containerIconPath,
    required this.containerTitle,
    required this.containerWidth,
    required this.containerText,
  });
  double containerWidth;
  String containerText;
  String containerTitle;
  String containerIconPath;
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Gaps.hGap10,
              Image.asset(
                containerIconPath,
                color: kPrimaryColor,
                scale: 1.3,
              ),
              Gaps.hGap10,
              Text(
                containerTitle,
                style: const TextStyle(
                  color: kTextColor,
                  fontSize: 10,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ],
          ),
          Gaps.vGap5,
          Container(
            margin: const EdgeInsets.only(bottom: 10),
            padding: const EdgeInsets.only(left: 10, right: 10),
            alignment: Alignment.centerRight,
            width: containerWidth,
            height: MediaQuery.of(context).size.height * .05,
            decoration: BoxDecoration(
              color: const Color(0xfff6f6f6),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Text(
              containerText,
              style: const TextStyle(
                color: kOutPutContainerTextColor,
                overflow: TextOverflow.ellipsis,
                fontSize: 10,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

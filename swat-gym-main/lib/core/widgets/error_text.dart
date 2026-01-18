import 'package:animate_do/animate_do.dart';
import 'package:flutter/material.dart';

import '../utils/assets.dart';
import '../utils/constants.dart';
import '../utils/gaps.dart';

class ErrorText extends StatelessWidget {
  final String text;
  final bool isNetwork;
  final double? width;
  final EdgeInsetsGeometry? margin;
  final String? image;

  const ErrorText(
      {super.key,
      required this.text,
      this.isNetwork = false,
      this.width,
      this.margin,
      this.image});

  @override
  Widget build(BuildContext context) {
    return _buildContainer(context);
  }

  _buildContainer(BuildContext context) {
    return ZoomIn(
      child: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            image != null
                ? Image.asset(image!, height: 150, width: 150)
                : Image.asset(
                    AssetsData.logo,
                    height: 150,
                    width: 150,
                    color: Colors.white,
                  ),
            Gaps.vGap15,
            Text(
              text,
              textAlign: TextAlign.center,
              style: Theme.of(context).textTheme.bodyMedium!.copyWith(
                    color: kPrimaryColor,
                    fontSize: MediaQuery.of(context).size.width * .04,
                  ),
            ),
          ],
        ),
      ),
    );
  }
}

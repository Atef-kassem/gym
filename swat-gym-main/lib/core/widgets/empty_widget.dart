import 'package:animate_do/animate_do.dart';
import 'package:flutter/material.dart';

import '../utils/constants.dart';

class EmptyWidget extends StatelessWidget {
  final String text;
  final bool isNetwork;
  final double? width;
  final EdgeInsetsGeometry? margin;
  final String? image;

  const EmptyWidget(
      {super.key,
      required this.text,
      this.isNetwork = false,
      this.width,
      this.margin,
      this.image});

  @override
  Widget build(BuildContext context) {
    return isNetwork
        ? SafeArea(child: Scaffold(body: _buildContainer(context)))
        : _buildContainer(context);
  }

  _buildContainer(BuildContext context) {
    return ZoomIn(
      child: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Image.asset(
              "assets/images/empty.png",
              height: MediaQuery.of(context).size.height * .3,
              width: MediaQuery.of(context).size.width * .7,
            ),
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

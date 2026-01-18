import 'package:flutter/material.dart';

import '../utils/assets.dart';
import '../utils/constants.dart';
import '../utils/gaps.dart';

class CustomLoadingWidget extends StatelessWidget {
  const CustomLoadingWidget({super.key, this.loadingText = "جاري التحميل"});
  final String loadingText;
  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        // mainAxisAlignment: MainAxisAlignment.spaceAround,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Image.asset(
            AssetsData.logo,
            height: 150,
            width: 150,
            color: Colors.white,
          ),
          Gaps.vGap30,
          CircularProgressIndicator(
            color: kPrimaryColor,
          ),
          Gaps.vGap12,
          Text(loadingText),
        ],
      ),
    );
  }
}

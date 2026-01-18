import 'package:flutter/material.dart';

import '../utils/constants.dart';

class PageContainer extends StatelessWidget {
  final Widget child;
  const PageContainer({super.key, required this.child});

  @override
  Widget build(BuildContext context) {
    return Container(
        color: kPrimaryColor,
        child: SafeArea(
          child: GestureDetector(
            onTap: () => FocusScope.of(context).requestFocus(FocusNode()),
            child: child,
          ),
        ));
  }
}

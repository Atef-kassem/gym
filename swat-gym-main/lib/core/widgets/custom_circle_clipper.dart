import 'package:flutter/material.dart';

class RoundedClipper extends CustomClipper<Path> {
  RoundedClipper();

  @override
  Path getClip(Size size) {
    var path = Path();
    path.lineTo(0.0, 500 - 200);
    path.quadraticBezierTo(
      size.width / 2,
      500,
      size.width,
      500 - 200,
    );
    path.lineTo(size.width, 0.0);
    path.close();
    return path;
  }

  @override
  bool shouldReclip(CustomClipper<Path> oldClipper) => true;
}

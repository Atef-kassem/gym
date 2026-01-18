import 'package:flutter/material.dart';

class RoundedClipperHome extends CustomClipper<Path> {
  RoundedClipperHome();

  @override
  Path getClip(Size size) {
    var points = [
      const Offset(0, 0),
      Offset(0, size.height / 1.2), // point p3
      Offset(size.width, size.height / 1.2), // point p4
      Offset(size.width, 0), // point p2
    ];

    var path = Path()
      //..moveTo(0, 0) // move path point to (w/2,0)
      ..addPolygon(points, false)
      ..close();
    return path;
  }

  @override
  bool shouldReclip(CustomClipper<Path> oldClipper) => true;
}

import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';

class MethodItem extends StatelessWidget {
  const MethodItem(
      {super.key,
      this.isActive = false,
      required this.image,
      required this.height,
      required this.width});
  final bool isActive;
  final String image;
  final double height;
  final double width;
  @override
  Widget build(BuildContext context) {
    return AnimatedContainer(
      duration: const Duration(milliseconds: 300),
      width: width,
      height: height,
      decoration: ShapeDecoration(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
            side: BorderSide(
              color: isActive ? const Color(0xff34A853) : Colors.grey,
              width: 1.5,
            ),
          ),
          shadows: [
            BoxShadow(
              color: isActive ? const Color(0xff34A853) : Colors.white,
              blurRadius: 5,
              offset: const Offset(0, 0),
              spreadRadius: 0,
            )
          ]),
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(20),
          color: Colors.white,
        ),
        child: Center(
          child: SvgPicture.asset(
            image,
            // height: 24,
            fit: BoxFit.scaleDown,
          ),
        ),
      ),
    );
  }
}

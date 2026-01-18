import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';
import 'package:swat_gym/core/utils/hex_color.dart';

class CustomButton extends StatelessWidget {
  const CustomButton(
      {super.key, required this.label, required this.image, this.onTap});
  final String label;
  final String image;
  final void Function()? onTap;
  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
          height: 80,
          width: 80,
          padding: const EdgeInsets.all(5),
          decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(8),
              boxShadow: [
                BoxShadow(
                    color: Colors.grey.withOpacity(0.6),
                    blurRadius: 3,
                    spreadRadius: .8,
                    offset: const Offset(0, 5))
              ],
              color: HexColor("#F3EEFE")),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              SvgPicture.asset(
                height: 35,
                image,
                color: Colors.black,
              ),
              Text(
                label,
                style: const TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w700,
                  color: Colors.black,
                ),
              ),
            ],
          )),
    );
  }
}
/* ShapeDecoration(
            shadows: [
              BoxShadow(
                  color: Colors.grey.withOpacity(0.6),
                  blurRadius: 45,
                  spreadRadius: 0,
                  offset: const Offset(0, 40))
            ],
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(8),
              side: const BorderSide(
                color: Color.fromARGB(255, 132, 102, 197),
              ),
            ),
          ),*/

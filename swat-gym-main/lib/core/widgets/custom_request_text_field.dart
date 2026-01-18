import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import 'custom_elevated_container.dart';

// ignore: must_be_immutable
class CustomRequestsTextField extends StatelessWidget {
  String? initialValue;
  final String hintTextField;
  final bool obscureText;
  final TextInputType textInputType;
  final TextEditingController? controller;

  int? fieldLines;
  double? containerHeight;
  CustomRequestsTextField({
    this.initialValue,
    this.fieldLines,
    super.key,
    this.containerHeight,
    required this.hintTextField,
    this.textInputType = TextInputType.text,
    this.obscureText = false,
    this.controller,
  });

  @override
  Widget build(BuildContext context) {
    return CustomElevatedContainer(
      containerHeight:
          containerHeight ?? MediaQuery.of(context).size.height * .05,

      containerWidth: double.infinity,

      //   decoration: BoxDecoration(
      //     border: Border.all(color: const Color(0xffd8d5d5)),
      //     color: const Color(0xffffffff),
      //     borderRadius: BorderRadius.circular(12),
      //   ),
      //  // padding: const EdgeInsets.all(6),
      containerChild: TextFormField(
          controller: controller,
          textAlign: TextAlign.right,
          validator: (value) {
            if (value!.isEmpty) {
              return "please enter your $hintTextField";
            }
            return null;
          },
          obscureText: obscureText,
          keyboardType: textInputType,
          maxLines: fieldLines ?? 1,
          //    initialValue: initialValue ?? "",
          decoration: InputDecoration(
            hintText: hintTextField,

            hintStyle: TextStyle(
                color: const Color(0xff9d9d9e),
                // fontFamily: "Amiri",
                fontWeight: FontWeight.w600,
                fontSize: 10.sp),

            // label: Text(
            //   hintTextField,
            //   textAlign: TextAlign.center,
            //   style: TextStyle(
            //       color: const Color(0xff9d9d9e),
            //       // fontFamily: "Amiri",
            //       fontWeight: FontWeight.w600,
            //       fontSize: 12.sp),
            // ),
            focusedBorder: InputBorder.none,
            enabledBorder: InputBorder.none,
            disabledBorder: InputBorder.none,
            errorBorder: InputBorder.none,
            focusedErrorBorder: InputBorder.none,
            contentPadding:
                const EdgeInsets.symmetric(horizontal: 15), // space of text
            border: OutlineInputBorder(
              borderSide: const BorderSide(width: 0.5),
              borderRadius: BorderRadius.circular(12),
            ),
          )),
    );
  }
}

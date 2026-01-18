import '../locale/app_localizations.dart';
import 'hex_color.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:flutter_spinkit/flutter_spinkit.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:google_fonts/google_fonts.dart';

class Commons {
  static Widget chuckyLoader() {
    return Center(child: SpinKitFoldingCube(
      itemBuilder: (BuildContext context, int index) {
        return DecoratedBox(
          decoration: BoxDecoration(
            color: index.isEven
                ? const Color(0xFFFFFFFF)
                : const Color(0xFF311433),
          ),
        );
      },
    ));
  }

  static void showError(BuildContext context, String message) {
    showDialog(
        context: context,
        builder: (BuildContext context) => CupertinoAlertDialog(
              title: Text(
                message,
                style: TextStyle(
                    color: Colors.black,
                    fontSize: MediaQuery.of(context).orientation ==
                            Orientation.portrait
                        ? 15.sp
                        : 25.sp),
              ),
              actions: <Widget>[
                TextButton(
                    style: TextButton.styleFrom(
                        foregroundColor: Colors.black,
                        textStyle: TextStyle(
                            fontWeight: FontWeight.bold,
                            fontFamily: GoogleFonts.tajawal().fontFamily,
                            fontSize: MediaQuery.of(context).orientation ==
                                    Orientation.portrait
                                ? 17.sp
                                : 25.sp)),
                    onPressed: () => Navigator.of(context).pop(),
                    child:
                        Text(AppLocalizations.of(context)!.translate('ok')!)),
              ],
            ));
  }

  static Widget chuckyLoading(String message) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: <Widget>[
        Padding(padding: const EdgeInsets.all(10), child: Text(message)),
        chuckyLoader(),
      ],
    );
  }

  static void showToast(BuildContext context,
      {required String message, Color? color, ToastGravity? gravity}) {
    Fluttertoast.showToast(
      msg: message,
      toastLength: Toast.LENGTH_LONG,
      gravity: gravity ?? ToastGravity.BOTTOM,
      backgroundColor: Colors.red,
      // color ?? mainAppColor,
    );
  }

  static HexColor chooseColorOfChar(String char) {
    if (char.toUpperCase() == 'A') {
      return HexColor('#A28CD9');
    } else if (char.toUpperCase() == 'B') {
      return HexColor('#D9865F');
    } else if (char.toUpperCase() == 'C') {
      return HexColor('#77ACCB');
    } else if (char.toUpperCase() == 'D') {
      return HexColor('#CFB843');
    } else if (char.toUpperCase() == 'E') {
      return HexColor('#69DE71');
    } else if (char.toUpperCase() == 'F') {
      return HexColor('#A360B7');
    } else if (char.toUpperCase() == 'G') {
      return HexColor('#DEA681');
    } else if (char.toUpperCase() == 'H') {
      return HexColor('#9FECF8');
    } else if (char.toUpperCase() == 'I') {
      return HexColor('#FF8D8D');
    } else if (char.toUpperCase() == 'J') {
      return HexColor('#BB7476');
    } else if (char.toUpperCase() == 'K') {
      return HexColor('#E9698A');
    } else if (char.toUpperCase() == 'L') {
      return HexColor('#6881E5');
    } else if (char.toUpperCase() == 'M') {
      return HexColor('#EF9595');
    } else if (char.toUpperCase() == 'N') {
      return HexColor('#E699FC');
    } else if (char.toUpperCase() == 'O') {
      return HexColor('#3B62BE');
    } else if (char.toUpperCase() == 'P') {
      return HexColor('#A9D105');
    } else if (char.toUpperCase() == 'Q') {
      return HexColor('#B1AFAF');
    } else if (char.toUpperCase() == 'R') {
      return HexColor('#FBB04E');
    } else if (char.toUpperCase() == 'S') {
      return HexColor('#FE6161');
    } else if (char.toUpperCase() == 'T') {
      return HexColor('#5EF1B6');
    } else if (char.toUpperCase() == 'U') {
      return HexColor('#5EA493');
    } else if (char.toUpperCase() == 'V') {
      return HexColor('#FF5D5D');
    } else if (char.toUpperCase() == 'W') {
      return HexColor('#C2BC96');
    } else if (char.toUpperCase() == 'X') {
      return HexColor('#07EE7A');
    } else if (char.toUpperCase() == 'Y') {
      return HexColor('#E9698A');
    }
    return HexColor('#C58AA0');
  }
}

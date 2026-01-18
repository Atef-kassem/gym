import 'package:flutter/material.dart';
import 'package:swat_gym/core/utils/gaps.dart';
import '../../../../../../core/utils/assets.dart';
import '../../../../../../core/utils/media_query_sizes.dart';
import '../../../../register/presentation/views/widgets/register_form_decoration.dart';
import 'login_view_form.dart';

class LoginViewBody extends StatelessWidget {
  const LoginViewBody({super.key});

  @override
  Widget build(BuildContext context) {
    // late AppLocalizations locale;
    // locale = AppLocalizations.of(context)!;
    SizeConfig().init(context);
    return SingleChildScrollView(
      child: Stack(
        clipBehavior: Clip.none,
        children: [
          // Padding(
          //   padding: const EdgeInsets.only(top: 10.0),
          //   child: ClipPath(
          //     clipper: RoundedClipper(),
          //     child: Container(
          //       color: kPrimaryColor,
          //       height: SizeConfig.screenHeight! * 0.7,
          //     ),
          //   ),
          // ),
          Padding(
            padding: const EdgeInsets.only(top: 250, left: 30, right: 30),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Container(
                  // height: SizeConfig.screenHeight! * 0.79,
                  width: SizeConfig.screenWidth! * 0.85,
                  decoration: formDecoration(),
                  child: const Padding(
                    padding: EdgeInsets.only(top: 30),
                    child: LoginViewForm(),
                  ),
                ),
                const SizedBox(
                  height: 20,
                ),
              ],
            ),
          ),
          Center(
            child: Column(
              children: [
                Padding(
                  padding: const EdgeInsets.only(top: 60.0),
                  child: Image.asset(
                    AssetsData.logo,
                    height: 100,
                    width: 150,
                    // color: Colors.white, // سيبيه متشال/متكومنت كده
                  ),
                ),
                Gaps.vGap20,
                const Text(
                  "SWAT",
                  style: TextStyle(
                    color: Colors.white, // نخلي كلمة SWAT باللون الأبيض
                    fontSize: 20,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

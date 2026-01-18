import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:swat_gym/features/auth/login/presentation/manger/login_cubit.dart';

import '../../../../../../core/locale/app_localizations.dart';
import '../../../../../../core/utils/assets.dart';
import '../../../../../../core/utils/constants.dart';
import '../../../../../../core/utils/functions/setup_service_locator.dart';
import '../../../../../../core/utils/media_query_sizes.dart';
import '../../../../../../core/utils/styles2.dart';
import '../../../../../../core/widgets/custom_circle_clipper.dart';
import '../../../../login/presentation/views/login_view.dart';
import '../../manager/cubit/phone_auth_cubit.dart';
import 'register_form_decoration.dart';
import 'register_view_form.dart';

class RegisterViewBody extends StatelessWidget {
  const RegisterViewBody({super.key});

  @override
  Widget build(BuildContext context) {
    late AppLocalizations locale;
    locale = AppLocalizations.of(context)!;
    SizeConfig().init(context);
    return SingleChildScrollView(
      child: Stack(
        children: [
          ClipPath(
            clipper: RoundedClipper(),
            child: Container(
              color: kPrimaryColor,
              height: SizeConfig.screenHeight! * 0.5,
            ),
          ),
          Padding(
            padding: const EdgeInsets.only(top: 110),
            child: Column(
              children: [
                Center(
                  child: Container(
                    // height: SizeConfig.screenHeight! * 0.79,
                    width: SizeConfig.screenWidth! * 0.85,
                    decoration: formDecoration(),
                    child: const Padding(
                      padding: EdgeInsets.only(top: 30),
                      child: RegisterViewForm(),
                    ),
                  ),
                ),
                SizedBox(
                  height: 20.h,
                ),
                Padding(
                  padding: EdgeInsets.only(right: 40.w, left: 40.w),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.start,
                    children: [
                      Text(
                        locale.translate('already_have_an_account')!,
                        style: Styles.textStyle20
                            .copyWith(color: kPrimaryColor, fontSize: 13.sp),
                      ),
                      TextButton(
                        onPressed: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) {
                                return MultiBlocProvider(
                                  providers: [
                                    BlocProvider(
                                      create: (context) =>
                                          getIt<PhoneAuthCubit>(),
                                    ),
                                    BlocProvider(
                                      create: (context) => getIt<LoginCubit>(),
                                    ),
                                  ],
                                  child: const LoginView(),
                                );
                              },
                            ),
                          );
                        },
                        child: Text(
                          locale.translate('login')!,
                          style: Styles.textStyle20.copyWith(
                              color: kPrimaryColor,
                              decoration: TextDecoration.underline,
                              decorationThickness: 2,
                              fontSize: 13.sp),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          Center(
            child: Padding(
              padding: const EdgeInsets.only(top: 15.0),
              child: Image.asset(
                AssetsData.logo,
                height: 100,
                width: 100,
                color: Colors.white,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

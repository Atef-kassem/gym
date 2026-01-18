import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:swat_gym/features/privacy_and_policy/presentation/manager/cubit/privacy_and_policy_cubit.dart';
import 'package:swat_gym/core/widgets/custom_error_widget.dart';
import 'package:swat_gym/core/widgets/custom_loading_widget.dart';

import '../../../../core/locale/app_localizations.dart';
import '../../../../core/utils/media_query_sizes.dart';
import '../../../../core/widgets/custom_app_bar.dart';

class PrivacyAndPolicyViewBody extends StatefulWidget {
  const PrivacyAndPolicyViewBody({super.key});

  @override
  State<PrivacyAndPolicyViewBody> createState() =>
      _PrivacyAndPolicyViewBodyState();
}

class _PrivacyAndPolicyViewBodyState extends State<PrivacyAndPolicyViewBody> {
  @override
  void initState() {
    _onInit();
    super.initState();
  }

  void _onInit() async {
    BlocProvider.of<PrivacyAndPolicyCubit>(context).getPrivacyAndPolicyData();
  }

  @override
  Widget build(BuildContext context) {
    late AppLocalizations locale;
    locale = AppLocalizations.of(context)!;
    SizeConfig().init(context);
    return SingleChildScrollView(
      child: Column(
        children: [
          const CustomAppBar(
            icon: Icon(Icons.arrow_forward),
          ),
          BlocBuilder<PrivacyAndPolicyCubit, PrivacyAndPolicyState>(
            builder: (context, state) {
              if (state is PrivacyAndPolicySuccessful) {
                return Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Padding(
                          padding: EdgeInsets.only(
                              top: 13.h,
                              bottom: SizeConfig.screenHeight! * 0.05),
                          child: Text(locale.translate("privacy_policy")!,
                              textAlign: TextAlign.right),
                        ),
                      ],
                    ),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 10),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const SizedBox(
                            height: 5,
                          ),
                          SizedBox(
                            width: 600,
                            child: Text(state.data!.responseData,
                                textAlign: TextAlign.justify,
                                style: const TextStyle(
                                    fontSize: 14.0,
                                    // letterSpacing: 1.0,
                                    height:
                                        2.5 //You can set your custom height here
                                    )),
                          )
                        ],
                      ),
                    )
                  ],
                );
              } else if (state is PrivacyAndPolicyLoading) {
                return const CustomLoadingWidget();
              } else {
                return const CustomErrorWidget();
              }
            },
          )
        ],
      ),
    );
  }
}

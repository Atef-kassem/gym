import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:swat_gym/features/auth/register/presentation/manager/cubit/radio_cubit.dart';
import 'package:swat_gym/features/auth/register/presentation/views/widgets/custom_drop_down_types_list.dart';

import '../../../../../../core/locale/app_localizations.dart';
import '../../../../../../core/utils/commons.dart';
import '../../../../../../core/utils/constants.dart';
import '../../../../../../core/utils/functions/validation_mixin.dart';
import '../../../../../../core/utils/gaps.dart';
import '../../../../../../core/utils/media_query_sizes.dart';
import '../../../../../../core/widgets/custom_button.dart';
import '../../../../../../core/widgets/custom_login_text_field.dart';
import '../../manager/cubit/register_cubit.dart';

class RegisterViewForm extends StatefulWidget {
  const RegisterViewForm({super.key});

  @override
  State<RegisterViewForm> createState() => _RegisterViewFormState();
}

class _RegisterViewFormState extends State<RegisterViewForm>
    with ValidationMixin {
  late TextEditingController nameController,
      phoneController,
      passwordController,
      confirmPasswordController;

  int? radioSelected;
  String? typeId;

  @override
  void initState() {
    super.initState();

    radioSelected = 1;

    nameController = TextEditingController();
    phoneController = TextEditingController();
    confirmPasswordController = TextEditingController();
    passwordController = TextEditingController();
    typeId = null;
  }

  @override
  void dispose() {
    nameController.dispose();
    phoneController.dispose();
    passwordController.dispose();
    confirmPasswordController.dispose();

    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final GlobalKey<FormState> registerFormKey = GlobalKey<FormState>();

    late AppLocalizations locale;
    locale = AppLocalizations.of(context)!;
    SizeConfig().init(context);

    return MultiBlocListener(
      listeners: [
        BlocListener<RegisterCubit, RegisterState>(
          listener: (context, state) {
            if (state is RegisterSuccessful) {
              Navigator.pushNamed(context, kLoginScreenRoute);
              Commons.showToast(context, message: state.data.responseMessage);
            } else if (state is RegisterFailed) {
              Commons.showToast(context, message: state.failMessage);
            }
          },
        )
      ],
      child: Column(
        children: [
          Text(
            locale.translate('create_account')!,
            style: TextStyle(
                color: kPrimaryColor,
                fontSize: 17.sp,
                fontWeight: FontWeight.w700),
          ),
          Gaps.vGap10,
          Form(
            key: registerFormKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                CustomDropDownTypesList(
                    initValue: typeId,
                    onTap: (value) {
                      typeId = value.toString();
                    },
                    hintText: "اختر الفرع"),
                CustomLoginTextField(
                    validator: validateNameText,
                    controller: nameController,
                    imagePath: "assets/icon/person_icon.png",
                    textInputType: TextInputType.text,
                    obscureText: false,
                    stringInTextField: locale.translate('name')!),
                CustomLoginTextField(
                    validator: validatePhoneNumber,
                    controller: phoneController,
                    imagePath: "assets/icon/mobile_icon.png",
                    textInputType: TextInputType.number,
                    obscureText: false,
                    stringInTextField: locale.translate('phone')!),

                CustomLoginTextField(
                    validator: validateNewPassword,
                    controller: passwordController,
                    imagePath: "assets/icon/lock_icon.png",
                    textInputType: TextInputType.text,
                    obscureText: true,
                    stringInTextField: locale.translate('password')!),
                CustomLoginTextField(
                    validator: validateConfirmPassword,
                    controller: confirmPasswordController,
                    imagePath: "assets/icon/lock_icon.png",
                    textInputType: TextInputType.text,
                    obscureText: true,
                    stringInTextField: locale.translate('confirm_password')!),
                BlocBuilder<RadioCubit, int>(
                  builder: (context, state) {
                    return Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Text('Male'),
                        Radio(
                          value: 1,
                          groupValue: state,
                          activeColor: Colors.blue,
                          onChanged: (value) {
                            context
                                .read<RadioCubit>()
                                .selectRadio(value as int);

                            debugPrint("Selected Value: $value");
                          },
                        ),
                        const Text('Female'),
                        Radio(
                          value: 2,
                          groupValue: state,
                          activeColor: Colors.pink,
                          onChanged: (value) {
                            context
                                .read<RadioCubit>()
                                .selectRadio(value as int);
                            debugPrint("Selected Value: $value");
                          },
                        )
                      ],
                    );
                  },
                ),
                // Padding(
                //   padding: const EdgeInsets.symmetric(horizontal: 30.0),
                //   child: Text(
                //     locale.translate('the_kind')!,
                //     style: Styles.textStyle20.copyWith(
                //         fontWeight: FontWeight.w700,
                //         fontSize: 15,
                //         color: kTextColor),
                //   ),
                // ),
                //const GenderSelection(),
              ],
            ),
          ),
          Gaps.vGap10,
          BlocBuilder<RegisterCubit, RegisterState>(
            builder: (context, state) {
              return state is RegisterLoading
                  ? CircularProgressIndicator(
                      color: kPrimaryColor,
                    )
                  : CustomButton(
                      onTapAvailable: true,
                      buttonText: locale.translate('create_account')!,
                      buttonTapHandler: () {
                        if (registerFormKey.currentState!.validate()) {
                          BlocProvider.of<RegisterCubit>(context).registerUser(
                              nameController.text,
                              typeId!,
                              context.read<RadioCubit>().state == 1 ? 'M' : 'F',
                              phoneController.text,
                              passwordController.text,
                              confirmPasswordController.text);
                        }
                        if (state is RegisterSuccessful) {
                          Commons.showToast(
                            context,
                            message: state.data.responseMessage,
                          );
                        }
                      },
                      screenWidth: 190.0,
                    );
            },
          ),
          Gaps.vGap20,
        ],
      ),
    );
  }
}

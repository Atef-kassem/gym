import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:hive/hive.dart';

import '../../../../../../core/locale/app_localizations.dart';
import '../../../../../../core/utils/commons.dart';
import '../../../../../../core/utils/constants.dart';
import '../../../../../../core/utils/functions/validation_mixin.dart';
import '../../../../../../core/widgets/custom_button.dart';
import '../../../../../../core/widgets/custom_login_text_field.dart';
import '../../../../login/domain/entities/employee_entity.dart';
import '../../manager/cubit/change_password_cubit.dart';

class ChangePasswordForm extends StatefulWidget {
  const ChangePasswordForm({super.key});

  @override
  State<ChangePasswordForm> createState() => _ChangePasswordFormState();
}

class _ChangePasswordFormState extends State<ChangePasswordForm>
    with ValidationMixin {
  @override
  Widget build(BuildContext context) {
    //final currentPasswordController = TextEditingController();
    final newPasswordController = TextEditingController();
    final confirmNewPasswordController = TextEditingController();

    final GlobalKey<FormState> formKey = GlobalKey<FormState>();

    late AppLocalizations locale;
    locale = AppLocalizations.of(context)!;
    return BlocListener<ChangePasswordCubit, ChangePasswordState>(
      listener: (context, state) {
        if (state is ChangePasswordSuccessful) {
          Commons.showToast(context, message: "تم تغيير كلمة المرور بنجاح");
          Navigator.pop(context);
        } else if (state is ChangePasswordFailed) {
          Commons.showToast(context, message: state.failMessage);
        }
      },
      child: Column(
        //  mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(
            locale.translate("change_password")!,
            style: TextStyle(color: kPrimaryColor),
          ),
          SizedBox(
            height: MediaQuery.of(context).size.height * .05,
          ),
          Form(
            key: formKey,
            child: Column(
              children: [
                // CustomLoginTextField(
                //   validator: validateCurrentPassword,
                //   controller: currentPasswordController,
                //   imagePath: "assets/icon/lock_icon.png",
                //   stringInTextField: locale.translate("current_password")!,
                //   textInputType: TextInputType.text,
                //   obscureText: true,
                // ),
                CustomLoginTextField(
                  validator: validateNewPassword,
                  controller: newPasswordController,
                  imagePath: "assets/icon/lock_icon.png",
                  stringInTextField: locale.translate("new_password")!,
                  textInputType: TextInputType.text,
                  obscureText: true,
                ),
                CustomLoginTextField(
                  controller: confirmNewPasswordController,
                  validator: validateConfirmPassword,
                  imagePath: "assets/icon/lock_icon.png",
                  stringInTextField: locale.translate("confirm_new_password")!,
                  textInputType: TextInputType.text,
                  obscureText: true,
                ),
              ],
            ),
          ),
          SizedBox(
            height: MediaQuery.of(context).size.height * .03,
          ),
          BlocBuilder<ChangePasswordCubit, ChangePasswordState>(
            builder: (context, state) {
              return state is ChangePasswordLoading
                  ? CircularProgressIndicator(
                      color: kPrimaryColor,
                    )
                  : CustomButton(
                      screenWidth: MediaQuery.of(context).size.width * .45,
                      buttonTapHandler: () async {
                        if (formKey.currentState!.validate()) {
                          if (confirmNewPasswordController.text ==
                              newPasswordController.text) {
                            var box =
                                Hive.box<EmployeeEntity>(kEmployeeDataBox);
                            BlocProvider.of<ChangePasswordCubit>(context)
                                .changePassword(
                                    box.get(kEmployeeDataBox) != null
                                        ? box.get(kEmployeeDataBox)!.memId.toString()
                                        : "",
                                    confirmNewPasswordController.text,
                                    newPasswordController.text);
                          } else {
                            Commons.showToast(context,
                                message: locale
                                    .translate("Password_not_identical")!);
                          }
                        }
                      },
                      buttonText: locale.translate("confirm")!);
            },
          )
        ],
      ),
    );
  }
}

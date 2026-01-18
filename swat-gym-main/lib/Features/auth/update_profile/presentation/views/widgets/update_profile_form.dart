import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:swat_gym/features/auth/login/domain/entities/employee_entity.dart';
import 'package:swat_gym/features/auth/update_profile/presentation/manager/cubit%20copy/select_file_cubit.dart';
import 'package:hive/hive.dart';
import 'package:swat_gym/core/widgets/custom_elevated_container.dart';

import '../../../../../../core/locale/app_localizations.dart';
import '../../../../../../core/utils/commons.dart';
import '../../../../../../core/utils/constants.dart';
import '../../../../../../core/utils/functions/validation_mixin.dart';
import '../../../../../../core/widgets/custom_button.dart';
import '../../manager/cubit/update_profile_cubit.dart';

class UpdateProfileForm extends StatefulWidget {
  const UpdateProfileForm({super.key});

  @override
  State<UpdateProfileForm> createState() => _UpdateProfileFormState();
}

class _UpdateProfileFormState extends State<UpdateProfileForm>
    with ValidationMixin {
  @override
  Widget build(BuildContext context) {
    //final currentPasswordController = TextEditingController();

    File? selectedFile;

    late AppLocalizations locale;
    locale = AppLocalizations.of(context)!;
    return BlocListener<UpdateProfileCubit, UpdateProfileState>(
      listener: (context, state) {
        if (state is UpdateProfileSuccessful) {
          var box = Hive.box<EmployeeEntity>(kEmployeeDataBox);
          box.put(kEmployeeDataBox, state.data);
          Commons.showToast(context, message: "تم تغيير الصورة بنجاح");
          Navigator.pop(context);
        } else if (state is UpdateProfileFailed) {
          Commons.showToast(context, message: state.failMessage);
        }
      },
      child: Column(
        //  mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(
            "تغيير صورة الملف الشخصي",
            style: TextStyle(color: kPrimaryColor),
          ),
          SizedBox(
            height: MediaQuery.of(context).size.height * .05,
          ),
          GestureDetector(
            onTap: () async {
              await BlocProvider.of<SelectFileCubit>(context)
                  .pickFileFromDevice();
            },
            child: CustomElevatedContainer(
              containerHeight: MediaQuery.of(context).size.height * .3,
              containerWidth: MediaQuery.of(context).size.width,
              containerChild: BlocBuilder<SelectFileCubit, SelectFileState>(
                builder: (context, state) {
                  if (state is PickFileState) {
                    selectedFile = state.filePath;

                    return Center(
                      child: Text(state.fileName),
                    );
                  } else if (state is PickImageState) {
                    selectedFile = state.imagePath;
                    return Image.file(
                      state.imagePath,
                      fit: BoxFit.fill,
                      width: MediaQuery.of(context).size.width / 1.5,
                      height: double.infinity,
                    );
                  } else {
                    return Image.asset(
                      "assets/images/upload_cloud.png",
                      alignment: Alignment.center,
                      width: 50,
                      height: 50,
                      //  MediaQuery.of(context).size.width * 1
                    );
                  }
                },
              ),
            ),
          ),
          SizedBox(
            height: MediaQuery.of(context).size.height * .03,
          ),
          BlocBuilder<UpdateProfileCubit, UpdateProfileState>(
            builder: (context, state) {
              return state is UpdateProfileLoading
                  ? CircularProgressIndicator(
                      color: kPrimaryColor,
                    )
                  : CustomButton(
                      screenWidth: MediaQuery.of(context).size.width * .45,
                      buttonTapHandler: () async {
                        if (selectedFile != null) {
                          var box = Hive.box<EmployeeEntity>(kEmployeeDataBox);
                          BlocProvider.of<UpdateProfileCubit>(context)
                              .updateProfile(
                            box.get(kEmployeeDataBox) != null
                                ? box.get(kEmployeeDataBox)!.memId!.toString()
                                : "",
                            selectedFile,
                          );
                        } else {
                          Commons.showToast(context,
                              message: "اختر صورة اولا ");
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

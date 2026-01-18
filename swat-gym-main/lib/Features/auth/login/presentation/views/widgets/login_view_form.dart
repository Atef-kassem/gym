import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:hive/hive.dart';
import 'package:path_provider/path_provider.dart';

import '../../../../../../core/locale/app_localizations.dart';
import '../../../../../../core/utils/commons.dart';
import '../../../../../../core/utils/constants.dart';
import '../../../../../../core/utils/hive_helper.dart';
import '../../../../../../core/utils/functions/validation_mixin.dart';
import '../../../../../../core/utils/network/interceptors.dart';
import '../../../../../../core/widgets/custom_button.dart';
import '../../../../../../core/widgets/custom_login_text_field.dart';
import '../../../domain/entities/employee_entity.dart';
import '../../manger/login_cubit.dart';

class LoginViewForm extends StatefulWidget {
  const LoginViewForm({super.key});

  @override
  State<LoginViewForm> createState() => _LoginViewFormState();
}

class _LoginViewFormState extends State<LoginViewForm> with ValidationMixin {
  Future<String> _getLocalFilePath(String filename) async {
    final directory = await getApplicationDocumentsDirectory();
    return '${directory.path}/$filename';
  }

  Future<void> _downloadAndSaveImage(String url, String savePath) async {
    try {
      final dio = Dio();
      await dio.download(url, savePath);
    } catch (e) {
      print('Download failed: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    final phoneController = TextEditingController();
    final passwordController = TextEditingController();

    final GlobalKey<FormState> formKey = GlobalKey<FormState>();

    late AppLocalizations locale;
    locale = AppLocalizations.of(context)!;

    return BlocListener<LoginCubit, LoginState>(
      listener: (context, state) async {
        if (state is LoginSuccessful) {
          // استخدام الـ helper function الآمنة للوصول إلى الـ box
          final box = HiveHelper.getEmployeeBox();
          if (box != null) {
            box.put(kEmployeeDataBox, state.user.data);
          }
          final imageUrl = state.user.data.barcodePath;
          
          // التأكد من فتح local_storage box بشكل آمن
          if (!Hive.isBoxOpen('local_storage')) {
            await Hive.openBox('local_storage');
          }
          
          // حفظ token إذا كان موجوداً
          try {
            final pendingToken = AdapterInterceptor.getPendingToken();
            if (pendingToken != null && pendingToken.isNotEmpty) {
              // التأكد من فتح auth box
              if (!Hive.isBoxOpen('auth')) {
                await Hive.openBox('auth');
              }
              final authBox = Hive.box('auth');
              await authBox.put('token', pendingToken);
              print('Token saved after login: ${pendingToken.substring(0, 20)}...');
            }
          } catch (e) {
            print('Error saving token after login: $e');
          }

          if (imageUrl != null && imageUrl.isNotEmpty) {
            final filePath = await _getLocalFilePath('barcode.png');
            await _downloadAndSaveImage(imageUrl, filePath);
            final localStorageBox = HiveHelper.getBox('local_storage');
            if (localStorageBox != null) {
              await localStorageBox.put('barcode_path', filePath);
            }
          }
          Navigator.pushReplacementNamed(context, kBottomNavRoute,
              arguments: 0);
          Commons.showToast(context, message: "تم التسجيل بنجاح");
        } else if (state is LoginFailed) {
          Commons.showToast(context, message: state.message);
        }
      },
      child: Column(
        children: [
          Text(
            locale.translate("login")!,
            style: TextStyle(
                color: Colors.black, // عنوان "تسجيل الدخول" يصبح أسمر
                fontSize: 17.sp,
                fontWeight: FontWeight.w700),
          ),
          const SizedBox(
            height: 25,
          ),
          Form(
            key: formKey,
            child: Padding(
              padding: const EdgeInsets.only(right: 0.0, left: 0),
              child: Column(
                children: [
                  CustomLoginTextField(
                    key: const Key('phone'),
                    imagePath: "assets/icon/card.png",
                    controller: phoneController,
                    stringInTextField: locale.translate('id_number')!,
                    obscureText: false,
                    textInputType: TextInputType.number,
                    validator: validateUserPhone,
                  ),
                  CustomLoginTextField(
                    key: const Key('password'),
                    imagePath: "assets/icon/lock_icon.png",
                    controller: passwordController,
                    stringInTextField: locale.translate('password')!,
                    obscureText: true,
                    textInputType: TextInputType.text,
                    validator: validatePassWord,
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(
            height: 25,
          ),
          BlocBuilder<LoginCubit, LoginState>(
            builder: (context, state) {
              return state is LoginLoading
                  ? CircularProgressIndicator(
                      color: kPrimaryColor,
                    )
                  : CustomButton(
                      onTapAvailable: true,
                      buttonText: locale.translate('login')!,
                      textColor: Colors.white, // نص زرار تسجيل الدخول أبيض
                      buttonTapHandler: () async {
                        if (formKey.currentState!.validate()) {
                          BlocProvider.of<LoginCubit>(context).getUserData(
                              phoneController.text, passwordController.text);
                        }
                      },
                      screenWidth: MediaQuery.of(context).size.width * .50,
                    );
            },
          ),
          Padding(
            padding: const EdgeInsets.only(
              left: 20.0,
              // top: 20,
              bottom: 10,
              right: 20,
            ),
            child: Align(
              alignment: locale.isEnLocale
                  ? Alignment.bottomLeft
                  : Alignment.bottomRight,
              child: TextButton(
                child: Text(
                  locale.translate('don’t_have_account?')!,
                  style: const TextStyle(
                    fontSize: 12,
                    color: Colors.black, // "هل لديك حساب؟" بالأسمر
                    fontWeight: FontWeight.w700,
                  ),
                ),
                onPressed: () {
                  Navigator.pushNamed(context, kRegisterScreen);
                },
              ),
            ),
          ),
        ],
      ),
    );
  }
}

import 'package:animate_do/animate_do.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:swat_gym/core/utils/commons.dart';
import 'package:swat_gym/core/utils/functions/registration_alert.dart';
import 'package:swat_gym/features/contact_us/presentation/manager/add_subscribtions_cubit/send_invitation_cubit.dart';

import '../../../../../core/locale/app_localizations.dart';
import '../../../../../core/utils/gaps.dart';
import '../../../../../core/widgets/custom_button.dart';
import '../../../../../core/widgets/custom_login_text_field.dart';
import '../../../../../core/widgets/custom_simple_app_bar.dart';

class SendInvitationScreen extends StatefulWidget {
  const SendInvitationScreen({super.key});

  @override
  State<SendInvitationScreen> createState() => _SendInvitationScreenState();
}

class _SendInvitationScreenState extends State<SendInvitationScreen> {
  late TextEditingController nameController;
  late TextEditingController phoneController;

  @override
  void initState() {
    super.initState();
    nameController = TextEditingController();
    phoneController = TextEditingController();
  }

  @override
  void dispose() {
    nameController.dispose();
    phoneController.dispose();

    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    late AppLocalizations locale;
    locale = AppLocalizations.of(context)!;
    final screenSize = MediaQuery.of(context).size;

    return FadeInUp(
      child: Scaffold(
        backgroundColor: Colors.white,
        appBar: PreferredSize(
          preferredSize: screenSize * .07,
          child: CustomSimpleAppBar(
            appBarTitle: "ارسال دعوة",
            backHandler: () {
              Navigator.pop(context);
            },
          ),
        ),
        body: BlocListener<SendInvitationCubit, SendInvitationState>(
          listener: (context, state) {
            if (state is SendInvitationSuccessful) {
              AlertDialog alert = alertRegistration(context, state.message, () {
                Navigator.pop(context);
                Navigator.pop(context);
              }, "assets/images/intro1.png");

              // show the dialog
              showDialog(
                context: context,
                builder: (BuildContext context) {
                  return alert;
                },
              );
            } else if (state is SendInvitationFailed) {
              AlertDialog alert = alertRegistration(context, state.message, () {
                Navigator.pop(context);
              }, "assets/images/intro1.png");

              // show the dialog
              showDialog(
                context: context,
                builder: (BuildContext context) {
                  return alert;
                },
              );
            }
          },
          child: Padding(
            padding: const EdgeInsets.only(bottom: 50.0),
            child: Column(
              children: [
                Image.asset(
                  width: MediaQuery.of(context).size.width,
                  height: MediaQuery.of(context).size.height * .3,
                  'assets/images/icon_messages2.png',
                ),
                CustomLoginTextField(
                  controller: nameController,
                  stringInTextField: locale.translate('name')!,
                  textInputType: TextInputType.text,
                  obscureText: false,
                ),
                CustomLoginTextField(
                  controller: phoneController,
                  stringInTextField: locale.translate('phone')!,
                  textInputType: TextInputType.number,
                  obscureText: false,
                ),
                Gaps.vGap16,
                BlocBuilder<SendInvitationCubit, SendInvitationState>(
                  builder: (context, state) {
                    return state is SendInvitationLoading
                        ? const CircularProgressIndicator()
                        : CustomButton(
                            buttonText: "ارسال",
                            buttonTapHandler: () {
                              if (nameController.text == "" &&
                                  phoneController.text == "") {
                                Commons.showToast(context,
                                    message: "ادخل البيانات اولا");
                              } else {
                                BlocProvider.of<SendInvitationCubit>(context)
                                    .sendInvitation(phoneController.text,
                                        nameController.text);
                              }
                            },
                            screenWidth: MediaQuery.of(context).size.width * .6,
                          );
                  },
                ),
                Gaps.vGap40,
              ],
            ),
          ),
        ),
      ),
    );
  }
}

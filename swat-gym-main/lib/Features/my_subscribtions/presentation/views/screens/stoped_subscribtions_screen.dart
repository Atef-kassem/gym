import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:swat_gym/core/locale/app_localizations.dart';
import 'package:swat_gym/core/utils/commons.dart';
import 'package:swat_gym/core/utils/functions/registration_alert.dart';
import 'package:swat_gym/core/utils/gaps.dart';
import 'package:swat_gym/core/widgets/custom_app_bar.dart';
import 'package:swat_gym/core/widgets/custom_button.dart';
import 'package:swat_gym/core/widgets/custom_orders_raw_icon.dart';
import 'package:swat_gym/core/widgets/custom_request_text_field.dart';
import 'package:swat_gym/features/my_subscribtions/domain/entities/my_subscribtions_entity.dart';
import 'package:swat_gym/features/my_subscribtions/presentation/manager/stoped_subscribtions_cubit/stoped_subscribtions_cubit.dart';
import 'package:swat_gym/features/subscribtions/presentation/manager/pick_cubit/pick_date_cubit.dart';
import 'package:swat_gym/features/subscribtions/presentation/views/widgets/custom_date_picker.dart';

class StopedSubscribtionsScreen extends StatefulWidget {
  final MySubscribtionsEntity exerciseEntity;
  const StopedSubscribtionsScreen({super.key, required this.exerciseEntity});

  @override
  State<StopedSubscribtionsScreen> createState() =>
      _StopedSubscribtionsScreenState();
}

class _StopedSubscribtionsScreenState extends State<StopedSubscribtionsScreen> {
  late TextEditingController reasonController;

  late TextEditingController numDaysController;

  @override
  void initState() {
    super.initState();
    reasonController = TextEditingController();
    numDaysController = TextEditingController();
    BlocProvider.of<PickDateCubit>(context).to = null;
    BlocProvider.of<PickDateCubit>(context).from = null;
  }

  @override
  void dispose() {
    reasonController.dispose();
    numDaysController.dispose();

    BlocProvider.of<StopedSubscribtionsCubit>(context).close();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final screenSize = MediaQuery.of(context).size;

    // final reasonController = TextEditingController();

    late AppLocalizations locale;
    locale = AppLocalizations.of(context)!;

    //  double todouble(TimeOfDay mytime) => mytime.hour + mytime.minute / 60.0;
    return Scaffold(
      appBar: PreferredSize(
          preferredSize: screenSize * .1, child: const CustomAppBar()),
      backgroundColor: Colors.white,
      body: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        child: Padding(
          padding: const EdgeInsets.only(right: 20.0, left: 20.0, bottom: 30),
          child:
              BlocListener<StopedSubscribtionsCubit, StopedSubscribtionsState>(
            listener: (context, state) {
              if (state is StopedSubscribtionsSuccessful) {
                AlertDialog alert =
                    alertRegistration(context, state.message, () {
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
              } else if (state is StopedSubscribtionsFailed) {
                AlertDialog alert =
                    alertRegistration(context, state.message, () {
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
            child: Column(children: [
              const Text(
                "طلب وقف اشتراك",
                style: TextStyle(
                  color: Color(0xff000000),
                  fontSize: 20,
                ),
              ),
              Gaps.vGap20,
              BlocBuilder<PickDateCubit, RequestPickDateState>(
                builder: (context, state) {
                  return Column(
                    children: [
                      const CustomOrdersRawIcon(
                          rawText: "تاريخ بدايه الوقف",
                          iconImagePath: "assets/icon/time_icon.png"),
                      CustomDatePicker(
                          onTap: () {
                            BlocProvider.of<PickDateCubit>(context)
                                .pickDate(context, "from");
                          },
                          //containerWidth: MediaQuery.of(context).size.width / 1.2,
                          customDatePickerText: BlocProvider.of<PickDateCubit>(
                                          context)
                                      .from !=
                                  null
                              ? "${locale.translate("from_date")!}  ${BlocProvider.of<PickDateCubit>(context).from!}"
                              : locale.translate("from_date")!),
                      SizedBox(
                        width: screenSize.width * .27,
                      ),
                    ],
                  );
                },
              ),
              const CustomOrdersRawIcon(
                rawText: "عدد ايام الوقف",
                iconImagePath: "assets/icon/notes_icon.png",
              ),
              SizedBox(
                height: MediaQuery.of(context).size.height * .1,
                child: CustomRequestsTextField(
                  controller: numDaysController,
                  hintTextField: "عدد ايام الوقف",
                ),
              ),
              CustomOrdersRawIcon(
                rawText: locale.translate('the_reason')!,
                iconImagePath: "assets/icon/notes_icon.png",
              ),
              SizedBox(
                height: MediaQuery.of(context).size.height * .1,
                child: CustomRequestsTextField(
                  controller: reasonController,
                  hintTextField: locale.translate('the_reason')!,
                ),
              ),
              Gaps.vGap15,
              BlocBuilder<StopedSubscribtionsCubit, StopedSubscribtionsState>(
                builder: (context, state) {
                  return state is StopedSubscribtionsLoading
                      ? const CircularProgressIndicator()
                      : CustomButton(
                          screenWidth: MediaQuery.of(context).size.width * .7,
                          buttonTapHandler: () {
                            if (BlocProvider.of<PickDateCubit>(context).from !=
                                    null &&
                                numDaysController.text.isNotEmpty &&
                                reasonController.text.isNotEmpty) {
                              if (BlocProvider.of<PickDateCubit>(context)
                                  .valueFrom!
                                  .isBefore(DateTime.now())) {
                                Commons.showToast(context,
                                    message:
                                        "يجب اختيار تاريخ بعد تاريخ اليوم");
                              } else {
                                BlocProvider.of<StopedSubscribtionsCubit>(
                                        context)
                                    .stopedSubscribtions(
                                        BlocProvider.of<PickDateCubit>(context)
                                            .from!,
                                        widget.exerciseEntity.subsId,
                                        reasonController.text,
                                        numDaysController.text,
                                        widget
                                            .exerciseEntity.subscriptionTypeFk);
                              }
                            } else {
                              Commons.showToast(context,
                                  message:
                                      "يجب اختيار تاريخ واستكمال البيانات اولا ");
                            }
                          },
                          buttonText: "ارسال");
                },
              ),
            ]),
            // CustomOrdersRawIcon(
            //     rawText: locale.translate('Period')!,
            //     iconImagePath: "assets/icon/vacation_icon.png"),
            // CustomDropDownList(
            //   hintText: locale.translate('Period')!,
            // ),
          ),
        ),
      ),
    );
  }
}

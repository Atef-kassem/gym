import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:swat_gym/core/locale/app_localizations.dart';
import 'package:swat_gym/core/utils/commons.dart';
import 'package:swat_gym/core/utils/functions/registration_alert.dart';
import 'package:swat_gym/core/utils/gaps.dart';
import 'package:swat_gym/core/widgets/custom_button.dart';
import 'package:swat_gym/core/widgets/custom_orders_raw_icon.dart';
import 'package:swat_gym/core/widgets/custom_simple_app_bar.dart';
import 'package:swat_gym/features/subscribtions/domain/entities/subscribtions_entity.dart';
import 'package:swat_gym/features/subscribtions/presentation/manager/add_subscribtions_cubit/add_subscribtions_cubit.dart';
import 'package:swat_gym/features/subscribtions/presentation/manager/pick_cubit/pick_date_cubit.dart';
import 'package:swat_gym/features/subscribtions/presentation/views/widgets/custom_date_picker.dart';

class AddSubscribtionsScreen extends StatefulWidget {
  final SubscribtionsEntity exerciseEntity;
  const AddSubscribtionsScreen({super.key, required this.exerciseEntity});

  @override
  State<AddSubscribtionsScreen> createState() => _AddSubscribtionsScreenState();
}

class _AddSubscribtionsScreenState extends State<AddSubscribtionsScreen> {
  late TextEditingController reasonController;

  @override
  void initState() {
    super.initState();
    reasonController = TextEditingController();
  }

  @override
  void dispose() {
    reasonController.dispose();

    // BlocProvider.of<AddSubscribtionsCubit>(context).close();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    BlocProvider.of<PickDateCubit>(context).to = null;
    BlocProvider.of<PickDateCubit>(context).from = null;
    final screenSize = MediaQuery.of(context).size;

    // final reasonController = TextEditingController();

    late AppLocalizations locale;
    locale = AppLocalizations.of(context)!;

    //  double todouble(TimeOfDay mytime) => mytime.hour + mytime.minute / 60.0;
    return Scaffold(
      appBar: PreferredSize(
          preferredSize: screenSize * .1,
          child: CustomSimpleAppBar(
              appBarTitle: "طلب اشتراك", backHandler: () {})),
      backgroundColor: Colors.white,
      body: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        child: Padding(
          padding: const EdgeInsets.only(right: 20.0, left: 20.0, bottom: 30),
          child: BlocListener<AddSubscribtionsCubit, AddSubscribtionsState>(
            listener: (context, state) {
              if (state is AddSubscribtionsSuccessful) {
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
              } else if (state is AddSubscribtionsFailed) {
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
                "طلب اشتراك",
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
                          rawText: "تاريخ بدايه لاشتراك",
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
              Gaps.vGap15,
              BlocBuilder<AddSubscribtionsCubit, AddSubscribtionsState>(
                builder: (context, state) {
                  return state is AddSubscribtionsLoading
                      ? const CircularProgressIndicator()
                      : CustomButton(
                          screenWidth: MediaQuery.of(context).size.width * .7,
                          buttonTapHandler: () {
                            if (BlocProvider.of<PickDateCubit>(context).from !=
                                null) {
                              if (BlocProvider.of<PickDateCubit>(context)
                                  .valueFrom!
                                  .isBefore(DateTime.now())) {
                                Commons.showToast(context,
                                    message:
                                        "يجب اختيار تاريخ بعد تاريخ اليوم");
                              } else {
                                BlocProvider.of<AddSubscribtionsCubit>(context)
                                    .addSubscribtions(
                                        BlocProvider.of<PickDateCubit>(context)
                                            .from!,
                                        widget.exerciseEntity.typeId);
                              }
                            } else {
                              Commons.showToast(context,
                                  message: "يجب اختيار تاريخ البدء ");
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

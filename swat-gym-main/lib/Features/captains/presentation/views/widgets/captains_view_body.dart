import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:swat_gym/core/widgets/empty_widget.dart';
import 'package:swat_gym/features/captains/data/models/captains.dart';
import 'package:swat_gym/features/captains/presentation/manager/news_cubit/captains_cubit.dart';
import 'package:hive/hive.dart';

import '../../../../../../core/locale/app_localizations.dart';
import '../../../../../../core/utils/constants.dart';
import '../../../../../../core/widgets/custom_loading_widget.dart';
import '../../../../../../core/widgets/error_text.dart';
import '../../../../auth/login/domain/entities/employee_entity.dart';
import '../../../../bottom_nav/presentation/manger/cubit/bottom_nav_cubit.dart';
import 'trainer_card.dart';

// ignore: must_be_immutable
class CaptainsViewBody extends StatefulWidget {
  const CaptainsViewBody({super.key});

  @override
  State<CaptainsViewBody> createState() => _CaptainsViewBodyState();
}

class _CaptainsViewBodyState extends State<CaptainsViewBody> {
  var box = Hive.box<EmployeeEntity>(kEmployeeDataBox);

  @override
  Widget build(BuildContext context) {
    //  getAllMessages(context);

    return Padding(
      padding: const EdgeInsets.only(left: 10, right: 10),
      child: SingleChildScrollView(
        child: BlocBuilder<CaptainsCubit, CaptainsState>(
          builder: (context, state) {
            if (state is FetchSuccessful) {
              AllCaptainsList captainsList = state.data;

              return Column(
                children: [
                  SizedBox(
                    height: MediaQuery.of(context).size.height * .7,
                    child: GridView.builder(
                      gridDelegate:
                          const SliverGridDelegateWithFixedCrossAxisCount(
                        crossAxisCount: 2,
                        crossAxisSpacing: 25,
                        mainAxisSpacing: 75,
                        childAspectRatio: 0.8,
                      ),
                      itemCount: captainsList!.length,
                      itemBuilder: (context, index) {
                        return GestureDetector(
                          onTap: () {
                            Navigator.pushNamed(
                                context, kCaptainsDetailsScreenRoute);

                            BlocProvider.of<BottomNavCubit>(context)
                                .getDetails(state.data![index]);
                          },
                          child: TrainerCard(
                            captainsEntity: captainsList[
                                index], // Replace with actual image paths
                          ),
                        );
                      },
                    ),
                    //  ListView.builder(
                    //                   physics: const BouncingScrollPhysics(),
                    //                   itemCount: state.data!.length,
                    //                   itemBuilder: (context, index) {
                    //                     return InkWell(
                    //                       onTap: () {
                    //                         Navigator.pushNamed(
                    //                             context, kNewsDetailsScreenRoute);

                    //                         BlocProvider.of<BottomNavCubit>(context)
                    //                             .getDetails(state.data![index]);
                    //                       },
                    //                       child: AllCaptainsListItem(
                    //                         newsList: ta3amemList![index],
                    //                         itemIndex: index,
                    //                       ),
                    //                     );
                    //                   },
                    //                 ),
                  ),
                ],
              );
            } else if (state is FetchLoading) {
              return const Center(
                child: CustomLoadingWidget(
                  loadingText: "جاري تحميل المدربين",
                ),
              );
            } else if (state is FetchFailed) {
              return EmptyWidget(
                text: state.message,
              );
            } else if (box.get(kEmployeeDataBox) == null) {
              return ErrorText(
                  image: "assets/images/should_login.png",
                  text: AppLocalizations.of(context)!
                      .translate('you_should_login_first')!);
            } else {
              return const ErrorText(text: "حدث خطأ ما");
            }
          },
        ),
      ),
    );
  }
}

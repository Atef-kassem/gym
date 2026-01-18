import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:swat_gym/core/utils/gaps.dart';
import 'package:swat_gym/core/widgets/empty_widget.dart';
import 'package:swat_gym/features/inbody/data/models/all_inbody.dart';
import 'package:swat_gym/features/inbody/presentation/manager/news_cubit/all_inbody_cubit.dart';
import 'package:swat_gym/features/inbody/presentation/views/widgets/all_inbody_list_item.dart';
import 'package:hive/hive.dart';

import '../../../../../../core/locale/app_localizations.dart';
import '../../../../../../core/utils/constants.dart';
import '../../../../../../core/widgets/custom_loading_widget.dart';
import '../../../../../../core/widgets/error_text.dart';
import '../../../../auth/login/domain/entities/employee_entity.dart';
import '../../../../bottom_nav/presentation/manger/cubit/bottom_nav_cubit.dart';

// ignore: must_be_immutable
class AllInbodyViewBody extends StatefulWidget {
  const AllInbodyViewBody({super.key});

  @override
  State<AllInbodyViewBody> createState() => _AllInbodyViewBodyState();
}

class _AllInbodyViewBodyState extends State<AllInbodyViewBody> {
  var box = Hive.box<EmployeeEntity>(kEmployeeDataBox);

  @override
  void initState() {
    _onInit();
    super.initState();
  }

  // @override
  // void dispose() {
  //   BlocProvider.of<NewsCubit>(context).close();
  //   super.dispose();
  // }

  void _onInit() async {
    if (box.get(kEmployeeDataBox) != null) {
      await BlocProvider.of<AllInbodyCubit>(context)
          .getAllInbody(box.get(kEmployeeDataBox)!.memId!.toString());
    }
  }

  @override
  Widget build(BuildContext context) {
    //  getAllMessages(context);

    return Padding(
      padding: const EdgeInsets.only(left: 10, right: 10),
      child: SingleChildScrollView(
        child: BlocBuilder<AllInbodyCubit, AllInbodyState>(
          builder: (context, state) {
            if (state is FetchSuccessful) {
              AllInbodyList ta3amemList = state.data!;

              return Column(
                children: [
                  Gaps.vGap12,
                  ListView.builder(
                    shrinkWrap: true,
                    physics: const BouncingScrollPhysics(),
                    padding: const EdgeInsets.all(10),
                    
                    itemCount: state.data!.length,
                    itemBuilder: (context, index) {
                      return InkWell(
                        onTap: () {
                          Navigator.pushNamed(
                              context, kAllIndodyDetailsScreenRoute);

                          BlocProvider.of<BottomNavCubit>(context)
                              .getDetails(state.data![index]);
                        },
                        child: AllInbodyListItem(
                          newsList: ta3amemList[index],
                          itemIndex: index,
                        ),
                      );
                    },
                  ),
                ],
              );
            } else if (state is FetchLoading) {
              return const Center(
                child: CustomLoadingWidget(
                  loadingText: "جاري تحميل احصائيات الجسم",
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

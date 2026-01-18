import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:swat_gym/core/utils/gaps.dart';
import 'package:swat_gym/core/widgets/empty_widget.dart';
import 'package:swat_gym/features/news/presentation/manager/news_cubit/news_cubit.dart';
import 'package:hive/hive.dart';

import '../../../../../../core/locale/app_localizations.dart';
import '../../../../../../core/utils/constants.dart';
import '../../../../../../core/widgets/custom_loading_widget.dart';
import '../../../../../../core/widgets/error_text.dart';
import '../../../../../features/news/data/models/news.dart';
import '../../../../auth/login/domain/entities/employee_entity.dart';
import '../../../../bottom_nav/presentation/manger/cubit/bottom_nav_cubit.dart';
import 'all_news_list_item.dart';

// ignore: must_be_immutable
class NewsViewBody extends StatefulWidget {
  const NewsViewBody({super.key});

  @override
  State<NewsViewBody> createState() => _NewsViewBodyState();
}

class _NewsViewBodyState extends State<NewsViewBody> {
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
      await BlocProvider.of<NewsCubit>(context)
          .getAllNews(box.get(kEmployeeDataBox)!.memId!.toString());
    }
  }

  @override
  Widget build(BuildContext context) {
    //  getAllMessages(context);

    return Padding(
      padding: const EdgeInsets.only(left: 10, right: 10),
      child: SingleChildScrollView(
        child: BlocBuilder<NewsCubit, NewsState>(
          builder: (context, state) {
            if (state is FetchSuccessful) {
              AllNewsList ta3amemList = state.data!;

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
                          Navigator.pushNamed(context, kNewsDetailsScreenRoute);

                          BlocProvider.of<BottomNavCubit>(context)
                              .getDetails(state.data![index]);
                        },
                        child: AllNewsListItem(
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
                  loadingText: "جاري تحميل الأخبار",
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

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:swat_gym/features/app_home/presentation/manger/services_cubit/services_cubit.dart';
import 'package:swat_gym/core/widgets/empty_widget.dart';

import '../../../../../core/locale/app_localizations.dart';
import '../../../../../core/utils/gaps.dart';
import '../../../../../core/utils/media_query_sizes.dart';
import '../../../../bottom_nav/presentation/manger/cubit/bottom_nav_cubit.dart';
import 'custom_grid_container.dart';

class ListKhadamt extends StatelessWidget {
  const ListKhadamt({
    super.key,
    required this.locale,
  });

  final AppLocalizations locale;

  @override
  Widget build(BuildContext context) {
    return Container(
      //height: SizeConfig.screenHeight! * 0.33,
      width: SizeConfig.screenWidth!,
      padding: const EdgeInsets.symmetric(horizontal: 15.0, vertical: 10.0),
      alignment: Alignment.center,
      decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(25),
          color: const Color(0xffffffff),
          boxShadow: const [
            BoxShadow(
              color: Color(0x29000000),
              offset: Offset(0, 3),
            )
          ]),
      child:
          BlocBuilder<ServicesCubit, ServicesState>(builder: (context, state) {
        if (state is FetchLoading) {
          return const SizedBox(
              height: 400, child: Center(child: CircularProgressIndicator()));
        } else if (state is FetchSuccessful) {
          return Column(
            children: [
              Text(state.data!.testModeTitle ?? "أختر الخدمة"),
              Gaps.vGap10,
              GridView.builder(
                physics: const NeverScrollableScrollPhysics(),
                shrinkWrap: true,
                gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 3,
                  crossAxisSpacing: 16.w,
                  mainAxisSpacing: 16.h,
                  mainAxisExtent: 90.h,
                  childAspectRatio: 2,
                ),
                itemCount: state.data!.data!.length,
                itemBuilder: (context, index) {
                  return CustomGridContainer(
                    onTap: () {
                      BlocProvider.of<BottomNavCubit>(context)
                          .navigationQueue
                          .addLast(BlocProvider.of<BottomNavCubit>(context)
                              .bottomNavIndex);
                      BlocProvider.of<BottomNavCubit>(context)
                          .updateBottomNavIndex(
                              int.parse(state.data!.data![index].screenNum!));
                    },
                    imagePath: state.data!.data![index].icon!,
                    orderText: state.data!.data![index].title!,
                  );
                },
              ),
            ],
          );
        } else {
          return EmptyWidget(
            text: locale.translate('no_data')!,
          );
        }
      }),
    );
  }
}

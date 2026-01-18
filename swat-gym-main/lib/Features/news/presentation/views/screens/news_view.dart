import 'package:animate_do/animate_do.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:swat_gym/features/news/presentation/views/widgets/news_view_body.dart';
import 'package:swat_gym/core/widgets/custom_simple_app_bar.dart';

import '../../../../bottom_nav/presentation/manger/cubit/bottom_nav_cubit.dart';

class NewsView extends StatelessWidget {
  const NewsView({super.key});

  @override
  Widget build(BuildContext context) {
    Size screenSize = MediaQuery.of(context).size;

    return FadeInUp(
      duration: const Duration(milliseconds: 300),
      child: DefaultTabController(
        animationDuration: const Duration(milliseconds: 500),
        length: 2,
        initialIndex: 0,
        child: SafeArea(
          child: Scaffold(
            appBar: PreferredSize(
                preferredSize: screenSize * .07,
                child: CustomSimpleAppBar(
                  appBarTitle: "الأخبار",
                  backHandler: () {
                    if (Navigator.canPop(context)) {
                      // الحالة دي معناها إن الشاشة دي اتفتحت بـ push
                      Navigator.pop(context);
                    } else {
                      // الشاشة دي اتعرضت كواحدة من التابات، نرجّع المستخدم للتاب المناسب
                      BlocProvider.of<BottomNavCubit>(context)
                          .updateBottomNavIndex(4);
                    }
                  },
                )),
            backgroundColor: Colors.white,
            body: const NewsViewBody(),
          ),
        ),
      ),
    );
  }
}

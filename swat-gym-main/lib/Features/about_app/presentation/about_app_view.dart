import 'package:animate_do/animate_do.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:swat_gym/core/widgets/custom_simple_app_bar.dart';

import '../../bottom_nav/presentation/manger/cubit/bottom_nav_cubit.dart';
import 'widgets/about_app_view_body.dart';

class AboutAppView extends StatelessWidget {
  const AboutAppView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: PreferredSize(
          preferredSize: MediaQuery.of(context).size * .07,
          child: CustomSimpleAppBar(
            appBarTitle: "عن التطبيق",
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
      body: FadeInUp(child: const AboutAppViewBody()),
    );
  }
}

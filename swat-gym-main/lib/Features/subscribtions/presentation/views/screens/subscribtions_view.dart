import 'package:animate_do/animate_do.dart';
import 'package:flutter/material.dart';
import 'package:swat_gym/core/widgets/custom_simple_app_bar.dart';
import 'package:swat_gym/features/subscribtions/presentation/views/widgets/subscribtions_view_body.dart';


class SubscribtionsView extends StatelessWidget {
  const SubscribtionsView({super.key});

  @override
  Widget build(BuildContext context) {
    Size screenSize = MediaQuery.of(context).size;

    return FadeInUp(
      duration: const Duration(milliseconds: 300),
      child: Scaffold(
        appBar: PreferredSize(
          preferredSize: screenSize * .07,
          child: CustomSimpleAppBar(
            appBarTitle: "الإشتراكات",
            backHandler: () {
              Navigator.pop(context);
            },
          ),
        ),
        backgroundColor: Colors.white,
        body: const SubscribtionsViewBody(),
      ),
    );
  }
}

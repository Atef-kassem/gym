import 'package:animate_do/animate_do.dart';
import 'package:flutter/material.dart';
import 'package:swat_gym/features/my_subscribtions/presentation/views/widgets/my_subscribtions_view_body.dart';
import 'package:swat_gym/features/my_subscribtions/presentation/views/widgets/custom_toggle_app_bar.dart';

class MySubscribtionsView extends StatelessWidget {
  const MySubscribtionsView({super.key});

  @override
  Widget build(BuildContext context) {
    Size screenSize = MediaQuery.of(context).size;

    return FadeInUp(
      duration: const Duration(milliseconds: 300),
      child: Scaffold(
        appBar: PreferredSize(
            preferredSize: screenSize * .07,
            child: CustomToggleAppBar(
              appBarTitle: "اشتركاتي",
            )),
        backgroundColor: Colors.white,
        body: const MySubscribtionsViewBody(),
      ),
    );
  }
}

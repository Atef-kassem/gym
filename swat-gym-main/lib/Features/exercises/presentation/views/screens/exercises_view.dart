import 'package:animate_do/animate_do.dart';
import 'package:flutter/material.dart';
import 'package:swat_gym/core/widgets/custom_simple_app_bar.dart';

import '../widgets/exercises_view_body.dart';

class ExercisesView extends StatelessWidget {
  const ExercisesView({super.key});

  @override
  Widget build(BuildContext context) {
    Size screenSize = MediaQuery.of(context).size;

    return FadeInUp(
      duration: const Duration(milliseconds: 300),
      child: Scaffold(
        appBar: PreferredSize(
            preferredSize: screenSize * .07,
            child: CustomSimpleAppBar(
              appBarTitle: "التمارين",
              backHandler: () {
                Navigator.pop(context);
              },
            )),
        backgroundColor: Colors.white,
        body: const ExercisesViewBody(),
      ),
    );
  }
}

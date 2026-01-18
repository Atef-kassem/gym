import 'package:animate_do/animate_do.dart';
import 'package:flutter/material.dart';
import 'package:swat_gym/features/offers/presentation/views/widgets/offers_view_body.dart';
import 'package:swat_gym/core/widgets/custom_simple_app_bar.dart';

class OffersView extends StatelessWidget {
  const OffersView({super.key});

  @override
  Widget build(BuildContext context) {
    Size screenSize = MediaQuery.of(context).size;

    return FadeInUp(
      duration: const Duration(milliseconds: 300),
      child: DefaultTabController(
        animationDuration: const Duration(milliseconds: 500),
        length: 2,
        initialIndex: 0,
        child: Scaffold(
          appBar: PreferredSize(
              preferredSize: screenSize * .07,
              child: CustomSimpleAppBar(
                appBarTitle: "العروض",
                backHandler: () {
                  Navigator.pop(context);
                },
              )),
          backgroundColor: Colors.white,
          body: const OffersViewBody(),
        ),
      ),
    );
  }
}

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:swat_gym/features/my_subscribtions/domain/entities/my_subscribtions_entity.dart';
import 'package:swat_gym/features/my_subscribtions/presentation/views/widgets/custom_toggle_app_bar.dart';
import 'package:swat_gym/features/my_subscribtions/presentation/views/widgets/my_subscribtions_details_body.dart';

import '../../../../bottom_nav/presentation/manger/cubit/bottom_nav_cubit.dart';

class MySubscribtionsDetailsView extends StatelessWidget {
  const MySubscribtionsDetailsView({super.key});

  @override
  Widget build(BuildContext context) {
    MySubscribtionsEntity mySubscribtionsEntity;

    mySubscribtionsEntity = BlocProvider.of<BottomNavCubit>(context).details!;

    return SafeArea(
      child: Scaffold(
        appBar: PreferredSize(
            preferredSize: MediaQuery.of(context).size * .07,
            child: CustomToggleAppBar(
              appBarTitle: "تفاصيل الاشتراك",
            )),
        body: MySubscribtionsDetailsBody(
            mySubscribtionsEntity: mySubscribtionsEntity),
      ),
    );
  }
}

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:swat_gym/features/subscribtions/domain/entities/subscribtions_entity.dart';

import '../../../../../features/subscribtions/presentation/views/widgets/subscribtions_details_body.dart';
import '../../../../bottom_nav/presentation/manger/cubit/bottom_nav_cubit.dart';

class SubscribtionsDetailsView extends StatelessWidget {
  const SubscribtionsDetailsView({super.key});

  @override
  Widget build(BuildContext context) {
    final details = BlocProvider.of<BottomNavCubit>(context).details;
    
    if (details == null || details is! SubscribtionsEntity) {
      return const SafeArea(
        child: Scaffold(
          body: Center(
            child: Text('لا توجد بيانات'),
          ),
        ),
      );
    }

    final subscribtionsEntity = details;

    return SafeArea(
      child: Scaffold(
        body:
            SubscribtionsDetailsBody(subscribtionsEntity: subscribtionsEntity),
      ),
    );
  }
}

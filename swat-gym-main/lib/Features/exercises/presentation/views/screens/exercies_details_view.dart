import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:swat_gym/features/exercises/domain/entities/exercise_entity.dart';
import 'package:swat_gym/features/exercises/presentation/views/widgets/exercies_details_body.dart';

import '../../../../bottom_nav/presentation/manger/cubit/bottom_nav_cubit.dart';

class ExerciesDetailsView extends StatelessWidget {
  const ExerciesDetailsView({super.key});

  @override
  Widget build(BuildContext context) {
    final details = BlocProvider.of<BottomNavCubit>(context).details;
    
    if (details == null || details is! ExerciseEntity) {
      return const SafeArea(
        child: Scaffold(
          body: Center(
            child: Text('لا توجد بيانات'),
          ),
        ),
      );
    }

    final exerciseEntity = details;

    return SafeArea(
      child: Scaffold(
        body: ExerciesDetailsBody(exerciseEntity: exerciseEntity),
      ),
    );
  }
}

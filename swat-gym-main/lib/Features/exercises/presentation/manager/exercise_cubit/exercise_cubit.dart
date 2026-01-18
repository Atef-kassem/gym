// ignore: depend_on_referenced_packages
import 'package:bloc/bloc.dart';
import 'package:swat_gym/features/exercises/data/models/my_messages_model/exercise.dart';

import '../../../domain/use_cases/exercise_use_case.dart';

part 'exercise_state.dart';

class ExerciseCubit extends Cubit<ExerciseState> {
  ExerciseUseCase exerciseUseCase;
  ExerciseCubit(this.exerciseUseCase) : super(ExerciseInitial());

  Future<void> getAllExercise(String userId) async {
    emit(const FetchLoading());
    final result = await exerciseUseCase.callAllExercise(userId);

    emit(result.fold(FetchFailed.new, FetchSuccessful.new));
  }
}

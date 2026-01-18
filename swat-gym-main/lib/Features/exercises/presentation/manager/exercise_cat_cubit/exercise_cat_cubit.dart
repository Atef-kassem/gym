// ignore: depend_on_referenced_packages
import 'package:bloc/bloc.dart';
import 'package:swat_gym/features/exercises/data/models/my_messages_model/exercise_cat.dart';
import 'package:swat_gym/features/exercises/domain/use_cases/exercise_use_case.dart';

part 'exercise_cat_state.dart';

class ExerciseCatCubit extends Cubit<ExerciseCatState> {
  ExerciseUseCase exerciseUseCase;
  ExerciseCatCubit(this.exerciseUseCase) : super(ExerciseCatInitial());

  Future<void> getAllExerciseCat(String userId) async {
    emit(const FetchExerciseCatLoading());
    final result = await exerciseUseCase.callAllExerciseCat(userId);

    emit(result.fold(
        FetchExerciseCatFailed.new, FetchExerciseCatSuccessful.new));
  }
}

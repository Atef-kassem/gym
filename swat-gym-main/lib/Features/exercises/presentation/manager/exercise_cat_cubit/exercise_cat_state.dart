part of 'exercise_cat_cubit.dart';

abstract class ExerciseCatState {
  const ExerciseCatState();
  List<Object> get props => [];
}

class ExerciseCatInitial extends ExerciseCatState {}

class FetchExerciseCatLoading extends ExerciseCatState {
  const FetchExerciseCatLoading();
}

class FetchExerciseCatSuccessful extends ExerciseCatState {
  final AllExercisesCatList? data;

  const FetchExerciseCatSuccessful(this.data);
}

class FetchExerciseCatFailed extends ExerciseCatState {
  final String message;
  const FetchExerciseCatFailed(this.message);
}

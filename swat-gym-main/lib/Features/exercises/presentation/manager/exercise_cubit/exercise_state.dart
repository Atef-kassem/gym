part of 'exercise_cubit.dart';

abstract class ExerciseState {
  const ExerciseState();
  List<Object> get props => [];
}

class ExerciseInitial extends ExerciseState {}

class FetchLoading extends ExerciseState {
  const FetchLoading();
}

class FetchSuccessful extends ExerciseState {
  final AllExercisesList? data;

  const FetchSuccessful(this.data);
}

class FetchFailed extends ExerciseState {
  final String message;
  const FetchFailed(this.message);
}

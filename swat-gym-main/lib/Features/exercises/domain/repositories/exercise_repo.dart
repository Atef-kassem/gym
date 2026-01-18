import '../../data/data_sources/remote_data_source/all_exercises_remote_data_source.dart';

abstract class ExerciseRepo {
  Future<AllExercisesResponse> fetchAllExercise(
    String catId,
  );

  Future<AllExercisescatResponse> fetchAllExerciseCat(
    String userId,
  );
}

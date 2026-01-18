import '../../domain/repositories/exercise_repo.dart';
import '../data_sources/remote_data_source/all_exercises_remote_data_source.dart';

class ExerciseRepositoryImp extends ExerciseRepo {
  final AllExercisesRemoteDataSource exerciseRemoteDataSource;

  ExerciseRepositoryImp(this.exerciseRemoteDataSource);

  @override
  Future<AllExercisesResponse> fetchAllExercise(String userId) async {
    var userData = await exerciseRemoteDataSource.fetchAllExercises(userId);

    return userData;
  }

  @override
  Future<AllExercisescatResponse> fetchAllExerciseCat(String userId) async {
    var userData = await exerciseRemoteDataSource.fetchAllExercisesCat(userId);

    return userData;
  }
}

import '../../data/data_sources/remote_data_source/all_exercises_remote_data_source.dart';
import '../entities/exercise_entity.dart';
import '../repositories/exercise_repo.dart';

abstract class UseCase<type, Param> {
  Future<AllExercisesResponse> callAllExercise(String catId);
  Future<AllExercisescatResponse> callAllExerciseCat(String userId);
}

class ExerciseUseCase extends UseCase<ExerciseEntity, void> {
  final ExerciseRepo exerciseRepository;
  ExerciseUseCase(this.exerciseRepository);
  @override
  Future<AllExercisesResponse> callAllExercise(String catId) async {
    return await exerciseRepository.fetchAllExercise(catId);
  }

  @override
  Future<AllExercisescatResponse> callAllExerciseCat(String userId) async {
    return await exerciseRepository.fetchAllExerciseCat(userId);
  }
}

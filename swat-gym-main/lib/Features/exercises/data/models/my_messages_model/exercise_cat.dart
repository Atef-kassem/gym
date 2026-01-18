import '../../../domain/entities/exercise_cat_entity.dart';

typedef AllExercisesCatList = List<ExerciseCatEntity>?;

class ExerciseCat extends ExerciseCatEntity {
  const ExerciseCat({
    super.catId,
    super.catName,
  });

  factory ExerciseCat.fromJson(Map<String, dynamic> json) => ExerciseCat(
        // New Backend Format: { id, name, ... }
        // Old Backend Format: { cat_id, cat_name, ... }
        catId: json["id"]?.toString() ?? json["cat_id"]?.toString(),
        catName: json["name"]?.toString() ?? json["cat_name"]?.toString(),
      );

  Map<String, dynamic> toJson() => {
        "cat_id": catId,
        "cat_name": catName,
      };
}

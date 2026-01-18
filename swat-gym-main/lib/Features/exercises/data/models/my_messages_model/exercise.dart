
import '../../../domain/entities/exercise_entity.dart';

typedef AllExercisesList = List<ExerciseEntity>?;

class Exercise extends ExerciseEntity {
  const Exercise({
    super.id,
    super.catIdFk,
    super.title,
    super.tamrenFor,
    super.magmo3at,
    super.tkrar,
    super.restInSec,
    super.instructions,
    super.catName,
    super.mainImage,
    super.allImages,
  });

  factory Exercise.fromJson(Map<String, dynamic> json) {
    // دعم البيانات الجديدة من API
    if (json.containsKey("name") || json.containsKey("categoryId")) {
      // البيانات الجديدة من API
      return Exercise(
        id: json["id"]?.toString(),
        catIdFk: json["categoryId"]?.toString() ?? json["cat_id_fk"]?.toString(),
        title: json["name"]?.toString() ?? json["title"]?.toString(),
        tamrenFor: json["description"]?.toString() ?? json["tamren_for"]?.toString(),
        magmo3at: json["duration"]?.toString() ?? json["magmo3at"]?.toString(),
        tkrar: json["difficulty"]?.toString() ?? json["tkrar"]?.toString(),
        restInSec: json["rest_in_sec"]?.toString(),
        instructions: json["instructions"]?.toString(),
        catName: (json["category"] is Map<String, dynamic> 
            ? json["category"]["name"]?.toString() 
            : null) ?? json["cat_name"]?.toString(),
        // استخدام imageUrl من API الجديد أو main_image من API القديم
        mainImage: json["imageUrl"]?.toString() ?? json["main_image"]?.toString(),
        allImages: List<String>.from(json["all_images"] ?? []),
      );
    } else {
      // البيانات القديمة من API
      return Exercise(
        id: json["id"]?.toString(),
        catIdFk: json["cat_id_fk"]?.toString(),
        title: json["title"]?.toString(),
        tamrenFor: json["tamren_for"]?.toString(),
        magmo3at: json["magmo3at"]?.toString(),
        tkrar: json["tkrar"]?.toString(),
        restInSec: json["rest_in_sec"]?.toString(),
        instructions: json["instructions"]?.toString(),
        catName: json["cat_name"]?.toString(),
        mainImage: json["main_image"]?.toString(),
        allImages: List<String>.from(json["all_images"] ?? []),
      );
    }
  }

  Map<String, dynamic> toJson() => {
        "id": id,
        "cat_id_fk": catIdFk,
        "title": title,
        "tamren_for": tamrenFor,
        "magmo3at": magmo3at,
        "tkrar": tkrar,
        "rest_in_sec": restInSec,
        "instructions": instructions,
        "cat_name": catName,
        "main_image": mainImage,
        "all_images": allImages,
      };
}

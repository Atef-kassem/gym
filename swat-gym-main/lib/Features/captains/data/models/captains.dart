import 'package:swat_gym/features/captains/domain/entities/captains_entity.dart';

typedef AllCaptainsList = List<Captains>?;

class Captains extends CaptainsEntity {
  const Captains(
      {super.id, super.about, super.mainImage, super.imagePath, super.name});

  factory Captains.fromJson(Map<String, dynamic> json) {
    // التعامل مع format الجديد من Backend: { id, name, about, imageUrl, ... }
    // أو format القديم: { id, name, about, main_image, image_path }
    
    // Format الجديد من Backend (AppTrainer table)
    if (json.containsKey('imageUrl') || json.containsKey('image')) {
      return Captains(
        id: json["id"]?.toString(),
        mainImage: json["imageUrl"]?.toString() ?? json["image"]?.toString() ?? json["main_image"]?.toString(),
        imagePath: json["imageUrl"]?.toString() ?? json["image_path"]?.toString(),
        about: json["about"]?.toString(),
        name: json["name"]?.toString(),
      );
    }
    
    // Format القديم (backward compatibility)
    return Captains(
      id: json["id"]?.toString(),
      mainImage: json["main_image"]?.toString(),
      imagePath: json["image_path"]?.toString(),
      about: json["about"]?.toString(),
      name: json["name"]?.toString(),
    );
  }

  Map<String, dynamic> toJson() => {
        "id": id,
        "main_image": mainImage,
        "image_path": imagePath,
        "about": about,
        "name": name
      };
}

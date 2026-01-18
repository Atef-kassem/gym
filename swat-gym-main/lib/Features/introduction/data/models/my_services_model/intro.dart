import 'package:swat_gym/features/introduction/domain/entities/intro_entity.dart';

typedef AllIntroList = List<IntroEntity>?;

class Intro extends IntroEntity {
  const Intro({
    super.spalshId,
    super.screenNumber,
    super.spalshTitleEn,
    super.spalshTitleAr,
    super.imagePath,
    super.image,
    super.spalshDetailsAr,
    super.spalshDetailsEn,
  });

  factory Intro.fromJson(Map<String, dynamic> json) => Intro(
        spalshId: json['spalsh_id'],
        screenNumber: json['screen_number'],
        spalshTitleEn: json['spalsh_title_en'],
        spalshTitleAr: json['spalsh_title_ar'],
        imagePath: json['image_path'],
        image: json['image'],
        spalshDetailsAr: json['spalsh_details_ar'],
        spalshDetailsEn: json['spalsh_details_en'],
      );

  Map<String, dynamic> toJson() => {
        'spalsh_id': spalshId,
        'screen_number': screenNumber,
        'spalsh_title_en': spalshTitleEn,
        'spalsh_title_ar': spalshTitleAr,
        'image_path': imagePath,
        'image': image,
        'spalsh_details_ar': spalshDetailsAr,
        'spalsh_details_en': spalshDetailsEn
      };
}

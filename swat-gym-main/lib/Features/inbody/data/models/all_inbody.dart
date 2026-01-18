
import 'package:swat_gym/features/inbody/domain/entities/Inbody.dart';

typedef AllInbodyList = List<AllInbody>?;

class AllInbody extends AllInbodyEntity {
  const AllInbody(
      {super.created,
      super.dayDate,
      super.forMonth,
      super.forYear,
      super.id,
      super.image,
      super.imagePath,
      super.memCodeFk,
      super.memIdFk,
      super.title,
      super.updated,});

  factory AllInbody.fromJson(Map<String, dynamic> json) {
    // دعم format الجديد من Backend: { id, memberId, measurementDate, weight, bodyFat, muscleMass, bmi, notes, createdAt, updatedAt, member: {...} }
    // أو format القديم: { id, title, mem_code_fk, mem_id_fk, day_date, for_month, for_year, created, updated, image, image_path }
    
    // Format الجديد من Backend (Inbodies table)
    if (json.containsKey('memberId') || json.containsKey('measurementDate')) {
      final member = json['member'] as Map<String, dynamic>?;
      return AllInbody(
        id: json["id"]?.toString(),
        title: json["notes"]?.toString() ?? "", // استخدام notes كـ title
        memCodeFk: member?["memberCode"]?.toString(),
        memIdFk: json["memberId"]?.toString(),
        dayDate: json["measurementDate"]?.toString(),
        forMonth: null, // لا يوجد في الـ API الجديد
        forYear: null, // لا يوجد في الـ API الجديد
        created: json["createdAt"]?.toString(),
        updated: json["updatedAt"]?.toString(),
        image: null, // لا يوجد في الـ API الجديد
        imagePath: null, // لا يوجد في الـ API الجديد
      );
    }
    
    // Format القديم (backward compatibility)
    return AllInbody(
      created: json["created"],
      dayDate: json["day_date"],
      forMonth: json["for_month"],
      forYear: json["for_year"],
      id: json["id"]?.toString(),
      image: json["image"],
      imagePath: json["image_path"],
      memCodeFk: json["mem_code_fk"],
      memIdFk: json["mem_id_fk"],
      title: json["title"],
      updated: json["updated"],
    );
  }

  Map<String, dynamic> toJson() => {
        "created": created,
        "day_date": dayDate,
        "for_month": forMonth,
        "for_year": forYear,
        "id": id,
        "image": image,
        "image_path": imagePath,
        "mem_code_fk": memCodeFk,
        "mem_id_fk": memIdFk,
        "title": title,
        "updated": updated
      };
}

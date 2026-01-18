import 'package:swat_gym/core/utils/functions/base_one_response.dart';
import 'package:swat_gym/features/app_home/domain/entities/ads.dart';

class AdsModel extends BaseOneResponse {
  const AdsModel({
    super.status,
    super.data,
    super.message,
  });

  factory AdsModel.fromJson(Map<String, dynamic> json) {
    // التعامل مع format من interceptor: { code: 0, data: [...], message: "" }
    // أو format القديم: { status: int, data: [...], message: string }
    int? statusValue;
    
    // الأولوية للتحقق من 'code' لأنه يأتي من interceptor
    if (json.containsKey('code')) {
      statusValue = json['code'] is int
          ? json['code'] as int?
          : int.tryParse(json['code'].toString());
    } else if (json.containsKey('status')) {
      statusValue = json['status'] is int
          ? json['status'] as int?
          : int.tryParse(json['status'].toString());
    }
    
    return AdsModel(
      status: statusValue,
      message: json['message'] as String?,
      data: (json['data'] as List<dynamic>?)
          ?.map((e) => Ads.fromJson(e as Map<String, dynamic>))
          .toList(),
    );
  }

  Map<String, dynamic> toJson() =>
      {'status': status, 'message': message, 'data': data};
}

typedef AdsList = List<AdsEntity>?;

class Ads extends AdsEntity {
  const Ads({
    super.id,
    super.title,
    super.details,
    super.fromDate,
    super.toDate,
    super.mainImage,
    super.imagePath,
  });

  factory Ads.fromJson(Map<String, dynamic> json) {
    // التعامل مع format الجديد من Backend: { id, title, description, imageUrl, linkUrl, startDate, endDate, isActive }
    // أو format القديم: { id, title, details, from_date, to_date, main_image, image_path }
    
    // Format الجديد من Backend (AppAd table)
    if (json.containsKey('startDate') || json.containsKey('endDate')) {
      return Ads(
        id: json['id']?.toString(),
        title: json['title']?.toString(),
        details: json['description']?.toString() ?? json['details']?.toString(),
        fromDate: json['startDate']?.toString(),
        toDate: json['endDate']?.toString(),
        mainImage: json['imageUrl']?.toString() ?? json['main_image']?.toString(),
        imagePath: json['imageUrl']?.toString() ?? json['image_path']?.toString(),
      );
    }
    
    // Format القديم (backward compatibility)
    return Ads(
      id: json['id']?.toString(),
      title: json['title']?.toString(),
      details: json['details']?.toString(),
      fromDate: json['from_date']?.toString(),
      toDate: json['to_date']?.toString(),
      mainImage: json['main_image']?.toString(),
      imagePath: json['image_path']?.toString(),
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'title': title,
        'details': details,
        'from_date': fromDate,
        'to_date': toDate,
        'main_image': mainImage,
        'image_path': imagePath
      };
}

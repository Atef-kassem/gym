import 'package:swat_gym/features/app_home/data/models/my_services_model/service.dart';
import 'package:swat_gym/features/app_home/domain/entities/services_entity.dart';

class MyServicesModel extends ServicesEntity {
  const MyServicesModel({
    super.status,
    super.data,
    super.message,
    super.testModeTitle,
    super.testModeType,
  });

  factory MyServicesModel.fromJson(Map<String, dynamic> json) {
    return MyServicesModel(
      status: json['status'] as int?,
      message: json['message'] as String?,
      testModeTitle: json['test_mode_title'] as String?,
      testModeType: json['test_mode_type'] as int?,
      data: (json['data'] as List<dynamic>?)
          ?.map((e) => Service.fromJson(e as Map<String, dynamic>))
          .toList(),
    );
  }

  Map<String, dynamic> toJson() => {
        'status': status,
        'message': message,
        'test_mode_title': testModeTitle,
        'test_mode_type': testModeType,
        'data': data
      };
}

import 'package:swat_gym/features/introduction/data/models/my_services_model/intro.dart';
import 'package:swat_gym/core/utils/functions/base_one_response.dart';

class MyIntroModel extends BaseOneResponse {
  const MyIntroModel({
    super.status,
    super.data,
    super.message,
  });

  factory MyIntroModel.fromJson(Map<String, dynamic> json) {
    return MyIntroModel(
      status: json['status'] as int?,
      message: json['message'] as String?,
      data: (json['data'] as List<dynamic>?)
          ?.map((e) => Intro.fromJson(e as Map<String, dynamic>))
          .toList(),
    );
  }

  Map<String, dynamic> toJson() =>
      {'status': status, 'message': message, 'data': data};
}

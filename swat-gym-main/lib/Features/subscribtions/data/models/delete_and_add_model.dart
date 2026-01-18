import 'package:swat_gym/core/utils/functions/base_one_response.dart';

class DeleteAndAddModel extends BaseOneResponse {
  const DeleteAndAddModel({
    super.status,
    super.message,
  });

  factory DeleteAndAddModel.fromJson(Map<String, dynamic> json) {
    return DeleteAndAddModel(
      status: json['status'] as int?,
      message: json['message'] as String?,
    );
  }

  Map<String, dynamic> toJson() => {
        'status': status,
        'message': message,
      };
}

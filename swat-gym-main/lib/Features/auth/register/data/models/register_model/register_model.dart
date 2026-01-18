import '../../../domain/entities/register_entity.dart';

class RegisterModel extends RegisterEntity {
  int? status;
  String? message;

  RegisterModel({this.status, this.message})
      : super(
          responseMessage: message!,
          statusCode: status!,
        );

  factory RegisterModel.fromJson(Map<String, dynamic> json) => RegisterModel(
        status: json['status'] as int?,
        message: json['message'] as String?,
      );

  Map<String, dynamic> toJson() => {
        'status': status,
        'message': message,
      };
}

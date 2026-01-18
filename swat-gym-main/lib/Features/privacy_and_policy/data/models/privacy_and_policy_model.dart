import 'package:swat_gym/features/privacy_and_policy/domain/entities/privacy_and_policy_entity.dart';

class PrivacyAndPolicyModel extends PrivacyAndPolicyEntity {
  int? status;
  String? message;
  String? data;

  PrivacyAndPolicyModel({this.status, this.message, this.data})
      : super(
          responseMessage: message ?? "",
          statusCode: status ?? 0,
          responseData: data ?? "",
        );

  factory PrivacyAndPolicyModel.fromJson(Map<String, dynamic> json) {
    // دعم format الجديد: { code: 0, message: "...", data: {id, privacyPolicy, termsOfService, ...} }
    // أو format القديم: { status: int, message: "...", data: string }
    int? statusValue;
    if (json.containsKey('code')) {
      statusValue = json['code'] is int
          ? json['code'] as int?
          : int.tryParse(json['code'].toString());
    } else if (json.containsKey('status')) {
      statusValue = json['status'] is int
          ? json['status'] as int?
          : int.tryParse(json['status'].toString());
    }
    
    String? dataValue;
    if (json['data'] != null) {
      if (json['data'] is String) {
        // Format القديم: data هو String
        dataValue = json['data'] as String?;
      } else if (json['data'] is Map) {
        // Format الجديد: data هو Map يحتوي على privacyPolicy و termsOfService
        final dataMap = json['data'] as Map<String, dynamic>;
        // دمج privacyPolicy و termsOfService في نص واحد
        final privacyPolicy = dataMap['privacyPolicy']?.toString() ?? '';
        final termsOfService = dataMap['termsOfService']?.toString() ?? '';
        dataValue = '$privacyPolicy\n\n$termsOfService'.trim();
      }
    }
    
    return PrivacyAndPolicyModel(
      status: statusValue,
      message: json['message'] as String?,
      data: dataValue,
    );
  }

  Map<String, dynamic> toJson() => {
        'status': status,
        'message': message,
        'data': data,
      };
}

import 'package:swat_gym/features/auth/login/data/models/login_model/login_model/employee.dart';
import 'package:swat_gym/core/utils/functions/base_one_response.dart';

class EmployeeModel extends BaseOneResponse {
  const EmployeeModel(
      {super.status, super.data, super.message, super.logoutOption});

  factory EmployeeModel.fromJson(Map<String, dynamic> json) {
    // التعامل مع status كـ int أو String أو code
    int? statusValue;
    if (json.containsKey('status')) {
      if (json['status'] is int) {
        statusValue = json['status'] as int?;
      } else if (json['status'] is String) {
        statusValue = int.tryParse(json['status'] as String);
      }
    } else if (json.containsKey('code')) {
      if (json['code'] is int) {
        statusValue = json['code'] as int?;
      } else if (json['code'] is String) {
        statusValue = int.tryParse(json['code'] as String);
      }
    }

    // التعامل مع data - قد يكون Map أو List
    // ملاحظة: BaseResponse يستدعي EmployeeModel.fromJson مع data فقط (بيانات المستخدم)
    // لذا إذا لم يكن هناك 'data' key، فـ json نفسه هو البيانات
    dynamic dataValue;
    if (json.containsKey('data')) {
      // إذا كان هناك 'data' key، استخدمه
      if (json['data'] is List<dynamic>) {
        dataValue = (json['data'] as List<dynamic>?)
            ?.map((e) => Employee.fromJson(e as Map<String, dynamic>))
            .toList();
      } else if (json['data'] is Map<String, dynamic>) {
        dataValue = Employee.fromJson(json['data'] as Map<String, dynamic>);
      }
    } else if (json.containsKey('id') ||
        json.containsKey('name') ||
        json.containsKey('phone') ||
        json.containsKey('arabicName') ||
        json.containsKey('phoneNumber') ||
        json.containsKey('email') ||
        json.containsKey('ssNumber')) {
      // إذا كان json يحتوي على بيانات المستخدم مباشرة (من BaseResponse)
      dataValue = Employee.fromJson(json);
    }

    return EmployeeModel(
      status: statusValue ?? 0, // افتراضي 0 للنجاح إذا لم يكن موجوداً
      message: json['message'] as String?,
      data: dataValue,
      logoutOption: json['logout_option'] as int?,
    );
  }

  Map<String, dynamic> toJson() => {
        'status': status,
        'message': message,
        'data': data?.map((e) => e.toJson()).toList(),
        'logout_option': logoutOption
      };
}

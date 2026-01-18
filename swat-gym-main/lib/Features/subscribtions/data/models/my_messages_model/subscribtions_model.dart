import 'package:swat_gym/core/utils/functions/base_one_response.dart';
import 'package:swat_gym/features/subscribtions/data/models/my_messages_model/subscribtions.dart';

class SubscribtionsModel extends BaseOneResponse {
  const SubscribtionsModel({
    super.status,
    super.data,
    super.message,
  });

  factory SubscribtionsModel.fromJson(Map<String, dynamic> json) {
    // دعم البيانات الجديدة من API (code بدلاً من status)
    int? statusValue;
    if (json.containsKey('code')) {
      statusValue = json['code'] as int?;
    } else if (json.containsKey('status')) {
      statusValue = json['status'] is int ? json['status'] as int? : null;
    } else if (json.containsKey('success') && json['success'] == true) {
      statusValue = 0; // success = true يعني نجاح
    }
    
    return SubscribtionsModel(
      status: statusValue,
      message: json['message'] as String?,
      data: (json['data'] as List<dynamic>?)
          ?.map((e) => Subscribtions.fromJson(e as Map<String, dynamic>))
          .toList(),
    );
  }

  Map<String, dynamic> toJson() => {
        'status': status,
        'message': message,
        'data': data?.map((e) => e.toJson()).toList(),
      };
}

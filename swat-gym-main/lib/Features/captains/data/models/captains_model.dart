import 'package:swat_gym/core/utils/functions/base_one_response.dart';
import 'package:swat_gym/features/captains/data/models/captains.dart';

class CaptainsModel extends BaseOneResponse {
  const CaptainsModel({
    super.status,
    super.data,
    super.message,
  });

  factory CaptainsModel.fromJson(Map<String, dynamic> json) {
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
    
    return CaptainsModel(
      status: statusValue,
      message: json['message'] as String?,
      data: (json['data'] as List<dynamic>?)
          ?.map((e) => Captains.fromJson(e as Map<String, dynamic>))
          .toList(),
    );
  }

  Map<String, dynamic> toJson() => {
        'status': status,
        'message': message,
        'data': data?.map((e) => e.toJson()).toList(),
      };
}

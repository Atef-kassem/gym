import 'package:swat_gym/core/utils/functions/base_one_response.dart';
import 'package:swat_gym/features/inbody/data/models/all_inbody.dart';


class MyInbodyModel extends BaseOneResponse {
  const MyInbodyModel({
    super.status,
    super.data,
    super.message,
  });

  factory MyInbodyModel.fromJson(Map<String, dynamic> json) {
    // دعم format الجديد: { code: 0, message: "...", data: [...] }
    // أو format القديم: { status: int, message: "...", data: [...] }
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
    
    return MyInbodyModel(
      status: statusValue,
      message: json['message'] as String?,
      data: (json['data'] as List<dynamic>?)
          ?.map((e) => AllInbody.fromJson(e as Map<String, dynamic>))
          .toList(),
    );
  }

  Map<String, dynamic> toJson() => {
        'status': status,
        'message': message,
        'data': data?.map((e) => e.toJson()).toList(),
      };
}

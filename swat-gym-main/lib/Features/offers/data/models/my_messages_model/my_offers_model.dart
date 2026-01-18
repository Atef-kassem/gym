import 'package:swat_gym/core/utils/functions/base_one_response.dart';

import 'offers.dart';

class MyOffersModel extends BaseOneResponse {
  final bool? success;
  final int? count;

  const MyOffersModel({
    super.status,
    super.data,
    super.message,
    this.success,
    this.count,
  });

  factory MyOffersModel.fromJson(Map<String, dynamic> json) {
    // التعامل مع format الجديد من Backend: { success: true, data: [...], count: ... }
    // أو format القديم: { status: int, data: [...], message: string }
    // أو format من interceptor: { code: 0, data: [...], message: "" }
    bool? successValue;
    int? statusValue;
    String? messageValue;
    int? countValue;

    // الأولوية للتحقق من 'code' لأنه يأتي من interceptor
    if (json.containsKey('code')) {
      // Format من interceptor: { code: 0, data: [...], message: "" }
      statusValue = json['code'] is int
          ? json['code'] as int?
          : int.tryParse(json['code'].toString());
      messageValue = json['message'] as String?;
      // code == 0 يعني نجاح
      successValue = (statusValue == 0 || statusValue == 200);
      countValue = json['count'] as int?;
    } else if (json.containsKey('success')) {
      // Format الجديد من Backend
      successValue = json['success'] as bool?;
      statusValue = successValue == true ? 200 : 400;
      messageValue = json['message'] as String?;
      countValue = json['count'] as int?;
    } else if (json.containsKey('status')) {
      // Format القديم
      statusValue = json['status'] is int
          ? json['status'] as int?
          : int.tryParse(json['status'].toString());
      messageValue = json['message'] as String?;
      successValue = (statusValue == 200 || statusValue == 0);
      countValue = json['count'] as int?;
    }

    return MyOffersModel(
      status: statusValue,
      message: messageValue,
      success: successValue,
      count: countValue,
      data: (json['data'] as List<dynamic>?)
          ?.map((e) => Offers.fromJson(e as Map<String, dynamic>))
          .toList(),
    );
  }

  Map<String, dynamic> toJson() => {
        'status': status,
        'success': success,
        'message': message,
        'count': count,
        'data': data?.map((e) => e.toJson()).toList(),
      };
}

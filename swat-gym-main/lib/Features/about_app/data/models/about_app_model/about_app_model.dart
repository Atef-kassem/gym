import 'datum.dart';

class AboutAppModel {
  int? status;
  String? message;
  List<Datum>? data;

  AboutAppModel({this.status, this.message, this.data});

  factory AboutAppModel.fromJson(Map<String, dynamic> json) {
    // التعامل مع format من interceptor: { code: 0, data: {...}, message: "" }
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
    
    // التعامل مع data - قد يكون object واحد أو list
    List<Datum>? dataList;
    if (json['data'] != null) {
      if (json['data'] is List) {
        // Format القديم: data هو list
        dataList = (json['data'] as List<dynamic>)
            .map((e) => Datum.fromJson(e as Map<String, dynamic>))
            .toList();
      } else if (json['data'] is Map) {
        // Format الجديد: data هو object واحد
        dataList = [Datum.fromJson(json['data'] as Map<String, dynamic>)];
      }
    }
    
    return AboutAppModel(
      status: statusValue,
      message: json['message'] as String?,
      data: dataList,
    );
  }

  Map<String, dynamic> toJson() => {
        'status': status,
        'message': message,
        'data': data?.map((e) => e.toJson()).toList(),
      };
}

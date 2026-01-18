import 'datum.dart';

class MyMessagesModel {
  int? status;
  String? message;
  List<Datum>? data;

  MyMessagesModel({this.status, this.message, this.data});

  factory MyMessagesModel.fromJson(Map<String, dynamic> json) {
    print('=== MyMessagesModel.fromJson Debug ===');
    print('json type: ${json.runtimeType}');
    print('json keys: ${json.keys}');
    print('json[data]: ${json['data']}');
    print('json[data] type: ${json['data']?.runtimeType}');
    
    // التعامل مع format من interceptor: { code: 0, data: [...], message: "" }
    // أو format القديم: { status: int, data: [...], message: string }
    int? statusValue;
    
    // الأولوية للتحقق من 'code' لأنه يأتي من interceptor
    if (json.containsKey('code')) {
      statusValue = json['code'] is int
          ? json['code'] as int?
          : int.tryParse(json['code'].toString());
      print('Found code: $statusValue');
    } else if (json.containsKey('status')) {
      statusValue = json['status'] is int
          ? json['status'] as int?
          : int.tryParse(json['status'].toString());
      print('Found status: $statusValue');
    }
    
    List<Datum>? messagesList;
    if (json['data'] != null) {
      if (json['data'] is List) {
        final dataList = json['data'] as List;
        print('data is List, length: ${dataList.length}');
        messagesList = dataList
            .map((e) {
              print('Parsing message item: $e');
              return Datum.fromJson(e as Map<String, dynamic>);
            })
            .toList();
        print('messagesList created, length: ${messagesList.length}');
      } else {
        print('Warning: json[data] is not a List, type: ${json['data'].runtimeType}');
      }
    } else {
      print('Warning: json[data] is null');
    }
    
    final model = MyMessagesModel(
      status: statusValue,
      message: json['message'] as String?,
      data: messagesList,
    );
    print('MyMessagesModel created, data length: ${model.data?.length}');
    return model;
  }

  Map<String, dynamic> toJson() => {
        'status': status,
        'message': message,
        'data': data?.map((e) => e.toJson()).toList(),
      };
}

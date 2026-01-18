import 'package:swat_gym/core/utils/functions/base_one_response.dart';

import 'news.dart';

class MyNewsModel extends BaseOneResponse {
  const MyNewsModel({
    super.status,
    super.data,
    super.message,
  });

  factory MyNewsModel.fromJson(Map<String, dynamic> json) {
    print('=== MyNewsModel.fromJson Debug ===');
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
    } else if (json.containsKey('status')) {
      statusValue = json['status'] is int
          ? json['status'] as int?
          : int.tryParse(json['status'].toString());
    }
    
    List<News>? newsList;
    if (json['data'] != null) {
      if (json['data'] is List) {
        final dataList = json['data'] as List;
        print('data is List, length: ${dataList.length}');
        newsList = dataList
            .map((e) {
              print('Parsing news item: $e');
              return News.fromJson(e as Map<String, dynamic>);
            })
            .toList();
        print('newsList created, length: ${newsList.length}');
      } else {
        print('Warning: json[data] is not a List, type: ${json['data'].runtimeType}');
      }
    } else {
      print('Warning: json[data] is null');
    }
    
    final model = MyNewsModel(
      status: statusValue,
      message: json['message'] as String?,
      data: newsList,
    );
    print('MyNewsModel created, data length: ${model.data?.length}');
    return model;
  }

  Map<String, dynamic> toJson() => {
        'status': status,
        'message': message,
        'data': data?.map((e) => e.toJson()).toList(),
      };
}

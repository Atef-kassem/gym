import 'package:swat_gym/core/utils/functions/base_one_response.dart';

import 'exercise.dart';

class ExerciseModel extends BaseOneResponse {
  const ExerciseModel({
    super.status,
    super.data,
    super.message,
  });

  factory ExerciseModel.fromJson(Map<String, dynamic> json) {
    print('=== ExerciseModel.fromJson Debug ===');
    print('json keys: ${json.keys}');
    print('json[code]: ${json['code']}');
    print('json[status]: ${json['status']}');
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
    
    List<Exercise>? exercisesList;
    if (json['data'] != null) {
      if (json['data'] is List) {
        final dataList = json['data'] as List;
        print('data is List, length: ${dataList.length}');
        exercisesList = dataList
            .map((e) => Exercise.fromJson(e as Map<String, dynamic>))
            .toList();
        print('exercisesList created, length: ${exercisesList.length}');
      } else {
        print('Warning: json[data] is not a List, type: ${json['data'].runtimeType}');
      }
    } else {
      print('Warning: json[data] is null');
    }
    
    final model = ExerciseModel(
      status: statusValue,
      message: json['message'] as String?,
      data: exercisesList,
    );
    print('ExerciseModel created, status: ${model.status}, data length: ${model.data?.length}');
    return model;
  }

  Map<String, dynamic> toJson() => {
        'status': status,
        'message': message,
        'data': data?.map((e) => e.toJson()).toList(),
      };
}

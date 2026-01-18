import 'package:swat_gym/features/new_bsama_add_Fingerprint/data/models/finger_print_model/data.dart';

import '../../../domain/entities/new_finger_print_entity.dart';

class NewFingerPrintModel extends NewFingerPrintEntity {
  int? status;
  String? message;
  Data? data;

  NewFingerPrintModel({this.status, this.message, this.data})
      : super(
            hodoorId: data!.hodoorId,
            empCode: data.empCode,
            hdoorTime: data.hdoorTime,
            ensrafTime: data.ensrafTime,
            lateMin: data.lateMin);

  factory NewFingerPrintModel.fromJson(Map<String, dynamic> json) =>
      NewFingerPrintModel(
          status: json['status'] as int?,
          message: json['message'] as String?,
          data: json.containsKey('data')
              ? Data.fromJson(json['data'] as Map<String, dynamic>)
              : null);

  Map<String, dynamic> toJson() => {
        'status': status,
        'message': message,
        'data': data?.toJson(),
      };
}

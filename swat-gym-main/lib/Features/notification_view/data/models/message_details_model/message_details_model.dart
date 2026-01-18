import 'datum.dart';

class MessageDetailsModel {
  int? status;
  String? message;
  List<Datum>? data;

  MessageDetailsModel({this.status, this.message, this.data});

  factory MessageDetailsModel.fromJson(Map<String, dynamic> json) {
    return MessageDetailsModel(
      status: json['status'] as int?,
      message: json['message'] as String?,
      data: (json['data'] as List<dynamic>?)
          ?.map((e) => Datum.fromJson(e as Map<String, dynamic>))
          .toList(),
    );
  }

  Map<String, dynamic> toJson() => {
        'status': status,
        'message': message,
        'data': data?.map((e) => e.toJson()).toList(),
      };
}

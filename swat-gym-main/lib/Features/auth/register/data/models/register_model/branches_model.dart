import 'branches.dart';

class BranchesModel {
  int? status;
  String? message;
  List<Types>? data;

  BranchesModel({this.status, this.message, this.data});

  factory BranchesModel.fromJson(Map<String, dynamic> json) {
    return BranchesModel(
      status: json['status'] as int?,
      message: json['message'] as String?,
      data: (json['data'] as List<dynamic>?)
          ?.map((e) => Types.fromJson(e as Map<String, dynamic>))
          .toList(),
    );
  }

  Map<String, dynamic> toJson() => {
        'status': status,
        'message': message,
        'data': data?.map((e) => e.toJson()).toList(),
      };
}

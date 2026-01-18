class TokenModel {
  int? status;
  String? message;

  TokenModel({this.status, this.message}) : super();

  factory TokenModel.fromJson(Map<String, dynamic> json) => TokenModel(
        status: json['status'] as int?,
        message: json['message'] as String?,
      );

  Map<String, dynamic> toJson() => {
        'status': status,
        'message': message,
      };
}

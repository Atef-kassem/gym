import 'package:equatable/equatable.dart';

class BaseOneResponse extends Equatable {
  const BaseOneResponse(
      {this.status, this.data, this.message, this.logoutOption});

  final dynamic data;
  final String? message;
  final int? status;
  final int? logoutOption;

  @override
  List<Object?> get props => [data, message, status, logoutOption];
}

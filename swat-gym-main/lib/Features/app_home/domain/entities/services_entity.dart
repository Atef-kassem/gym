import 'package:equatable/equatable.dart';

class ServicesEntity extends Equatable {
  final String? testModeTitle;
  final int? testModeType;
  final int? status;
  final String? message;
  final List<ServiceEntity>? data;

  const ServicesEntity({
    this.testModeTitle,
    this.testModeType,
    this.status,
    this.message,
    this.data,
  });

  @override
  List<Object?> get props =>
      [testModeTitle, testModeType, status, message, data];
}

class ServiceEntity extends Equatable {
  final String? id;
  final String? title;
  final String? active;
  final String? pageOrder;
  final String? screenNum;
  final String? icon;

  const ServiceEntity(
      {this.id,
      this.title,
      this.active,
      this.pageOrder,
      this.screenNum,
      this.icon});
  @override
  List<Object?> get props => [id, title, active, pageOrder, screenNum, icon];
}

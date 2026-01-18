import 'package:equatable/equatable.dart';

class TypesEntity extends Equatable {
  final String? branchId;
  final String? branchName;
  final String? fromId;

  const TypesEntity({this.branchId, this.branchName, this.fromId});

  @override
  List<Object?> get props => [branchId, branchName, fromId];
}

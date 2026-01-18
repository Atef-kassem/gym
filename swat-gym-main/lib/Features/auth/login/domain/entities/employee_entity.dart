import 'package:equatable/equatable.dart';
import 'package:hive/hive.dart';

part 'employee_entity.g.dart';

typedef EmployeesList = List<EmployeeEntity>;

@HiveType(typeId: 1)
class EmployeeEntity extends Equatable {
  @HiveField(0)
  final String? memId;
  @HiveField(1)
  final String? mCode;
  @HiveField(2)
  final String? gender;
  @HiveField(3)
  final String? phone;
  @HiveField(4)
  final String? image;
  @HiveField(5)
  final String? blocked;
  @HiveField(6)
  final String? branchIdFk;
  @HiveField(7)
  final String? active;
  @HiveField(8)
  final String? branchName;
  @HiveField(9)
  final String? imgPath;
  @HiveField(10)
  final String? name;
  @HiveField(11)
  final String? barcodePath;

  const EmployeeEntity(
      {this.memId,
      this.mCode,
      this.gender,
      this.phone,
      this.image,
      this.blocked,
      this.branchIdFk,
      this.active,
      this.branchName,
      this.imgPath,
      this.name,
      this.barcodePath});

  @override
  List<Object?> get props => [
        memId,
        mCode,
        gender,
        phone,
        image,
        blocked,
        branchIdFk,
        active,
        branchName,
        imgPath,
        name,
        barcodePath
      ];
}

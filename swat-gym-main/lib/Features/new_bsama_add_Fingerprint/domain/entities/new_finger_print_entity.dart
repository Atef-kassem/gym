import 'package:hive/hive.dart';

part 'new_finger_print_entity.g.dart';

@HiveType(typeId: 20)
class NewFingerPrintEntity {
  @HiveField(0)
  final dynamic hodoorId;
  @HiveField(1)
  final dynamic empCode;
  @HiveField(2)
  final dynamic hdoorTime;
  @HiveField(3)
  final dynamic ensrafTime;
  @HiveField(4)
  final dynamic lateMin;

  NewFingerPrintEntity(
      {required this.hodoorId,
      required this.empCode,
      required this.hdoorTime,
      required this.ensrafTime,
      required this.lateMin});
}

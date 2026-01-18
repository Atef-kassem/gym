import 'package:hive/hive.dart';

@HiveType(typeId: 4)
class CalenderEntity {
  @HiveField(0)
  final String attendanceTime;
  @HiveField(1)
  final String leavingTime;
  @HiveField(2)
  final String dayName;
  @HiveField(3)
  final int hours;
  @HiveField(4)
  final int minutes;
  @HiveField(5)
  final String date;
  @HiveField(6)
  final String type;

  CalenderEntity({
    required this.attendanceTime,
    required this.leavingTime,
    required this.dayName,
    required this.hours,
    required this.minutes,
    required this.date,
    required this.type,
  });
}

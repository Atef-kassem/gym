typedef CalenderList = List<Data>?;

class CalenderModel {
  List<Data>? data;
  int? status;
  String? message;

  CalenderModel({this.data, this.status, this.message});

  CalenderModel.fromJson(Map<String, dynamic> json) {
    if (json['data'] != null) {
      data = <Data>[];
      json['data'].forEach((v) {
        data!.add(Data.fromJson(v));
      });
    }
    status = json['status'];
    message = json['message'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    if (this.data != null) {
      data['data'] = this.data!.map((v) => v.toJson()).toList();
    }
    data['status'] = status;
    data['message'] = message;
    return data;
  }
}

class Data {
  String? id;
  String? employee;
  String? empCode;
  int? day1;
  int? day2;
  int? day3;
  int? day4;
  int? day5;
  int? day6;
  int? day7;
  int? day8;
  int? day9;
  int? day10;
  int? day11;
  int? day12;
  int? day13;
  int? day14;
  int? day15;
  int? day16;
  int? day17;
  int? day18;
  int? day19;
  int? day20;
  int? day21;
  int? day22;
  int? day23;
  int? day24;
  int? day25;
  int? day26;
  int? day27;
  int? day28;
  int? day29;
  int? day30;

  Data(
      {this.id,
      this.employee,
      this.empCode,
      this.day1,
      this.day2,
      this.day3,
      this.day4,
      this.day5,
      this.day6,
      this.day7,
      this.day8,
      this.day9,
      this.day10,
      this.day11,
      this.day12,
      this.day13,
      this.day14,
      this.day15,
      this.day16,
      this.day17,
      this.day18,
      this.day19,
      this.day20,
      this.day21,
      this.day22,
      this.day23,
      this.day24,
      this.day25,
      this.day26,
      this.day27,
      this.day28,
      this.day29,
      this.day30});

  Data.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    employee = json['employee'];
    empCode = json['emp_code'];
    day1 = json['day1'];
    day2 = json['day2'];
    day3 = json['day3'];
    day4 = json['day4'];
    day5 = json['day5'];
    day6 = json['day6'];
    day7 = json['day7'];
    day8 = json['day8'];
    day9 = json['day9'];
    day10 = json['day10'];
    day11 = json['day11'];
    day12 = json['day12'];
    day13 = json['day13'];
    day14 = json['day14'];
    day15 = json['day15'];
    day16 = json['day16'];
    day17 = json['day17'];
    day18 = json['day18'];
    day19 = json['day19'];
    day20 = json['day20'];
    day21 = json['day21'];
    day22 = json['day22'];
    day23 = json['day23'];
    day24 = json['day24'];
    day25 = json['day25'];
    day26 = json['day26'];
    day27 = json['day27'];
    day28 = json['day28'];
    day29 = json['day29'];
    day30 = json['day30'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['id'] = id;
    data['employee'] = employee;
    data['emp_code'] = empCode;
    data['day1'] = day1;
    data['day2'] = day2;
    data['day3'] = day3;
    data['day4'] = day4;
    data['day5'] = day5;
    data['day6'] = day6;
    data['day7'] = day7;
    data['day8'] = day8;
    data['day9'] = day9;
    data['day10'] = day10;
    data['day11'] = day11;
    data['day12'] = day12;
    data['day13'] = day13;
    data['day14'] = day14;
    data['day15'] = day15;
    data['day16'] = day16;
    data['day17'] = day17;
    data['day18'] = day18;
    data['day19'] = day19;
    data['day20'] = day20;
    data['day21'] = day21;
    data['day22'] = day22;
    data['day23'] = day23;
    data['day24'] = day24;
    data['day25'] = day25;
    data['day26'] = day26;
    data['day27'] = day27;
    data['day28'] = day28;
    data['day29'] = day29;
    data['day30'] = day30;
    return data;
  }
}

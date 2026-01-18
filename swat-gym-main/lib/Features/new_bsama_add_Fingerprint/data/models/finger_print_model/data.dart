class Data {
  dynamic hodoorId;
  dynamic empCode;
  dynamic hdoorTime;
  dynamic ensrafTime;
  dynamic lateMin;

  Data(
      {this.hodoorId,
      this.empCode,
      this.hdoorTime,
      this.ensrafTime,
      this.lateMin});

  factory Data.fromJson(Map<String, dynamic> json) => Data(
        hodoorId: json['hodoor_id'],
        empCode: json['emp_code'],
        hdoorTime: json['hdoor_time'],
        ensrafTime: json['ensraf_time'],
        lateMin: json['late_min'],
      );

  Map<String, dynamic> toJson() => {
        'hodoor_id': hodoorId,
        'emp_code': empCode,
        'hdoor_time': hdoorTime,
        'ensraf_time': ensrafTime,
        'late_min': lateMin
      };
}

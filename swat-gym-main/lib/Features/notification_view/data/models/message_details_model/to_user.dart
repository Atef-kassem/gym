class ToUser {
  String? detailId;
  String? toUserId;
  String? seen;
  dynamic seenDate;
  dynamic seenTime;
  String? toEmployeeName;
  String? toEmployeeEdaraName;
  String? toEmployeeQsmName;
  String? toEmployeeMosmaWazefyName;
  String? personalPhoto;
  String? toEmpImg;

  ToUser({
    this.detailId,
    this.toUserId,
    this.seen,
    this.seenDate,
    this.seenTime,
    this.toEmployeeName,
    this.toEmployeeEdaraName,
    this.toEmployeeQsmName,
    this.toEmployeeMosmaWazefyName,
    this.personalPhoto,
    this.toEmpImg,
  });

  factory ToUser.fromJson(Map<String, dynamic> json) => ToUser(
        detailId: json['detail_id'] as String?,
        toUserId: json['to_user_id'] as String?,
        seen: json['seen'] as String?,
        seenDate: json['seen_date'] as dynamic,
        seenTime: json['seen_time'] as dynamic,
        toEmployeeName: json['to_employee_name'] as String?,
        toEmployeeEdaraName: json['to_employee_edara_name'] as String?,
        toEmployeeQsmName: json['to_employee_qsm_name'] as String?,
        toEmployeeMosmaWazefyName:
            json['to_employee_mosma_wazefy_name'] as String?,
        personalPhoto: json['personal_photo'] as String?,
        toEmpImg: json['to_emp_img'] as String?,
      );

  Map<String, dynamic> toJson() => {
        'detail_id': detailId,
        'to_user_id': toUserId,
        'seen': seen,
        'seen_date': seenDate,
        'seen_time': seenTime,
        'to_employee_name': toEmployeeName,
        'to_employee_edara_name': toEmployeeEdaraName,
        'to_employee_qsm_name': toEmployeeQsmName,
        'to_employee_mosma_wazefy_name': toEmployeeMosmaWazefyName,
        'personal_photo': personalPhoto,
        'to_emp_img': toEmpImg,
      };
}

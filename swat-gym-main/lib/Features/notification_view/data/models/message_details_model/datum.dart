import 'to_user.dart';

typedef MessageDetailsList = List<Datum>?;

class Datum {
  String? msgId;
  String? msgDate;
  String? msgTime;
  String? subject;
  String? message;
  String? file;
  String? fromEmployeeName;
  String? fromEmployeeEdaraName;
  String? fromEmployeeQsmName;
  String? fromEmployeeMosmaWazefyName;
  String? personalPhoto;
  String? fromEmpImg;
  List<ToUser>? toUsers;

  Datum({
    this.msgId,
    this.msgDate,
    this.msgTime,
    this.subject,
    this.message,
    this.file,
    this.fromEmployeeName,
    this.fromEmployeeEdaraName,
    this.fromEmployeeQsmName,
    this.fromEmployeeMosmaWazefyName,
    this.personalPhoto,
    this.fromEmpImg,
    this.toUsers,
  });

  factory Datum.fromJson(Map<String, dynamic> json) => Datum(
        msgId: json['msg_id'] as String?,
        msgDate: json['msg_date'] as String?,
        msgTime: json['msg_time'] as String?,
        subject: json['subject'] as String?,
        message: json['message'] as String?,
        file: json['file'] as String?,
        fromEmployeeName: json['from_employee_name'] as String?,
        fromEmployeeEdaraName: json['from_employee_edara_name'] as String?,
        fromEmployeeQsmName: json['from_employee_qsm_name'] as String?,
        fromEmployeeMosmaWazefyName:
            json['from_employee_mosma_wazefy_name'] as String?,
        personalPhoto: json['personal_photo'] as String?,
        fromEmpImg: json['from_emp_img'] as String?,
        toUsers: (json['to_users'] as List<dynamic>?)
            ?.map((e) => ToUser.fromJson(e as Map<String, dynamic>))
            .toList(),
      );

  Map<String, dynamic> toJson() => {
        'msg_id': msgId,
        'msg_date': msgDate,
        'msg_time': msgTime,
        'subject': subject,
        'message': message,
        'file': file,
        'from_employee_name': fromEmployeeName,
        'from_employee_edara_name': fromEmployeeEdaraName,
        'from_employee_qsm_name': fromEmployeeQsmName,
        'from_employee_mosma_wazefy_name': fromEmployeeMosmaWazefyName,
        'personal_photo': personalPhoto,
        'from_emp_img': fromEmpImg,
        'to_users': toUsers?.map((e) => e.toJson()).toList(),
      };
}

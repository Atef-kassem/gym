typedef AllMessagesList = List<Datum>?;

class Datum {
  int? msgId;
  String? msgDate;
  String? msgTime;
  String? subject;
  String? message;
 dynamic file;
  String? toEmployeeName;
  dynamic toEmployeeEdaraName;
  dynamic toEmployeeQsmName;
  String? toEmployeeMosmaWazefyName;
  String? toEmpPersonalPhoto;
  String? fromEmployeeName;
  String? fromEmployeeEdaraName;
  String? fromEmployeeQsmName;
  String? fromEmployeeMosmaWazefyName;
  String? fromEmpPersonalPhoto;
  int? detailId;
  int? toUserId;
  int? seen;
  dynamic seenDate;
  dynamic seenTime;
  int? deleted;
  String? toEmpImg;
  String? fromEmpImg;

  Datum({
    this.msgId,
    this.msgDate,
    this.msgTime,
    this.subject,
    this.message,
    this.file,
    this.toEmployeeName,
    this.toEmployeeEdaraName,
    this.toEmployeeQsmName,
    this.toEmployeeMosmaWazefyName,
    this.toEmpPersonalPhoto,
    this.fromEmployeeName,
    this.fromEmployeeEdaraName,
    this.fromEmployeeQsmName,
    this.fromEmployeeMosmaWazefyName,
    this.fromEmpPersonalPhoto,
    this.detailId,
    this.toUserId,
    this.seen,
    this.seenDate,
    this.seenTime,
    this.deleted,
    this.toEmpImg,
    this.fromEmpImg,
  });

  factory Datum.fromJson(Map<String, dynamic> json) {
    print('=== Datum.fromJson Debug ===');
    print('json keys: ${json.keys}');
    
    // دعم البنية الجديدة من AppMessage API
    // الحقول الجديدة: id, notificationType, receiverId, title, content, imageUrl, isRead, readAt, createdAt, updatedAt
    // الحقول القديمة: msg_id, msg_date, msg_time, subject, message, seen, إلخ
    
    // محاولة قراءة الحقول الجديدة أولاً
    int? id = json['id'] as int?;
    String? title = json['title'] as String?;
    String? content = json['content'] as String?;
    String? imageUrl = json['imageUrl'] as String?;
    bool? isRead = json['isRead'] as bool?;
    String? readAt = json['readAt'] as String?;
    String? createdAt = json['createdAt'] as String?;
    String? updatedAt = json['updatedAt'] as String?;
    String? notificationType = json['notificationType'] as String?;
    int? receiverId = json['receiverId'] as int?;
    
    // إذا كانت البيانات من البنية الجديدة، نحولها للبنية القديمة
    if (id != null) {
      // تحويل createdAt إلى msg_date و msg_time
      String? msgDate;
      String? msgTime;
      if (createdAt != null) {
        try {
          final dateTime = DateTime.parse(createdAt);
          msgDate = '${dateTime.year}-${dateTime.month.toString().padLeft(2, '0')}-${dateTime.day.toString().padLeft(2, '0')}';
          msgTime = '${dateTime.hour.toString().padLeft(2, '0')}:${dateTime.minute.toString().padLeft(2, '0')}:${dateTime.second.toString().padLeft(2, '0')}';
        } catch (e) {
          print('Error parsing createdAt: $e');
        }
      }
      
      return Datum(
        msgId: id,
        msgDate: msgDate,
        msgTime: msgTime,
        subject: title,
        message: content,
        file: imageUrl,
        seen: isRead == true ? 1 : 0,
        seenDate: readAt != null ? readAt.split('T')[0] : null,
        seenTime: readAt != null ? readAt.split('T')[1].split('.')[0] : null,
        toUserId: receiverId,
        deleted: json['isDeleted'] == true ? 1 : 0,
        // الحقول الأخرى تبقى null للبنية الجديدة
      );
    }
    
    // إذا كانت البيانات من البنية القديمة، نستخدمها كما هي
    return Datum(
      msgId: json['msg_id'] as int?,
      msgDate: json['msg_date'] as String?,
      msgTime: json['msg_time'] as String?,
      subject: json['subject'] as String?,
      message: json['message'] as String?,
      file: json['file'] as String?,
      toEmployeeName: json['to_employee_name'] as String?,
      toEmployeeEdaraName: json['to_employee_edara_name'] as String?,
      toEmployeeQsmName: json['to_employee_qsm_name'] as String?,
      toEmployeeMosmaWazefyName:
          json['to_employee_mosma_wazefy_name'] as String?,
      toEmpPersonalPhoto: json['to_emp_personal_photo'] as String?,
      fromEmployeeName: json['from_employee_name'] as String?,
      fromEmployeeEdaraName: json['from_employee_edara_name'] as String?,
      fromEmployeeQsmName: json['from_employee_qsm_name'] as String?,
      fromEmployeeMosmaWazefyName:
          json['from_employee_mosma_wazefy_name'] as String?,
      fromEmpPersonalPhoto: json['from_emp_personal_photo'] as String?,
      detailId: json['detail_id'] as int?,
      toUserId: json['to_user_id'] as int?,
      seen: json['seen'] as int?,
      seenDate: json['seen_date'] as String?,
      seenTime: json['seen_time'] as String?,
      deleted: json['deleted'] as int?,
      toEmpImg: json['to_emp_img'] as String?,
      fromEmpImg: json['from_emp_img'] as String?,
    );
  }

  Map<String, dynamic> toJson() => {
        'msg_id': msgId,
        'msg_date': msgDate,
        'msg_time': msgTime,
        'subject': subject,
        'message': message,
        'file': file,
        'to_employee_name': toEmployeeName,
        'to_employee_edara_name': toEmployeeEdaraName,
        'to_employee_qsm_name': toEmployeeQsmName,
        'to_employee_mosma_wazefy_name': toEmployeeMosmaWazefyName,
        'to_emp_personal_photo': toEmpPersonalPhoto,
        'from_employee_name': fromEmployeeName,
        'from_employee_edara_name': fromEmployeeEdaraName,
        'from_employee_qsm_name': fromEmployeeQsmName,
        'from_employee_mosma_wazefy_name': fromEmployeeMosmaWazefyName,
        'from_emp_personal_photo': fromEmpPersonalPhoto,
        'detail_id': detailId,
        'to_user_id': toUserId,
        'seen': seen,
        'seen_date': seenDate,
        'seen_time': seenTime,
        'deleted': deleted,
        'to_emp_img': toEmpImg,
        'from_emp_img': fromEmpImg,
      };
}

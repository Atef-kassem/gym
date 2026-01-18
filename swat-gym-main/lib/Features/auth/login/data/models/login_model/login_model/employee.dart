import '../../../../domain/entities/employee_entity.dart';

class Employee extends EmployeeEntity {
  const Employee({
    super.image,
    super.active,
    super.blocked,
    super.branchIdFk,
    super.branchName,
    super.gender,
    super.imgPath,
    super.mCode,
    super.memId,
    super.phone,
    super.name,
    super.barcodePath,
  });

  factory Employee.fromJson(Map<String, dynamic> json) => Employee(
        // دعم format القديم والجديد
        image: json['emp_img'] ?? json['profilePicture'],
        active: json['active']?.toString() ??
            json['isActive']?.toString() ??
            json['status']?.toString(),
        blocked: json['blocked']?.toString(),
        branchIdFk: json['branch_id_fk']?.toString() ??
            json['branchId']?.toString(),
        branchName: json['branch_name'] ??
            (json['branch'] is Map<String, dynamic>
                ? (json['branch']['arabicName']?.toString() ??
                    json['branch']['englishName']?.toString())
                : json['branch']?.toString()),
        gender: json['gender']?.toString(),
        imgPath: json['img_path'] ?? json['profilePicture'],
        mCode: json['m_code']?.toString() ?? json['memberCode']?.toString(),
        memId: json['mem_id']?.toString() ?? json['id']?.toString(),
        phone: json['phone']?.toString() ??
            json['phoneNumber']?.toString() ??
            json['mobile']?.toString(),
        name: json['name']?.toString() ?? json['arabicName']?.toString(),
        barcodePath:
            json['barcode_path'] ?? json['barcodePath'] ?? json['qrcodePath'],
      );

  Map<String, dynamic> toJson() => {
        'emp_img': image,
        'active': active,
        'blocked': blocked,
        'branch_id_fk': branchIdFk,
        'branch_name': branchName,
        'gender': gender,
        'img_path': imgPath,
        'm_code': mCode,
        'mem_id': memId,
        'phone': phone,
        'name': name,
        'barcode_path': barcodePath
      };
}

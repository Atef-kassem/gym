import 'package:swat_gym/features/auth/register/domain/entities/branches_entity.dart';

typedef TypeBranchesList = List<TypesEntity>?;

class Types extends TypesEntity {
  const Types({
    super.branchId,
    super.branchName,
    super.fromId,
  });

  factory Types.fromJson(Map<String, dynamic> json) => Types(
        branchId: json['branch_id'],
        branchName: json['branch_name'],
        fromId: json['from_id'],
      );

  Map<String, dynamic> toJson() => {
        'branch_id': branchId,
        'branch_name': branchName,
        'from_id': fromId,
      };
}

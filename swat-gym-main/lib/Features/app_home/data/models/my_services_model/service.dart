import 'package:swat_gym/features/app_home/domain/entities/services_entity.dart';

typedef AllServicesList = List<ServicesEntity>?;

class Service extends ServiceEntity {
  const Service({
    super.id,
    super.title,
    super.active,
    super.pageOrder,
    super.screenNum,
    super.icon,
  });

  factory Service.fromJson(Map<String, dynamic> json) => Service(
        id: json['id'],
        title: json['title'],
        active: json['active'],
        pageOrder: json['page_order'],
        screenNum: json['screen_num'],
        icon: json['icon_path'],
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'title': title,
        'active': active,
        'page_order': pageOrder,
        'screen_num': screenNum,
        'icon_path': icon,
      };
}

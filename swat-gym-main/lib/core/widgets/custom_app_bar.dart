import 'package:flutter/material.dart';
import 'package:hive/hive.dart';

import '../../features/auth/login/domain/entities/employee_entity.dart';
import '../locale/app_localizations.dart';
import '../utils/constants.dart';
import 'custom_cached_network_image.dart';

class CustomAppBar extends StatelessWidget {
  const CustomAppBar({
    super.key,
    this.icon = const Icon(Icons.notifications_none_sharp),
  });

  final Widget icon;

  @override
  Widget build(BuildContext context) {
    var box = Hive.box<EmployeeEntity>(kEmployeeDataBox);

    return AppBar(
        elevation: 0.0,
        backgroundColor: Colors.white,
        actions: [
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: IconButton(
              onPressed: () {
                Navigator.pop(context);
              },
              icon: icon,
              color: Colors.grey[700],
            ),
          )
        ],
        leading: Padding(
          padding: const EdgeInsets.all(8.0),
          child: GestureDetector(
            onTap: () {
              Navigator.pushNamed(context, kPersonalAccountScreenRoute);
            },
            child: ClipRRect(
                borderRadius: BorderRadius.circular(40.0),
                child: CustomCashedNetworkImage(
                  imageUrl: box.get(kEmployeeDataBox) != null
                      ? box.get(kEmployeeDataBox)!.imgPath!
                      : "",
                )),
          ),
        ),
        title: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(
            AppLocalizations.of(context)!.translate("welcome")!,
            style: const TextStyle(color: Color(0xff9d9d9e), fontSize: 12),
          ),
          Text(
              box.get(kEmployeeDataBox) != null
                  ? box.get(kEmployeeDataBox)!.name!
                  : " ",
              style: const TextStyle(color: Color(0xff1d1d1d), fontSize: 13)),
        ]));
  }
}

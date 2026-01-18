import 'package:flutter/material.dart';
import 'package:swat_gym/core/utils/constants.dart';
import 'package:swat_gym/features/app_home/presentation/views/widgets/method_item.dart';
import 'package:swat_gym/features/auth/login/domain/entities/employee_entity.dart';
import 'package:hive/hive.dart';

class AppBarHome extends StatelessWidget {
  const AppBarHome({
    super.key,
    required this.box,
  });

  final Box<EmployeeEntity> box;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(8.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              Column(
                mainAxisAlignment: MainAxisAlignment.start,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    "مرحبا",
                  ),
                  Text(
                    box.get(kEmployeeDataBox)!.name!,
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 15,
                    ),
                  ),
                ],
              ),
              // Gaps.hGap5,
              // Container(
              //   width: MediaQuery.of(context).size.width * .13,
              //   height: MediaQuery.of(context).size.height * .07,
              //   decoration: BoxDecoration(
              //       border: Border.all(color: kPrimaryColor, width: 2),
              //       color: kPrimaryColor.withOpacity(0.2),
              //       borderRadius: BorderRadius.circular(45),
              //       image: DecorationImage(
              //         image: NetworkImage(
              //           box.get(kEmployeeDataBox) != null
              //               ? box.get(kEmployeeDataBox)!.imgPath!
              //               : "",
              //         ),
              //       )),
              // ),
            ],
          ),
          Row(
            children: [
              GestureDetector(
                onTap: () {
                  Navigator.pushNamed(context, kNotificationScreenRoute);
                },
                child: const MethodItem(
                  width: 35,
                  height: 30,
                  image: "assets/images/notification 01.svg",
                ),
              ),
              // const SizedBox(
              //   width: 5,
              // ),
              // const MethodItem(
              //   width: 35,
              //   height: 30,
              //   image: "assets/images/Frame.svg",
              // ),
            ],
          ),
        ],
      ),
    );
  }
}

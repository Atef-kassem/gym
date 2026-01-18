import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:swat_gym/core/utils/constants.dart';
import 'package:swat_gym/core/utils/gaps.dart';
import 'package:swat_gym/features/my_subscribtions/domain/entities/my_subscribtions_entity.dart';
import 'package:swat_gym/features/my_subscribtions/presentation/views/widgets/row_item.dart';

class MySubscribtionsDetailsBody extends StatelessWidget {
  final MySubscribtionsEntity mySubscribtionsEntity;

  const MySubscribtionsDetailsBody(
      {super.key, required this.mySubscribtionsEntity});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Container(
            margin: const EdgeInsets.all(20.0),
            decoration: BoxDecoration(
              color: Colors.grey[100],
              borderRadius: BorderRadius.circular(20.0),
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.start,
              children: [
                Container(
                    height: 50.h,
                    width: double.infinity,
                    padding: const EdgeInsets.all(20.0),
                    decoration: BoxDecoration(
                      color: Colors.red.shade200.withOpacity(.6),
                      borderRadius: BorderRadius.circular(10.0),
                    ),
                    child: Text(mySubscribtionsEntity.subsName ?? "")),
                Gaps.vGap30,
                Padding(
                  padding: const EdgeInsets.all(15.0),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.start,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              "بدايه الاشتراك",
                              style: TextStyle(
                                fontSize: 12.0,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            Text(
                              "نهايه الاشتراك",
                              style: TextStyle(
                                fontSize: 12.0,
                                fontWeight: FontWeight.bold,
                                color: Colors.black,
                              ),
                            ),
                          ]),
                      Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            IconText(
                                image: "assets/icon/calender_icon.png",
                                text: mySubscribtionsEntity.fromDateAr
                                    .toString()),
                            IconText(
                                image: "assets/icon/money_icon.png",
                                text: "${mySubscribtionsEntity.toDateAr} "),
                          ]),
                      Gaps.vGap30,
                      const Text(
                        "قيمه الاشتراك",
                        style: TextStyle(
                          fontSize: 12.0,
                          fontWeight: FontWeight.bold,
                          color: Colors.black,
                        ),
                      ),
                      IconText(
                          image: "assets/icon/money_icon.png",
                          text:
                              "${mySubscribtionsEntity.price.toString()} جـنـيـه"),
                      Gaps.vGap30,
                      mySubscribtionsEntity.captainName != null
                          ? Column(
                              children: [
                                const Text(
                                  "اسم المدرب",
                                  style: TextStyle(
                                    fontSize: 12.0,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                Text(
                                  "${mySubscribtionsEntity.captainName.toString()} ",
                                  style: const TextStyle(
                                    fontSize: 12.0,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.black,
                                  ),
                                ),
                              ],
                            )
                          : const SizedBox(),
                      Gaps.vGap20,
                      mySubscribtionsEntity.stopFromAr != null
                          ? Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              mainAxisAlignment: MainAxisAlignment.start,
                              children: [
                                const Text(
                                  "ايام الوقف",
                                  style: TextStyle(
                                    fontSize: 12.0,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                Gaps.vGap10,
                                IconText(
                                    image: "assets/icon/money_icon.png",
                                    text:
                                        "${mySubscribtionsEntity.stopFromAr.toString()}  - ${mySubscribtionsEntity.stopToAr.toString()} "),
                              ],
                            )
                          : const SizedBox()
                    ],
                  ),
                ),
                const Padding(
                  padding: EdgeInsets.all(8.0),
                  child: Divider(
                      // height: 2,
                      thickness: 1,
                      color: Colors.grey),
                ),
                mySubscribtionsEntity.haveEgraaStop != "0"
                    ? const SizedBox()
                    : ElevatedButton(
                        onPressed: () {
                          Navigator.pushNamed(
                              context, kStopedSubscribtionsScreen,
                              arguments: mySubscribtionsEntity);
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: kPrimaryColor,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(8),
                          ),
                        ),
                        child: const Text(
                          'وقف الاشتراك',
                          style: TextStyle(color: Colors.white, fontSize: 16),
                        ),
                      ),
                Gaps.vGap20
              ],
            ))
      ],
    );
  }
  //
}

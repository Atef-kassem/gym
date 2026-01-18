import 'package:flutter/material.dart';
import 'package:swat_gym/core/utils/constants.dart';
import 'package:swat_gym/core/utils/gaps.dart';
import 'package:swat_gym/features/my_subscribtions/presentation/views/widgets/row_item.dart';

import '../../../data/models/my_messages_model/my_subscribtions.dart';

class MySubscribtionsListItem extends StatelessWidget {
  const MySubscribtionsListItem({
    super.key,
    required this.ta3amemList,
    required this.itemIndex,
  });
  final AllSubscribtionsList ta3amemList;
  final int itemIndex;
  @override
  Widget build(BuildContext context) {
    final List<Color> colors = [
      Colors.red.shade200.withOpacity(.7),
      Colors.red.shade100,
      Colors.red.shade100.withOpacity(.7),
      Colors.red.shade50,
      Colors.red.shade50.withOpacity(.7),
    ];
    return Padding(
      padding: const EdgeInsets.only(bottom: 20.0),
      child: Row(
        children: [
          RotatedBox(
            quarterTurns: 1,
            child: Container(
              alignment: Alignment.center,
              width: MediaQuery.of(context).size.width / 3.5,
              padding: const EdgeInsets.symmetric(vertical: 10),
              decoration: BoxDecoration(
                borderRadius: const BorderRadius.all(
                  Radius.circular(10),
                ),
                color: colors[itemIndex % colors.length],
              ),
              child: Text(
                ta3amemList![itemIndex].subsName ?? "",
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(fontSize: 12),
              ),
            ),
          ),
          Container(
              width: MediaQuery.of(context).size.width -
                  MediaQuery.of(context).size.width / 6.5,
              height: MediaQuery.of(context).size.width / 3.5,
              padding: const EdgeInsets.all(15),
              alignment: Alignment.center,
              decoration: BoxDecoration(
                color: colors[itemIndex % colors.length],
                borderRadius: BorderRadius.circular(15),
              ),
              child: Column(
                children: [
                  Row(children: [
                    IconText(
                        image: "assets/icon/calender_icon.png",
                        text: ta3amemList![itemIndex].fromDateAr.toString()),
                    const Spacer(),
                    IconText(
                        image: "assets/icon/money_icon.png",
                        text: "${ta3amemList![itemIndex].price} جـنـيـه"),
                  ]),
                  Gaps.vGap12,
                  Gaps.vGap20,
                  Row(
                    children: [
                      IconText(
                          image: "assets/icon/calender_icon.png",
                          text: ta3amemList![itemIndex].toDateAr ?? ""),
                      const Spacer(),
                      Text("التفاصيل",
                          style: TextStyle(
                            fontSize: 15,
                            color: kPrimaryColor,
                            fontWeight: FontWeight.bold,
                          )),
                    ],
                  ),
                ],
              )),
        ],
      ),
    );
  }
}

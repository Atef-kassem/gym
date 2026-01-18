import 'package:flutter/material.dart';
import 'package:swat_gym/core/utils/gaps.dart';
import 'package:swat_gym/core/utils/hex_color.dart';
import '../../../data/models/my_messages_model/subscribtions.dart';

class AllSubscribtionsListItem extends StatelessWidget {
  const AllSubscribtionsListItem({
    super.key,
    required this.ta3amemList,
    required this.itemIndex,
  });
  final AllSubscribtionsList ta3amemList;
  final int itemIndex;
  @override
  Widget build(BuildContext context) {
    //   boxCode = Hive.box<CodeEntity>(kCodeDataBox);
    return Container(
        //    height: MediaQuery.of(context).size.height * .5,
        alignment: Alignment.center,
        decoration: BoxDecoration(
          color: itemIndex.isOdd ? HexColor("FBDDDD") : HexColor("FFF5F5"),
          borderRadius: BorderRadius.circular(10),
        ),
        child: Column(
          children: [
            Container(
              alignment: Alignment.center,
              width: MediaQuery.of(context).size.width,
              padding: const EdgeInsets.symmetric(vertical: 10),
              decoration: BoxDecoration(
                borderRadius: const BorderRadius.only(
                    topLeft: Radius.circular(10),
                    topRight: Radius.circular(10)),
                color:
                    itemIndex.isOdd ? HexColor("AC96DE") : HexColor("FFD1D1"),
              ),
              child: Text(
                "${ta3amemList![itemIndex].numDays.toString()} يوم",
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(fontSize: 12),
              ),
            ),
            Gaps.vGap12,
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 7.0),
              child: Text(
                ta3amemList![itemIndex].title.toString(),
                overflow: TextOverflow.ellipsis,
                maxLines: 2,
                style: const TextStyle(fontSize: 12),
              ),
            ),
            Gaps.vGap20,
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  ta3amemList![itemIndex].price.toString(),

                  //  overflow: TextOverflow.ellipsis,
                  style: TextStyle(fontSize: 15, color: HexColor("653CC2")),
                ),
                const Text(
                  " جـنـيـه",
                  //  overflow: TextOverflow.ellipsis,
                  style: TextStyle(fontSize: 15),
                ),
              ],
            ),
          ],
        ));
  }
}

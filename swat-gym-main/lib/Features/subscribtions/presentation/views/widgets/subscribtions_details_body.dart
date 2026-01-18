import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:swat_gym/core/utils/commons.dart';
import 'package:swat_gym/core/utils/constants.dart';
import 'package:swat_gym/core/utils/gaps.dart';
import 'package:swat_gym/core/utils/hex_color.dart';
import 'package:swat_gym/features/subscribtions/domain/entities/subscribtions_entity.dart';

class SubscribtionsDetailsBody extends StatelessWidget {
  final SubscribtionsEntity subscribtionsEntity;

  const SubscribtionsDetailsBody(
      {super.key, required this.subscribtionsEntity});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Stack(
          children: [
            CachedNetworkImage(
              errorWidget: (context, url, error) => Image.asset(
                "assets/images/slider.png",
                height: 180,
                width: 200,
                fit: BoxFit.fill,
              ),
              progressIndicatorBuilder: (context, url, progress) => Center(
                child: CircularProgressIndicator(
                    value: progress.progress, color: kPrimaryColor),
              ),
              imageUrl: subscribtionsEntity.imagePath ?? "",
              height: 200,
              width: double.infinity,
              fit: BoxFit.fill,
            ),
            Align(
              alignment: Alignment.topLeft,
              child: Padding(
                padding:
                    const EdgeInsets.symmetric(vertical: 10, horizontal: 10),
                child: GestureDetector(
                  onTap: () {
                    Navigator.pop(context);
                  },
                  child: const Icon(
                    FontAwesomeIcons.circleArrowLeft,
                    size: 30,
                    color: Colors.white,
                  ),
                ),
              ),
            ),
          ],
        ),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 36),
          child: Container(
            height: 45,
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: const BorderRadius.all(Radius.circular(10)),
              boxShadow: [
                BoxShadow(
                  color: Colors.grey.withOpacity(0.5),
                  spreadRadius: 5,
                  blurRadius: 7,
                  offset: const Offset(0, 3), // changes position of shadow
                ),
              ],
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const SizedBox(
                  width: 50,
                ),
                Image.asset(
                  "assets/icon/price_icon.png",
                  height: 17,
                  color: Colors.black,
                ),
                const SizedBox(
                  width: 10,
                ),
                Text(
                  "${subscribtionsEntity.price ?? "0"} جـنـيـه",
                  style: TextStyle(
                    color: Colors.grey[800],
                  ),
                ),

                const SizedBox(
                  width: 25,
                ),
                Text(
                  '|',
                  style: TextStyle(
                    fontSize: 20,
                    color: Colors.grey[800],
                  ),
                ),
                const SizedBox(
                  width: 25,
                ),
                // const SizedBox(height: 4),
                // SvgPicture.asset(
                //   "assets/images/calories.svg",
                //   height: 15,
                //   color: Colors.grey[700],
                // ),
                const SizedBox(
                  width: 10,
                ),
                Text(
                  '${subscribtionsEntity.specialToStd ?? ""}   ',
                  style: TextStyle(
                    color: Colors.grey[800],
                  ),
                ),

                const SizedBox(
                  width: 50,
                ),
              ],
            ),
          ),
        ),
        Gaps.vGap30,
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 15, vertical: 10.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                subscribtionsEntity.title ?? "",
                style:
                    const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),
              Text(subscribtionsEntity.details ?? "",
                  textAlign: TextAlign.justify,
                  style: const TextStyle(
                    fontSize: 12.0,

                    // letterSpacing: 1.0,
                    //     height: 2.5 //You can set your custom height here
                  )),
              Gaps.vGap20,
              Container(
                  padding: const EdgeInsets.all(20.0),
                  decoration: BoxDecoration(
                    color: HexColor("FBDDDD"),
                    borderRadius: BorderRadius.circular(8.0),
                  ),
                  child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            Image.asset(
                              "assets/icon/calendar.png",
                              height: 17,
                              color: Colors.black,
                            ),
                            Gaps.hGap10,
                            const Text(
                              "عدد الحصص",
                              style: TextStyle(
                                fontSize: 12.0,
                                fontWeight: FontWeight.bold,
                                color: Colors.black,
                              ),
                            ),
                          ],
                        ),
                        Text(
                          "${subscribtionsEntity.hesasNumsDaysNum?.toString() ?? subscribtionsEntity.numDays?.toString() ?? "0"} يوم",
                          style: const TextStyle(
                            fontSize: 12.0,
                            fontWeight: FontWeight.bold,
                            color: Colors.black,
                          ),
                        ),
                      ])),
              Gaps.vGap10,
              Container(
                  padding: const EdgeInsets.all(20.0),
                  decoration: BoxDecoration(
                    color: Colors.grey[200],
                    borderRadius: BorderRadius.circular(8.0),
                  ),
                  child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            Image.asset(
                              "assets/icon/stop_icon.png",
                              height: 20,
                              color: Colors.black,
                            ),
                            Gaps.hGap10,
                            const Text(
                              "ايام الوقف",
                              style: TextStyle(
                                fontSize: 12.0,
                                fontWeight: FontWeight.bold,
                                color: Colors.black,
                              ),
                            ),
                          ],
                        ),
                        Text(
                          "${subscribtionsEntity.stoppedDaysNum?.toString() ?? "0"} يوم",
                          style: const TextStyle(
                            fontSize: 12.0,
                            fontWeight: FontWeight.bold,
                            color: Colors.black,
                          ),
                        ),
                      ])),
              Gaps.vGap10,
              Container(
                  padding: const EdgeInsets.all(20.0),
                  decoration: BoxDecoration(
                    color: HexColor("FBDDDD"),
                    borderRadius: BorderRadius.circular(8.0),
                  ),
                  child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            Image.asset(
                              "assets/icon/calendar.png",
                              height: 17,
                              color: Colors.black,
                            ),
                            Gaps.hGap10,
                            const Text(
                              "عدد أيام السبا",
                              style: TextStyle(
                                fontSize: 12.0,
                                fontWeight: FontWeight.bold,
                                color: Colors.black,
                              ),
                            ),
                          ],
                        ),
                        Text(
                          "${subscribtionsEntity.spaDaysNum?.toString() ?? "0"} يوم",
                          style: const TextStyle(
                            fontSize: 12.0,
                            fontWeight: FontWeight.bold,
                            color: Colors.black,
                          ),
                        ),
                      ])),
              Gaps.vGap10,
            ],
          ),
        ),
        const Spacer(),
        ElevatedButton(
          onPressed: () {
            // Navigator.pushNamed(context, kAddSubscribtionsScreen,
            //     arguments: subscribtionsEntity);
            Commons.showToast(context,
                message: "لم يتم الانتهاء من العمل عليه ", color: Colors.black);
          },
          style: ElevatedButton.styleFrom(
            minimumSize: Size(MediaQuery.of(context).size.width - 20, 50),
            backgroundColor: kPrimaryColor,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(8),
            ),
          ),
          child: const Text(
            'اشتراك ',
            style: TextStyle(color: Colors.white, fontSize: 16),
          ),
        ),
        Gaps.vGap50
      ],
    );
  }
  //
}

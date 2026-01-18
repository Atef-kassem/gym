import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';
import 'package:swat_gym/core/utils/constants.dart';
import 'package:swat_gym/core/utils/gaps.dart';
import 'package:swat_gym/features/exercises/domain/entities/exercise_entity.dart';
import 'package:swat_gym/core/utils/image_utils.dart';

class ExerciseCard extends StatelessWidget {
  const ExerciseCard({super.key, required this.offersList});
  final ExerciseEntity offersList;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(12.0),
      child: Row(
        //   mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Container(
              height: 120,
              width: MediaQuery.of(context).size.width * .25,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(10),
                //color: Colors.grey[200],
              ),
              child: CachedNetworkImage(
                errorWidget: (context, url, error) => Icon(
                  Icons.person,
                  color: kPrimaryColor,
                ),
                progressIndicatorBuilder: (context, url, progress) => Center(
                  child: CircularProgressIndicator(
                      value: progress.progress, color: kPrimaryColor),
                ),
                imageUrl: buildImageUrl(offersList.mainImage),
                height: 120,
                width: 100,
                fit: BoxFit.contain,
              )),
          Gaps.hGap5,
          SizedBox(
            width: MediaQuery.of(context).size.width * .6,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.start,
              children: [
                Text(
                  offersList.title ?? "",
                  //  overflow: TextOverflow.ellipsis,
                  // softWrap: true,
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 15,
                  ),
                ),
                const SizedBox(height: 8),
                Row(
                  mainAxisAlignment: MainAxisAlignment.start,
                  children: [
                    SvgPicture.asset(
                      "assets/images/calories.svg",
                    ),
                    Gaps.hGap4,
                    Text(
                      '${offersList.tkrar ?? ""} مرة  ',
                      style: const TextStyle(
                        color: Colors.grey,
                        fontSize: 12,
                      ),
                    ),
                    Gaps.hGap5,
                    const Text(
                      "|",
                      style: TextStyle(
                        color: Colors.grey,
                        fontSize: 12,
                      ),
                    ),
                    Gaps.hGap5,
                    SvgPicture.asset(
                      "assets/images/clock.svg",
                    ),
                    Gaps.hGap4,
                    Text(
                      '${offersList.restInSec ?? ""} ثانية',
                      style: const TextStyle(
                        color: Colors.grey,
                        fontSize: 12,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                Text(
                  '${offersList.tamrenFor ?? ""} ',
                  style: const TextStyle(
                    color: Colors.grey,
                    fontSize: 12,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

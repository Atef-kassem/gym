import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:swat_gym/core/utils/constants.dart';
import 'package:swat_gym/core/utils/helper.dart';
import 'package:swat_gym/core/utils/image_utils.dart';
import 'package:swat_gym/features/offers/presentation/views/widgets/custom_offer_rateing.dart';

class OfferItem extends StatelessWidget {
  const OfferItem(
      {super.key,
      required this.title,
      required this.rate,
      required this.image,
      required this.price,
      required this.checkFav});
  final String title;
  final String price;
  final String rate;
  final String checkFav;

  final String image;
  @override
  Widget build(BuildContext context) {
    return Card(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(15),
      ),
      margin: const EdgeInsets.symmetric(horizontal: 10, vertical: 10),
      child: Padding(
        padding: const EdgeInsets.all(12.0),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            ClipRRect(
                borderRadius: BorderRadius.circular(8),
                child: CachedNetworkImage(
                  errorWidget: (context, url, error) => Icon(
                    Icons.person,
                    color: kPrimaryColor,
                  ),
                  progressIndicatorBuilder: (context, url, progress) => Center(
                    child: CircularProgressIndicator(
                        value: progress.progress, color: kPrimaryColor),
                  ),
                  imageUrl: buildImageUrl(image),
                  height: 80,
                  width: 80,
                  fit: BoxFit.fill,
                )),
            SizedBox(
              width: context.screenWidth / 1.5,
              child: CustomOfferRating(
                title: title,
                price: price,
                rate: rate,
                checkFav: checkFav,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

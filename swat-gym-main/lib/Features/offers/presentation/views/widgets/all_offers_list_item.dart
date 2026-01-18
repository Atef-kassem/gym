import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:swat_gym/features/offers/domain/entities/offers_entity.dart';
import 'package:swat_gym/features/offers/presentation/views/widgets/custom_offer_rateing.dart';
import 'package:swat_gym/core/widgets/custom_image.dart';
import 'package:swat_gym/core/utils/image_utils.dart';

class AllOffersListItem extends StatelessWidget {
  const AllOffersListItem({
    super.key,
    required this.offersList,
    required this.itemIndex,
    this.home = false,
  });
  final OffersEntity offersList;
  final int itemIndex;
  final bool home;

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 10, vertical: 10),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(15),
      ),
      child: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: CachedNetworkImage(
              imageUrl: buildImageUrl(offersList.imagePath ?? offersList.image),
              height: home ? 120 : 200,
              fit: BoxFit.fill,
              width: 400,
              placeholder: (context, url) => const BlankImageWidget(),
              errorWidget: (context, url, error) => const BlankImageWidget(),
              imageBuilder: (context, imageProvider) => Container(
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(20),
                  image:
                      DecorationImage(image: imageProvider, fit: BoxFit.fill),
                ),
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(12.0),
            child: CustomOfferRating(
              title: offersList.offerName ?? "",
              price: offersList.offerValue ?? "",
              rate: offersList.rate?.toString() ?? "0",
              checkFav: offersList.checkFav ?? "",
            ),
          ),
        ],
      ),
    );
  }
}

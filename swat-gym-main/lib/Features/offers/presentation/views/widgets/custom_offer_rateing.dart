import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';
import 'package:swat_gym/core/utils/gaps.dart';

class CustomOfferRating extends StatelessWidget {
  const CustomOfferRating(
      {super.key,
      required this.title,
      required this.rate,
      required this.price,
      required this.checkFav});
  final String title;
  final String price;
  final String rate;
  final String checkFav;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Column(
          mainAxisAlignment: MainAxisAlignment.start,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              title,
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
            ),
            Gaps.vGap10,
            Text("$price جـنـيـه",
                style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 12,
                    color: Colors.grey)),
          ],
        ),
        Column(
          mainAxisAlignment: MainAxisAlignment.start,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            SvgPicture.asset(
              checkFav == "in_fav"
                  ? "assets/images/heart_fav.svg"
                  : "assets/images/Heart.svg",
              color: checkFav == "in_fav" ? Colors.red : Colors.grey,
              colorFilter: checkFav == "in_fav" 
                  ? const ColorFilter.mode(Colors.red, BlendMode.srcIn)
                  : null,
            ),
            Gaps.vGap10,
            Row(
              children: [
                const Icon(Icons.star, color: Colors.orange, size: 18),
                const SizedBox(width: 4),
                Text(rate),
              ],
            ),
          ],
        ),
      ],
    );
  }
}

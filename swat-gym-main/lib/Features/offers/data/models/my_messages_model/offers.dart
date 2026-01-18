import 'package:swat_gym/features/offers/domain/entities/offers_entity.dart';

typedef AllOffersList = List<OffersEntity>?;

class Offers extends OffersEntity {
  const Offers({
    super.offerId,
    super.offerName,
    super.subTitle,
    super.fromDate,
    super.toDate,
    super.offerValue,
    super.status,
    super.offerDetails,
    super.image,
    super.imagePath,
    super.checkFav,
    super.rate,
  });

  factory Offers.fromJson(Map<String, dynamic> json) {
    // التعامل مع format الجديد من Backend: { id, title, description, discount, startDate, endDate, isActive }
    // أو format القديم: { offer_id, offer_name, ... }
    
    // Format الجديد من Backend (AppOffers table)
    if (json.containsKey('id') || json.containsKey('title')) {
      return Offers(
        offerId: json["id"]?.toString(),
        offerName: json["title"]?.toString(),
        subTitle: json["description"]?.toString(),
        fromDate: json["startDate"]?.toString(),
        toDate: json["endDate"]?.toString(),
        offerValue: json["discount"]?.toString(),
        status: json["isActive"] == true ? "1" : "0",
        offerDetails: json["description"]?.toString(),
        image: json["imageUrl"]?.toString() ?? json["image"]?.toString(),
        imagePath: json["imageUrl"]?.toString() ?? json["imagePath"]?.toString(),
        checkFav: json["checkFav"]?.toString(), // استخدام checkFav من الـ API
        rate: null,
      );
    }
    
    // Format القديم (backward compatibility)
    return Offers(
      offerId: json["offer_id"]?.toString(),
      offerName: json["offer_name"]?.toString(),
      subTitle: json["sub_title"]?.toString(),
      fromDate: json["from_date"]?.toString(),
      toDate: json["to_date"]?.toString(),
      offerValue: json["offer_value"]?.toString(),
      status: json["status"]?.toString(),
      offerDetails: json["offer_details"]?.toString(),
      image: json["image"]?.toString(),
      imagePath: json["image_path"]?.toString(),
      checkFav: json["check_fav"]?.toString(),
      rate: json["rate"],
    );
  }

  Map<String, dynamic> toJson() => {
        "offer_id": offerId,
        "offer_name": offerName,
        "sub_title": subTitle,
        "from_date": fromDate,
        "to_date": toDate,
        "offer_value": offerValue,
        "status": status,
        "offer_details": offerDetails,
        "image": image,
        "image_path": imagePath,
        "check_fav": checkFav,
        "rate": rate,
      };
}

import 'package:swat_gym/features/offers/domain/entities/add_offers_entity.dart';

class AddOfferModel extends AddOffersEntity {
  const AddOfferModel({
    super.messageResponse,
    super.statusCode,
  });

  factory AddOfferModel.fromJson(Map<String, dynamic> json) {
    return AddOfferModel(
      statusCode: json['status'] as int?,
      messageResponse: json['message'] as String?,
    );
  }

  Map<String, dynamic> toJson() => {
        'status': statusCode,
        'message': messageResponse,
      };
}

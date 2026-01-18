import 'package:equatable/equatable.dart';

class OffersEntity extends Equatable {
  final String? offerId;
  final String? offerName;
  final String? subTitle;
  final String? fromDate;
  final String? toDate;
  final String? offerValue;
  final String? status;
  final String? offerDetails;
  final String? image;
  final String? imagePath;
  final String? checkFav;
  final dynamic rate;

  const OffersEntity(
      {this.offerId,
      this.offerName,
      this.subTitle,
      this.fromDate,
      this.toDate,
      this.offerValue,
      this.status,
      this.offerDetails,
      this.image,
      this.imagePath,
      this.checkFav,
      this.rate});

  @override
  List<Object?> get props => [
        offerId,
        offerName,
        subTitle,
        fromDate,
        toDate,
        offerValue,
        status,
        offerDetails,
        image,
        imagePath,
        checkFav,
        rate
      ];
}

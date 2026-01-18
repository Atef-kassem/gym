import 'package:equatable/equatable.dart';

class SubscribtionsEntity extends Equatable {
  final String? typeId;
  final String? title;
  final String? numDays;
  final String? stopped;
  final String? stoppedDaysNum;
  final String? price;
  final String? approved;
  final String? student;
  final String? specialOffer;
  final String? relatedToHesas;
  final String? hesasNumsDaysNum;
  final String? branchIdFk;
  final String? active;
  final String? details;
  final String? specialToStd;
  final String? subsImage;
  final dynamic image;
  final String? haletEshtrak;
  final dynamic imagePath;
  final String? spa;
  final String? spaDaysNum;
  final String? target;
  final String? invitationsCount;
  final String? inbodyCount;
  final String? appDisplay;
  final String? appNotify;
  final String? endNotify;
  final String? points;
  final String? expireNumDays;
  final dynamic priceBar;
  final dynamic priceTanta;

  const SubscribtionsEntity(
      {this.typeId,
      this.title,
      this.numDays,
      this.stopped,
      this.stoppedDaysNum,
      this.price,
      this.approved,
      this.student,
      this.specialOffer,
      this.relatedToHesas,
      this.hesasNumsDaysNum,
      this.branchIdFk,
      this.active,
      this.details,
      this.specialToStd,
      this.subsImage,
      this.image,
      this.haletEshtrak,
      this.imagePath,
      this.spa,
      this.spaDaysNum,
      this.target,
      this.invitationsCount,
      this.inbodyCount,
      this.appDisplay,
      this.appNotify,
      this.endNotify,
      this.points,
      this.expireNumDays,
      this.priceBar,
      this.priceTanta});

  @override
  List<Object?> get props => [
        typeId,
        title,
        numDays,
        stopped,
        stoppedDaysNum,
        price,
        approved,
        student,
        specialOffer,
        relatedToHesas,
        hesasNumsDaysNum,
        branchIdFk,
        active,
        details,
        specialToStd,
        subsImage,
        image,
        haletEshtrak,
        imagePath,
        spa,
        spaDaysNum,
        target,
        invitationsCount,
        inbodyCount,
        appDisplay,
        appNotify,
        endNotify,
        points,
        expireNumDays,
        priceBar,
        priceTanta
      ];
}

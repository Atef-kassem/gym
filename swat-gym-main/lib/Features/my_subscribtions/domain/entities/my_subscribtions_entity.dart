import 'package:equatable/equatable.dart';

class MySubscribtionsEntity extends Equatable {
  final String? subsId;
  final String? memIdFk;
  final String? price;
  final String? fromDateAr;
  final String? toDateAr;
  final String? subscriptionTypeFk;
  final String? subsName;
  final String? haveEgraaStop;
  final String? details;
  final dynamic stopFromAr;
  final dynamic stopToAr;
  final dynamic captainName;

  const MySubscribtionsEntity(
      {this.subsId,
      this.memIdFk,
      this.price,
      this.fromDateAr,
      this.toDateAr,
      this.subscriptionTypeFk,
      this.subsName,
      this.haveEgraaStop,
      this.details,
      this.stopFromAr,
      this.stopToAr,
      this.captainName});

  @override
  List<Object?> get props => [
        subsId,
        memIdFk,
        price,
        fromDateAr,
        toDateAr,
        subscriptionTypeFk,
        subsName,
        haveEgraaStop,
        details,
        stopFromAr,
        stopToAr,
        captainName
      ];
}

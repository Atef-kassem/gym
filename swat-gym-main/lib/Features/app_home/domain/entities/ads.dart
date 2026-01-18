import 'package:equatable/equatable.dart';

class AdsEntity extends Equatable {
  final String? id;
  final String? title;
  final String? fromDate;
  final String? toDate;
  final String? details;
  final String? mainImage;
  final String? imagePath;

  const AdsEntity(
      {this.id,
      this.title,
      this.fromDate,
      this.toDate,
      this.details,
      this.mainImage,
      this.imagePath});

  @override
  List<Object?> get props =>
      [id, title, fromDate, toDate, details, mainImage, imagePath];
}

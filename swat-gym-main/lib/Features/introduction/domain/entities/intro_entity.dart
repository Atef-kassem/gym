import 'package:equatable/equatable.dart';

class IntroEntity extends Equatable {
  final String? spalshId;
  final String? screenNumber;
  final String? spalshTitleEn;
  final String? spalshTitleAr;
  final String? image;
  final String? spalshDetailsEn;
  final String? spalshDetailsAr;
  final String? imagePath;

  const IntroEntity(
      {this.spalshId,
      this.screenNumber,
      this.spalshTitleEn,
      this.spalshTitleAr,
      this.image,
      this.spalshDetailsEn,
      this.spalshDetailsAr,
      this.imagePath});
  @override
  List<Object?> get props => [
        spalshId,
        screenNumber,
        spalshTitleEn,
        spalshTitleAr,
        image,
        spalshDetailsEn,
        spalshDetailsAr,
        imagePath
      ];
}

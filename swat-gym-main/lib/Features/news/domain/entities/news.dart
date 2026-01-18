import 'package:equatable/equatable.dart';

class NewsEntity extends Equatable {
  final String? newsId;
  final String? newsDate;
  final String? newsTitleAr;
  final String? detailsAr;
  final String? mainImage;

  const NewsEntity(
      {this.newsId,
      this.newsDate,
      this.newsTitleAr,
      this.detailsAr,
      this.mainImage});

  @override
  List<Object?> get props =>
      [newsId, newsDate, newsTitleAr, detailsAr, mainImage];
}

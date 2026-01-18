import 'package:swat_gym/features/news/domain/entities/news.dart';

typedef AllNewsList = List<News>?;

class News extends NewsEntity {
  const News(
      {super.newsId,
      super.detailsAr,
      super.mainImage,
      super.newsDate,
      super.newsTitleAr});

  factory News.fromJson(Map<String, dynamic> json) {
    // التعامل مع format الجديد من Backend: { id, title, content, publishDate, isPublished }
    // أو format القديم: { news_id, news_title_ar, details_ar, news_date, main_image }
    
    // Format الجديد من Backend (AppNews table)
    if (json.containsKey('title') || json.containsKey('content') || json.containsKey('publishDate')) {
      return News(
        newsId: json["id"]?.toString(),
        detailsAr: json["content"]?.toString() ?? json["details_ar"]?.toString(),
        mainImage: json["imageUrl"]?.toString() ?? json["main_image"]?.toString(),
        newsDate: json["publishDate"]?.toString() ?? json["news_date"]?.toString(),
        newsTitleAr: json["title"]?.toString() ?? json["news_title_ar"]?.toString(),
      );
    }
    
    // Format القديم (backward compatibility)
    return News(
      newsId: json["news_id"]?.toString(),
      detailsAr: json["details_ar"]?.toString(),
      mainImage: json["main_image"]?.toString(),
      newsDate: json["news_date"]?.toString(),
      newsTitleAr: json["news_title_ar"]?.toString(),
    );
  }

  Map<String, dynamic> toJson() => {
        "news_id": newsId,
        "details_ar": detailsAr,
        "main_image": mainImage,
        "news_date": newsDate,
        "news_title_ar": newsTitleAr,
      };
}

import '../../data/data_sources/remote_data_source/all_news_remote_data_source.dart';

abstract class NewsRepo {
  Future<AllNewsResponse> fetchAllNews(
    String userId,
  );
}

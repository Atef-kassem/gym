import 'package:swat_gym/features/news/domain/entities/news.dart';

import '../../data/data_sources/remote_data_source/all_news_remote_data_source.dart';
import '../repositories/news_repo.dart';

abstract class UseCase<type, Param> {
  Future<AllNewsResponse> callAllNews(String userId);
}

class NewsUseCase extends UseCase<NewsEntity, void> {
  final NewsRepo newsRepository;
  NewsUseCase(this.newsRepository);
  @override
  Future<AllNewsResponse> callAllNews(String userId) async {
    return await newsRepository.fetchAllNews(userId);
  }
}

import '../../domain/repositories/news_repo.dart';
import '../data_sources/remote_data_source/all_news_remote_data_source.dart';

class NewsRepositoryImp extends NewsRepo {
  final AllNewsRemoteDataSource myNewsRemoteDataSource;

  NewsRepositoryImp(this.myNewsRemoteDataSource);

  @override
  Future<AllNewsResponse> fetchAllNews(String userId) async {
    var userData = await myNewsRemoteDataSource.fetchAllNews(userId);

    return userData;
  }
}

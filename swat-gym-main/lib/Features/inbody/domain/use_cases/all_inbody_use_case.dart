import 'package:swat_gym/features/news/domain/entities/news.dart';

import '../../data/data_sources/remote_data_source/all_inbody_remote_data_source.dart';
import '../repositories/all_inbody_repo.dart';

abstract class UseCase<type, Param> {
  Future<AllInbodyResponse> callAllInbody(String userId);
}

class AllInbodyUseCase extends UseCase<NewsEntity, void> {
  final AllInbodyRepo newsRepository;
  AllInbodyUseCase(this.newsRepository);
  @override
  Future<AllInbodyResponse> callAllInbody(String userId) async {
    return await newsRepository.fetchAllAllInbody(userId);
  }
}

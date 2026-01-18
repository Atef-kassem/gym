import 'package:swat_gym/features/subscribtions/data/data_sources/add_subscribtions_remote_data_source.dart';
import 'package:swat_gym/features/subscribtions/data/data_sources/subscribtions_remote_data_source.dart';
import 'package:swat_gym/features/subscribtions/data/repositories/subscribtions_repo.dart';
import 'package:swat_gym/features/subscribtions/domain/entities/subscribtions_entity.dart';

abstract class UseCase<type, Param> {
  Future<AllSubscribtionsResponse> callAllSubscribtions();
  Future<AddSubscribtionsResponse> callAddSubscribtions(fromDate, subId);
}

class SubscribtionsUseCase extends UseCase<SubscribtionsEntity, void> {
  final SubscribtionsRepo subscribtionsRepository;
  SubscribtionsUseCase(this.subscribtionsRepository);
  @override
  Future<AllSubscribtionsResponse> callAllSubscribtions() async {
    return await subscribtionsRepository.fetchAllSubscribtions();
  }

  @override
  Future<AddSubscribtionsResponse> callAddSubscribtions(fromDate, subId) async {
    return await subscribtionsRepository.addSubscribtions(fromDate, subId);
  }
}

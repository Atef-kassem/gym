import 'package:swat_gym/features/my_subscribtions/data/data_sources/stoped_subscribtions_remote_data_source.dart';
import 'package:swat_gym/features/my_subscribtions/data/repositories/my_subscribtions_repo.dart';
import 'package:swat_gym/features/my_subscribtions/domain/entities/my_subscribtions_entity.dart';

import '../../data/data_sources/my_subscribtions_remote_data_source.dart';

abstract class UseCase<type, Param> {
  Future<MySubscribtionsResponse> callMySubscribtions({int? memberId});
  Future<StopedSubscribtionsResponse> callStopedSubscribtions(
      fromDate, subId, reason, numDays, typeFK);
}

class MySubscribtionsUseCase extends UseCase<MySubscribtionsEntity, void> {
  final MySubscribtionsRepo mosalatRepository;
  MySubscribtionsUseCase(this.mosalatRepository);
  @override
  Future<MySubscribtionsResponse> callMySubscribtions({int? memberId}) async {
    return await mosalatRepository.fetchMySubscribtions(memberId: memberId);
  }

  @override
  Future<StopedSubscribtionsResponse> callStopedSubscribtions(
      fromDate, subId, reason, numDays, typeFK) async {
    return await mosalatRepository.stopedSubscribtions(
        fromDate, subId, reason, numDays, typeFK);
  }
}

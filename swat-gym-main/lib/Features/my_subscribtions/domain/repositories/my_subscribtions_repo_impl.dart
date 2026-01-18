import 'package:swat_gym/features/my_subscribtions/data/data_sources/my_subscribtions_remote_data_source.dart';
import 'package:swat_gym/features/my_subscribtions/data/data_sources/stoped_subscribtions_remote_data_source.dart';

import '../../data/repositories/my_subscribtions_repo.dart';

class MySubscribtionsRepositoryImp extends MySubscribtionsRepo {
  final MySubscribtionsRemoteDataSource mySubscribtionsRemoteDataSource;
  final StopedSubscribtionsRemoteDataSource stopedSubscribtionsRemoteDataSource;

  MySubscribtionsRepositoryImp(this.mySubscribtionsRemoteDataSource,
      this.stopedSubscribtionsRemoteDataSource);

  @override
  Future<MySubscribtionsResponse> fetchMySubscribtions({int? memberId}) async {
    var userData = await mySubscribtionsRemoteDataSource.fetchAllMosalat(memberId: memberId);

    return userData;
  }

  @override
  Future<StopedSubscribtionsResponse> stopedSubscribtions(
      fromDate, subId, reason, numDays, typeFK) async {
    var userData = await stopedSubscribtionsRemoteDataSource
        .stopedSubscribtions(fromDate, subId, reason, numDays, typeFK);

    return userData;
  }
}

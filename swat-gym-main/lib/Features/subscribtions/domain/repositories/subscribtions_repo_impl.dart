import 'package:swat_gym/features/subscribtions/data/data_sources/add_subscribtions_remote_data_source.dart';
import 'package:swat_gym/features/subscribtions/data/data_sources/subscribtions_remote_data_source.dart';

import '../../data/repositories/subscribtions_repo.dart';

class SubscribtionsRepositoryImp extends SubscribtionsRepo {
  final SubscribtionsRemoteDataSource subscribtionsRemoteDataSource;
  final AddSubscribtionsRemoteDataSource addSubscribtionsRemoteDataSource;

  SubscribtionsRepositoryImp(
      this.subscribtionsRemoteDataSource, this.addSubscribtionsRemoteDataSource);

  @override
  Future<AllSubscribtionsResponse> fetchAllSubscribtions() async {
    var userData = await subscribtionsRemoteDataSource.fetchAllSubscribtions();

    return userData;
  }

  @override
  Future<AddSubscribtionsResponse> addSubscribtions(fromDate, subId) async {
    var userData = await addSubscribtionsRemoteDataSource.addSubscribtions(
        fromDate, subId);
    return userData;
  }
}

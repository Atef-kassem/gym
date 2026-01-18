import '../../domain/repositories/captains_repo.dart';
import '../data_sources/remote_data_source/all_captains_remote_data_source.dart';

class CaptainsRepositoryImp extends CaptainsRepo {
  final AllCaptainsRemoteDataSource myCaptainsRemoteDataSource;

  CaptainsRepositoryImp(this.myCaptainsRemoteDataSource);

  @override
  Future<AllCaptainsResponse> fetchAllCaptains(String userId) async {
    var userData = await myCaptainsRemoteDataSource.fetchAllCaptains(userId);

    return userData;
  }
}

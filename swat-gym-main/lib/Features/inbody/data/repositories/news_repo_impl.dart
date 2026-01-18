import '../../domain/repositories/all_inbody_repo.dart';
import '../data_sources/remote_data_source/all_inbody_remote_data_source.dart';

class AllInbodyRepositoryImp extends AllInbodyRepo {
  final AllInbodyRemoteDataSource allInbodyRemoteDataSource;

  AllInbodyRepositoryImp(this.allInbodyRemoteDataSource);

  @override
  Future<AllInbodyResponse> fetchAllAllInbody(String userId) async {
    var userData = await allInbodyRemoteDataSource.fetchAllInbody(userId);

    return userData;
  }
}

import '../../domain/repositories/get_profile_repo.dart';
import '../data_sources/get_profile_remote_data_source.dart';

class GetProfileRepoImpl extends GetProfileRepository {
  final GetProfileRemoteDataSource getProfileRemoteDataSource;

  GetProfileRepoImpl(this.getProfileRemoteDataSource);

  @override
  Future<GetProfileResponse> getProfile(
    String userId,
  ) async {
    var userData = await getProfileRemoteDataSource.getProfile(
      userId,
    );
    return userData;
  }

  // @override
  // Future<LoginResponse> login(String phone) async {
  //   Future<LoginResponse> logini(String phone) async {
  //     try {
  //       var userData = await loginRemoteDataSourec.login(phone);

  //       return right(userData);
  //     } catch (e) {
  //       return Left(ServerFailure(e.toString()));
  //     }
  //   }
  // }
}

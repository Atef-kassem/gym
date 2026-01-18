import '../../domain/repositories/update_profile_repo.dart';
import '../data_sources/update_profile_remote_data_source.dart';

class UpdateProfileRepoImpl extends UpdateProfileRepository {
  final UpdateProfileRemoteDataSource updateProfileRemoteDataSource;

  UpdateProfileRepoImpl(this.updateProfileRemoteDataSource);

  @override
  Future<UpdateProfileResponse> updateProfile(
    String userId,
    dynamic attachment,
  ) async {
    var userData = await updateProfileRemoteDataSource.updateProfile(
      userId,
      attachment,
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

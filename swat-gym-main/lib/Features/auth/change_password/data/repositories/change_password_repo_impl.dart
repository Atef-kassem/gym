import '../../domain/repositories/change_password_repo.dart';
import '../data_sources/change_password_remote_data_source.dart';

class ChangePasswordRepoImpl extends ChangePasswordRepository {
  final ChangePasswordRemoteDataSource changePasswordRemoteDataSource;

  ChangePasswordRepoImpl(this.changePasswordRemoteDataSource);

  @override
  Future<ChangePasswordResponse> changePassword(
    String userId,
    String currentPassword,
    String newPassword,
  ) async {
    var userData = await changePasswordRemoteDataSource.changePassword(
      userId,
      currentPassword,
      newPassword,
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

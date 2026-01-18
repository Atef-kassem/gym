import '../dat_source/login_remote_data_source/login_remote_data_source.dart';
import '../../domain/repository/login_repo.dart';

class LoginRepoImpl extends LoginRepository {
  final LoginRemoteDataSource loginRemoteDataSource;

  LoginRepoImpl(this.loginRemoteDataSource);

  @override
  Future<LoginResponse> login(
    String phone,
    String password,
  ) async {
    var userData = await loginRemoteDataSource.login(
      phone,
      password,
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

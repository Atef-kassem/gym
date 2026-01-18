import '../../data/dat_source/login_remote_data_source/login_remote_data_source.dart';

abstract class LoginRepository {
  Future<LoginResponse> login(String phone, String password);
}

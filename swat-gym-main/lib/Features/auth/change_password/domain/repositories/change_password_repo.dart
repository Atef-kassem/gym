import '../../data/data_sources/change_password_remote_data_source.dart';

abstract class ChangePasswordRepository {
  Future<ChangePasswordResponse> changePassword(
    String userId,
    String currentPassword,
    String newPassword,
  );
}

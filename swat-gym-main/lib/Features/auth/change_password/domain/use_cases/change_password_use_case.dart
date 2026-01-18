import 'package:swat_gym/features/auth/login/domain/entities/employee_entity.dart';

import '../../data/data_sources/change_password_remote_data_source.dart';
import '../repositories/change_password_repo.dart';

abstract class UseCase<type> {
  Future<ChangePasswordResponse> call(
    String userId,
    String currentPassword,
    String newPassword,
  );
}

class ChangePasswordUseCase extends UseCase<EmployeeEntity> {
  final ChangePasswordRepository changePasswordRepository;
  ChangePasswordUseCase(this.changePasswordRepository);

  @override
  Future<ChangePasswordResponse> call(
    String userId,
    String currentPassword,
    String newPassword,
  ) async {
    return await changePasswordRepository.changePassword(
      userId,
      currentPassword,
      newPassword,
    );
  }
}

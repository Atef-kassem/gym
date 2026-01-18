import 'package:swat_gym/features/auth/login/domain/entities/employee_entity.dart';

import '../../data/data_sources/update_profile_remote_data_source.dart';
import '../repositories/update_profile_repo.dart';

abstract class UseCase<type> {
  Future<UpdateProfileResponse> call(
    String userId,
    dynamic attachment,
  );
}

class UpdateProfileUseCase extends UseCase<EmployeeEntity> {
  final UpdateProfileRepository updateProfileRepository;
  UpdateProfileUseCase(this.updateProfileRepository);

  @override
  Future<UpdateProfileResponse> call(
    String userId,
    dynamic attachment,
  ) async {
    return await updateProfileRepository.updateProfile(userId, attachment);
  }
}

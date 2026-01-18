import 'package:swat_gym/features/auth/login/data/models/login_model/login_model/employee_model.dart';

import '../../data/data_sources/get_profile_remote_data_source.dart';
import '../repositories/get_profile_repo.dart';

abstract class UseCase<type> {
  Future<GetProfileResponse> call(
    String userId,
  );
}

class GetProfileUseCase extends UseCase<EmployeeModel> {
  final GetProfileRepository getProfileRepository;
  GetProfileUseCase(this.getProfileRepository);

  @override
  Future<GetProfileResponse> call(
    String userId,
  ) async {
    return await getProfileRepository.getProfile(userId);
  }
}

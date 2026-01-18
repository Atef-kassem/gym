import 'package:swat_gym/features/auth/login/domain/entities/employee_entity.dart';

import '../../data/data_sources/update_signature_remote_data_source.dart';
import '../repositories/update_signature_repo.dart';

abstract class UseCase<type> {
  Future<UpdateSignatureResponse> call(
    String userId,
    dynamic attachment,
  );
}

class UpdateSignatureUseCase extends UseCase<EmployeeEntity> {
  final UpdateSignatureRepository updateSignatureRepository;
  UpdateSignatureUseCase(this.updateSignatureRepository);

  @override
  Future<UpdateSignatureResponse> call(
    String userId,
    dynamic attachment,
  ) async {
    return await updateSignatureRepository.updateSignature(userId, attachment);
  }
}

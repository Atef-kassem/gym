import 'package:swat_gym/features/auth/register/data/data_sources/register_remote_data_source/branches_remote_data_source.dart';

import '../../data/data_sources/register_remote_data_source/register_remote_data_source.dart';
import '../entities/register_entity.dart';
import '../repositories/register_repo.dart';

abstract class UseCase<type> {
  Future<RegisterResponse> call(
    String name,
    String branchId,
    String gender,
    String phone,
    String password,
    String confirmPassword,
  );

  Future<TypeBranchesaResponse> fetchTypesBranches();
}

class RegisterUseCase extends UseCase<RegisterEntity> {
  final RegisterRepository registerRepository;
  RegisterUseCase(this.registerRepository);

  @override
  Future<RegisterResponse> call(
    String name,
    String branchId,
    String gender,
    String phone,
    String password,
    String confirmPassword,
  ) {
    return registerRepository.register(
      name,
      branchId,
      gender,
      phone,
      password,
      confirmPassword,
    );
  }

  @override
  Future<TypeBranchesaResponse> fetchTypesBranches() {
    return registerRepository.fetchTypesBranches();
  }
}

import 'package:swat_gym/features/auth/register/data/data_sources/register_remote_data_source/branches_remote_data_source.dart';

import '../../domain/repositories/register_repo.dart';
import '../data_sources/register_remote_data_source/register_remote_data_source.dart';

class RegisterRepoImpl extends RegisterRepository {
  final RegisterRemoteDataSource registerRemoteDataSource;

  final TypeBranchesRemoteDataSource typeBranchesRemoteDataSource;

  RegisterRepoImpl(
      this.registerRemoteDataSource, this.typeBranchesRemoteDataSource);

  @override
  Future<RegisterResponse> register(
    String name,
    String branchId,
    String gender,
    String phone,
    String password,
    String confirmPassword,
  ) async {
    var userData = await registerRemoteDataSource.register(
      name,
      branchId,
      gender,
      phone,
      password,
      confirmPassword,
    );
    return userData;
  }

  @override
  Future<TypeBranchesaResponse> fetchTypesBranches() async {
    var userData = await typeBranchesRemoteDataSource.fetchTypesBranches();
    return userData;
  }
}

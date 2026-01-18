import 'package:swat_gym/features/auth/register/data/data_sources/register_remote_data_source/branches_remote_data_source.dart';

import '../../data/data_sources/register_remote_data_source/register_remote_data_source.dart';

abstract class RegisterRepository {
  Future<RegisterResponse> register(
    String name,
    String branchId,
    String gender,
    String phone,
    String password,
    String confirmPassword,
  );

  Future<TypeBranchesaResponse> fetchTypesBranches();
}

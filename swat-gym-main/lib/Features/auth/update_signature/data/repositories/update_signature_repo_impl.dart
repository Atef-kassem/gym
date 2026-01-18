import '../../domain/repositories/update_signature_repo.dart';
import '../data_sources/update_signature_remote_data_source.dart';

class UpdateSignatureRepoImpl extends UpdateSignatureRepository {
  final UpdateSignatureRemoteDataSource updateSignatureRemoteDataSource;

  UpdateSignatureRepoImpl(this.updateSignatureRemoteDataSource);

  @override
  Future<UpdateSignatureResponse> updateSignature(
    String userId,
    dynamic attachment,
  ) async {
    var userData = await updateSignatureRemoteDataSource.updateSignature(
      userId,
      attachment,
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

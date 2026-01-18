import '../../data/data_sources/update_signature_remote_data_source.dart';

abstract class UpdateSignatureRepository {
  Future<UpdateSignatureResponse> updateSignature(
    String userId,
    dynamic attachment,
  );
}

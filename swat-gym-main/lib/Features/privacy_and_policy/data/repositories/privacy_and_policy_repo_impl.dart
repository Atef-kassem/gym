import 'package:swat_gym/features/privacy_and_policy/data/data_sources/privacy_and_policy_remote_data_sources.dart';
import 'package:swat_gym/features/privacy_and_policy/domain/repositories/privacy_and_policy_repo.dart';

class PrivacyAndPolicyImpl extends PrivacyAndPolicyRepo {
  final PrivacyAndPolicyRemoteDataSource privacyAndPolicyRemoteDataSource;

  PrivacyAndPolicyImpl(this.privacyAndPolicyRemoteDataSource);

  @override
  Future<PrivacyAndPolicyResponse> fetchPrivacyAndPolicyData() async {
    var userData =
        await privacyAndPolicyRemoteDataSource.getPrivacyAndPolicyData();
    return userData;
  }
}

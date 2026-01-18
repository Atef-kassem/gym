import '../../data/data_sources/privacy_and_policy_remote_data_sources.dart';

abstract class PrivacyAndPolicyRepo {
  Future<PrivacyAndPolicyResponse> fetchPrivacyAndPolicyData();
}

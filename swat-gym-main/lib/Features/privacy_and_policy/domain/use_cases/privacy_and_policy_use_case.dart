import 'package:swat_gym/features/privacy_and_policy/data/data_sources/privacy_and_policy_remote_data_sources.dart';
import 'package:swat_gym/features/privacy_and_policy/domain/entities/privacy_and_policy_entity.dart';
import 'package:swat_gym/features/privacy_and_policy/domain/repositories/privacy_and_policy_repo.dart';

abstract class UseCase<type> {
  Future<PrivacyAndPolicyResponse> call();
}

class PrivacyAndPolicyUseCase extends UseCase<PrivacyAndPolicyEntity> {
  final PrivacyAndPolicyRepo privacyAndPolicyRepo;
  PrivacyAndPolicyUseCase(this.privacyAndPolicyRepo);

  @override
  Future<PrivacyAndPolicyResponse> call() async {
    return await privacyAndPolicyRepo.fetchPrivacyAndPolicyData();
  }
}

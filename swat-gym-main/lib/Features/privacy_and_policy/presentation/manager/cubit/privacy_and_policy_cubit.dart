import 'package:swat_gym/features/privacy_and_policy/domain/entities/privacy_and_policy_entity.dart';
import 'package:swat_gym/features/privacy_and_policy/domain/use_cases/privacy_and_policy_use_case.dart';
import 'package:bloc/bloc.dart';
import 'package:meta/meta.dart';

part 'privacy_and_policy_state.dart';

class PrivacyAndPolicyCubit extends Cubit<PrivacyAndPolicyState> {
  PrivacyAndPolicyUseCase privacyAndPolicyUseCase;
  PrivacyAndPolicyCubit(this.privacyAndPolicyUseCase)
      : super(PrivacyAndPolicyInitial());
  Future<void> getPrivacyAndPolicyData() async {
    emit(const PrivacyAndPolicyLoading());
    final result = await privacyAndPolicyUseCase.call();

    emit(result.fold(
        PrivacyAndPolicyFailed.new, PrivacyAndPolicySuccessful.new));
  }
}

part of 'privacy_and_policy_cubit.dart';

@immutable
abstract class PrivacyAndPolicyState {
    const PrivacyAndPolicyState();
  List<Object> get props => [];
}

class PrivacyAndPolicyInitial extends PrivacyAndPolicyState {}

class PrivacyAndPolicyLoading extends PrivacyAndPolicyState {
  const PrivacyAndPolicyLoading();
}

class PrivacyAndPolicySuccessful extends PrivacyAndPolicyState {
  final PrivacyAndPolicyEntity? data;

  const PrivacyAndPolicySuccessful(this.data);
}

class PrivacyAndPolicyFailed extends PrivacyAndPolicyState {
  final String message;
  const PrivacyAndPolicyFailed(this.message);
}


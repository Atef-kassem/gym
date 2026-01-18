part of 'send_invitation_cubit.dart';

@immutable
abstract class SendInvitationState {
  const SendInvitationState();
  List<Object> get props => [];
}

class SendInvitationInitial extends SendInvitationState {}

class SendInvitationLoading extends SendInvitationState {
  const SendInvitationLoading();
}

class SendInvitationSuccessful extends SendInvitationState {
  final String message;

  const SendInvitationSuccessful(this.message);
}

class SendInvitationFailed extends SendInvitationState {
  final String message;
  const SendInvitationFailed(this.message);
}

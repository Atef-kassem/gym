// ignore: depend_on_referenced_packages
import 'package:bloc/bloc.dart';
import 'package:swat_gym/features/contact_us/domain/use_cases/send_invitation_use_case.dart';
// ignore: depend_on_referenced_packages
import 'package:meta/meta.dart';

part 'send_invitation_state.dart';

class SendInvitationCubit extends Cubit<SendInvitationState> {
  SendInvitationUseCase sendInvitationUseCase;

  SendInvitationCubit(this.sendInvitationUseCase)
      : super(SendInvitationInitial());
  Future<void> sendInvitation(phone, name) async {
    emit(const SendInvitationLoading());
    final result =
        await sendInvitationUseCase.callSendInvitation(phone, name);

    emit(
      result.fold(
        SendInvitationFailed.new,
        SendInvitationSuccessful.new,
      ),
    );
  }
}

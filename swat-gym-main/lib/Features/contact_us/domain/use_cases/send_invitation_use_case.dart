import 'package:swat_gym/features/contact_us/data/data_sources/send_invitation_remote_data_source.dart';
import 'package:swat_gym/features/contact_us/data/repositories/send_invitation_repo.dart';

abstract class UseCase<type, Param> {
  Future<SendInvitationResponse> callSendInvitation(fromDate, subId);
}

class SendInvitationUseCase extends UseCase<void, void> {
  final SendInvitationRepo subscribtionsRepository;
  SendInvitationUseCase(this.subscribtionsRepository);

  @override
  Future<SendInvitationResponse> callSendInvitation(phone, name) async {
    return await subscribtionsRepository.sendInvitation(phone, name);
  }
}

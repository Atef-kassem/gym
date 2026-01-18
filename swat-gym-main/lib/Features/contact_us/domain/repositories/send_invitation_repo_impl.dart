import 'package:swat_gym/features/contact_us/data/data_sources/send_invitation_remote_data_source.dart';

import '../../data/repositories/send_invitation_repo.dart';

class SendInvitationRepositoryImp extends SendInvitationRepo {
  final SendInvitationRemoteDataSource sendInvitationRemoteDataSource;

  SendInvitationRepositoryImp(this.sendInvitationRemoteDataSource);

  @override
  Future<SendInvitationResponse> sendInvitation(phone, name) async {
    var userData =
        await sendInvitationRemoteDataSource.sendInvitation(phone, name);
    return userData;
  }
}

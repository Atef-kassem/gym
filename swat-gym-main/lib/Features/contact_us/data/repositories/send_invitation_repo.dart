import 'package:swat_gym/features/contact_us/data/data_sources/send_invitation_remote_data_source.dart';

abstract class SendInvitationRepo {
  Future<SendInvitationResponse> sendInvitation(phone, name);
}


import '../../data/data_sources/remote_data_source/all_messages_remote_data_source.dart';


abstract class MessagesRepo {
  Future<AllMessagesResponse> fetchAllMessages(
    String userId,
    String seen,
  );
  Future<MarkAsReadResponse> markAsRead(String messageId);
  Future<DeleteMessageResponse> deleteMessage(String messageId);
}

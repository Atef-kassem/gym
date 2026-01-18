// ignore: depend_on_referenced_packages
import 'package:bloc/bloc.dart';
import 'package:swat_gym/Features/notification_view/data/models/my_messages_model/datum.dart';
import 'package:swat_gym/Features/notification_view/domain/use_cases/my_messages_use_case.dart';

part 'my_messages_state.dart';

class MyMessagesCubit extends Cubit<MyMessagesState> {
  MyMessagesUseCase myMessagesUseCase;
  MyMessagesCubit(this.myMessagesUseCase) : super(MyMessagesInitial());

  Future<void> getAllMessages(String userId, String seen) async {
    emit(const FetchLoading());
    final result = await myMessagesUseCase.callAllMessages(userId, seen);

    emit(result.fold(FetchFailed.new, FetchSuccessful.new));
  }

  Future<void> markAsRead(String messageId) async {
    final result = await myMessagesUseCase.markAsRead(messageId);
    result.fold(
      (error) {
        print('❌ Error marking as read: $error');
      },
      (success) {
        print('✅ Message marked as read successfully');
        // إعادة تحميل القائمة بعد التحديث
        if (state is FetchSuccessful) {
          final currentData = (state as FetchSuccessful).data;
          if (currentData != null) {
            // تحديث حالة الإشعار في القائمة
            final updatedData = currentData.map((msg) {
              if (msg.msgId.toString() == messageId) {
                return Datum(
                  msgId: msg.msgId,
                  msgDate: msg.msgDate,
                  msgTime: msg.msgTime,
                  subject: msg.subject,
                  message: msg.message,
                  file: msg.file,
                  seen: 1, // Mark as read
                  seenDate: msg.seenDate,
                  seenTime: msg.seenTime,
                  deleted: msg.deleted,
                  toUserId: msg.toUserId,
                  toEmployeeName: msg.toEmployeeName,
                  toEmployeeEdaraName: msg.toEmployeeEdaraName,
                  toEmployeeQsmName: msg.toEmployeeQsmName,
                  toEmployeeMosmaWazefyName: msg.toEmployeeMosmaWazefyName,
                  toEmpPersonalPhoto: msg.toEmpPersonalPhoto,
                  fromEmployeeName: msg.fromEmployeeName,
                  fromEmployeeEdaraName: msg.fromEmployeeEdaraName,
                  fromEmployeeQsmName: msg.fromEmployeeQsmName,
                  fromEmployeeMosmaWazefyName: msg.fromEmployeeMosmaWazefyName,
                  fromEmpPersonalPhoto: msg.fromEmpPersonalPhoto,
                  detailId: msg.detailId,
                  toEmpImg: msg.toEmpImg,
                  fromEmpImg: msg.fromEmpImg,
                );
              }
              return msg;
            }).toList();
            emit(FetchSuccessful(updatedData));
          }
        }
      },
    );
  }

  Future<void> deleteMessage(String messageId) async {
    final result = await myMessagesUseCase.deleteMessage(messageId);
    result.fold(
      (error) {
        print('❌ Error deleting message: $error');
      },
      (success) {
        print('✅ Message deleted successfully');
        // إزالة الإشعار من القائمة
        if (state is FetchSuccessful) {
          final currentData = (state as FetchSuccessful).data;
          if (currentData != null) {
            final updatedData = currentData
                .where((msg) => msg.msgId.toString() != messageId)
                .toList();
            emit(FetchSuccessful(updatedData));
          }
        }
      },
    );
  }
}

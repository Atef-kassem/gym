import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import 'package:swat_gym/core/utils/constants.dart';
import 'package:swat_gym/core/utils/functions/setup_service_locator.dart';
import 'package:swat_gym/features/auth/login/domain/entities/employee_entity.dart';
import 'package:hive/hive.dart';
import '../../../../../../core/utils/network/api/network_api.dart';
import '../../../../../../core/utils/network/network_request.dart';
import '../../../../../../core/utils/network/network_utils.dart';
import '../../models/my_messages_model/datum.dart';
import '../../models/my_messages_model/my_messages_model.dart';

typedef AllMessagesResponse = Either<String, AllMessagesList>;
typedef MarkAsReadResponse = Either<String, bool>;
typedef DeleteMessageResponse = Either<String, bool>;

abstract class AllMessagesRemoteDataSource {
  Future<AllMessagesResponse> fetchAllMessages(String userId, String seen);
  Future<MarkAsReadResponse> markAsRead(String messageId);
  Future<DeleteMessageResponse> deleteMessage(String messageId);
}

class AllMessagesRemoteDataSourceImpl extends AllMessagesRemoteDataSource {
  @override
  Future<AllMessagesResponse> fetchAllMessages(
      String userId, String seen) async {
    var box = Hive.box<EmployeeEntity>(kEmployeeDataBox);

    AllMessagesResponse allMessagesResponse = left("");
    var queryParams = {
      "page": "1",
      "limit": "100",
      // يمكن إضافة userId في query params إذا لزم الأمر
    };
    await getIt<NetworkRequest>().requestFutureData<MyMessagesModel>(
      Method.get,
      queryParams: queryParams,
      options: Options(contentType: Headers.jsonContentType),
      url: NewApi.doServerAllMessageApiCall,
      newBaseUrl: NewApi.baseUrl,
      onSuccess: (data) {
        // Debug logs
        print('=== Messages onSuccess Debug ===');
        print('data type: ${data.runtimeType}');
        print('data.status: ${data.status}');
        print('data.message: ${data.message}');
        print('data.data: ${data.data}');
        print('data.data type: ${data.data?.runtimeType}');
        if (data.data is List) {
          print('data.data is List, length: ${(data.data as List).length}');
        }
        
        // التعامل مع format من interceptor: { code: 0, data: [...], message: "" }
        // أو format القديم: { status: int, data: [...], message: string }
        bool isSuccess = false;
        
        // التحقق من status (0 أو 200 يعني نجاح)
        if (data.status != null) {
          if (data.status == 200 || data.status == 0) {
            isSuccess = true;
            print('Success: status is 0 or 200');
          } else if (data.status.toString() == "success") {
            isSuccess = true;
            print('Success: status is "success"');
          }
        }
        
        // إذا كان هناك data (حتى لو status null)، اعتبره نجاح
        if (data.data != null) {
          if (data.data is List) {
            final dataList = data.data as List;
            if (dataList.isNotEmpty) {
              isSuccess = true;
              print('Success: data.data is non-empty List');
            } else {
              print('Warning: data.data is empty List');
            }
          } else {
            isSuccess = true;
            print('Success: data.data is not null (not a List)');
          }
        } else {
          print('Warning: data.data is null');
        }
        
        // التحقق من البيانات وإرجاعها
        if (data.data != null) {
          if (data.data is List) {
            final dataList = data.data as List;
            if (dataList.isNotEmpty) {
              // data.data من MyMessagesModel هو List<Datum>? بالفعل
              // AllMessagesList هو List<Datum>?، لذا يمكننا استخدام data.data مباشرة
              AllMessagesList messagesList = data.data;
              print('Returning messagesList with ${messagesList?.length} items');
              allMessagesResponse = right(messagesList);
            } else {
              print('Error: dataList is empty');
              allMessagesResponse = left(data.message ?? "لا توجد بيانات");
            }
          } else {
            // إذا لم تكن List، نحاول تحويلها
            print('Error: data.data is not a List, type: ${data.data.runtimeType}');
            allMessagesResponse = left(data.message ?? "تنسيق البيانات غير صحيح");
          }
        } else if (isSuccess && data.data == null) {
          print('Error: isSuccess but data.data is null');
          allMessagesResponse = left(data.message ?? "لا توجد بيانات");
        } else {
          print('Error: Failed to fetch data');
          allMessagesResponse = left(data.message ?? "فشل جلب البيانات");
        }
      },
      onError: (code, msg) {
        allMessagesResponse = left(msg.toString());
      },
    );
    return allMessagesResponse;
  }

  @override
  Future<MarkAsReadResponse> markAsRead(String messageId) async {
    MarkAsReadResponse response = left("");
    await getIt<NetworkRequest>().requestFutureData<Map<String, dynamic>>(
      Method.put,
      options: Options(contentType: Headers.jsonContentType),
      url: "${NewApi.doServerAllMessageApiCall}/$messageId/read",
      newBaseUrl: NewApi.baseUrl,
      onSuccess: (data) {
        print('✅ Message marked as read: $messageId');
        response = right(true);
      },
      onError: (code, msg) {
        print('❌ Error marking message as read: $msg');
        response = left(msg.toString());
      },
    );
    return response;
  }

  @override
  Future<DeleteMessageResponse> deleteMessage(String messageId) async {
    DeleteMessageResponse response = left("");
    await getIt<NetworkRequest>().requestFutureData<Map<String, dynamic>>(
      Method.delete,
      options: Options(contentType: Headers.jsonContentType),
      url: "${NewApi.doServerAllMessageApiCall}/$messageId",
      newBaseUrl: NewApi.baseUrl,
      onSuccess: (data) {
        print('✅ Message deleted: $messageId');
        response = right(true);
      },
      onError: (code, msg) {
        print('❌ Error deleting message: $msg');
        response = left(msg.toString());
      },
    );
    return response;
  }
}

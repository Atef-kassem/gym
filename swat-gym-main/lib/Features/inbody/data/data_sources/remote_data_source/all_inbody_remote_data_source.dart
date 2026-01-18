import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import 'package:swat_gym/core/utils/constants.dart';
import 'package:swat_gym/core/utils/functions/setup_service_locator.dart';
import 'package:swat_gym/features/inbody/data/models/all_inbody.dart';
import 'package:hive/hive.dart';
import '../../../../../../core/utils/network/api/network_api.dart';
import '../../../../../../core/utils/network/network_request.dart';
import '../../../../../../core/utils/network/network_utils.dart';
import '../../../../auth/login/domain/entities/employee_entity.dart';
import '../../models/my_inbody_model.dart';

typedef AllInbodyResponse = Either<String, AllInbodyList>;

abstract class AllInbodyRemoteDataSource {
  Future<AllInbodyResponse> fetchAllInbody(String userId);
}

class AllInbodyRemoteDataSourceImpl extends AllInbodyRemoteDataSource {
  @override
  Future<AllInbodyResponse> fetchAllInbody(String userId) async {
    var box = Hive.box<EmployeeEntity>(kEmployeeDataBox);
    AllInbodyResponse allInbodyResponse = left("");
    var queryParams = {
      "page": "1",
      "limit": "100",
      // يمكن إضافة memberId في query params إذا لزم الأمر
    };
    await getIt<NetworkRequest>().requestFutureData<MyInbodyModel>(
      Method.get,
      queryParams: queryParams,
      options: Options(contentType: Headers.jsonContentType),
      url: NewApi.doServerGetInbodyList,
      newBaseUrl: NewApi.baseUrl,
      onSuccess: (data) {
        // onSuccess يتم استدعاؤه عندما يكون isList: false
        // data هو MyInbodyModel
        print('=== Inbody onSuccess Debug ===');
        print('data type: ${data.runtimeType}');
        print('data.status: ${data.status}');
        print('data.message: ${data.message}');
        print('data.data: ${data.data}');
        print('data.data type: ${data.data?.runtimeType}');
        if (data.data is List) {
          print('data.data is List, length: ${(data.data as List).length}');
        }

        // التحقق من success - دعم format الجديد (code: 0) أو format القديم (status: 200)
        bool isSuccess = false;
        if (data.status != null) {
          if (data.status == 200 || data.status == 0 || data.status.toString() == "success") {
            isSuccess = true;
            print('Success: status is ${data.status}');
          }
        } else {
          // إذا لم يكن هناك status، لكن هناك data، اعتبره نجاح
          if (data.data != null && (data.data is List && (data.data as List).isNotEmpty)) {
            isSuccess = true;
            print('Success: data.data is non-empty List');
          }
        }

        // التحقق من البيانات
        if (isSuccess && data.data != null) {
          // التحقق من أن data.data هي List وليست فارغة
          if (data.data is List) {
            final dataList = data.data as List;
            if (dataList.isNotEmpty) {
              print('Returning inbodyList with ${dataList.length} items');
              allInbodyResponse = right(data.data!);
            } else {
              print('Error: dataList is empty');
              allInbodyResponse = left(data.message ?? "لا توجد بيانات");
            }
          } else {
            // إذا لم تكن List، نحاول تحويلها
            print('Error: data.data is not a List, type: ${data.data.runtimeType}');
            allInbodyResponse = left(data.message ?? "تنسيق البيانات غير صحيح");
          }
        } else if (isSuccess && data.data == null) {
          print('Error: isSuccess but data.data is null');
          allInbodyResponse = left(data.message ?? "لا توجد بيانات");
        } else {
          print('Error: Failed to fetch data');
          allInbodyResponse = left(data.message ?? "فشل جلب البيانات");
        }
      },
      onError: (code, msg) {
        allInbodyResponse = left(msg.toString());
      },
    );
    return allInbodyResponse;
  }
}

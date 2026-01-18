import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import 'package:swat_gym/core/utils/functions/setup_service_locator.dart';

import '../../../../../../core/utils/network/api/network_api.dart';
import '../../../../../../core/utils/network/network_request.dart';
import '../../../../../../core/utils/network/network_utils.dart';
import '../../models/my_messages_model/offers.dart';
import '../../models/my_messages_model/my_offers_model.dart';
import '../../../domain/entities/offers_entity.dart';

typedef AllOffersResponse = Either<String, AllOffersList>;

abstract class AllOffersRemoteDataSource {
  Future<AllOffersResponse> fetchAllOffers(String userId);
}

class AllOffersRemoteDataSourceImpl extends AllOffersRemoteDataSource {
  @override
  Future<AllOffersResponse> fetchAllOffers(String userId) async {
    AllOffersResponse allOffersResponse = left("");
    // استخدام query parameters مثل Dashboard: search, isActive
    // إزالة page و limit لأن Backend لا يدعمهما حالياً
    var queryParams = <String, dynamic>{
      "memberId": userId, // إضافة memberId للحصول على معلومات المفضلة
    };
    // يمكن إضافة search و isActive لاحقاً إذا لزم الأمر

    await getIt<NetworkRequest>().requestFutureData<MyOffersModel>(
      Method.get,
      queryParams: queryParams,
      options: Options(contentType: Headers.jsonContentType),
      url: NewApi.doServerGetOfferList,
      newBaseUrl: NewApi.baseUrl,
      onSuccess: (data) {
        // Debug logs
        print('=== Offers onSuccess Debug ===');
        print('data type: ${data.runtimeType}');
        print('data.status: ${data.status}');
        print('data.success: ${data.success}');
        print('data.message: ${data.message}');
        print('data.data: ${data.data}');
        print('data.data type: ${data.data?.runtimeType}');
        if (data.data is List) {
          print('data.data is List, length: ${(data.data as List).length}');
        }

        // التعامل مع format الجديد: { success: true, data: [...], count: ... }
        // أو format القديم: { status: int, data: [...], message: string }
        // أو format من interceptor: { code: 0, data: [...], message: "" }
        bool isSuccess = false;

        // التحقق من success
        if (data.success == true) {
          isSuccess = true;
          print('Success: data.success is true');
        }
        // التحقق من status (0 أو 200 يعني نجاح)
        else if (data.status != null) {
          if (data.status == 200 || data.status == 0) {
            isSuccess = true;
            print('Success: status is 0 or 200');
          } else if (data.status.toString() == "success") {
            isSuccess = true;
            print('Success: status is "success"');
          }
        }
        // إذا لم يكن هناك success أو status، لكن هناك data، اعتبره نجاح
        else if (data.data != null &&
            (data.data is List && (data.data as List).isNotEmpty)) {
          isSuccess = true;
          print('Success: data.data is non-empty List');
        }

        // التحقق من البيانات
        if (isSuccess && data.data != null) {
          // التحقق من أن data هي List وليست فارغة
          if (data.data is List) {
            final dataList = data.data as List;
            if (dataList.isNotEmpty) {
              // data.data من MyOffersModel هو List<Offers>? حيث Offers extends OffersEntity
              // AllOffersList هو List<OffersEntity>?، لذا يمكننا استخدام data.data مباشرة
              // بعد تحويله إلى List<OffersEntity>?
              AllOffersList offersList = data.data?.cast<OffersEntity>();
              print('Returning offersList with ${offersList?.length} items');
              allOffersResponse = right(offersList);
            } else {
              print('Error: dataList is empty');
              allOffersResponse = left(data.message ?? "لا توجد بيانات");
            }
          } else {
            // إذا لم تكن List، نحاول تحويلها
            print(
                'Error: data.data is not a List, type: ${data.data.runtimeType}');
            allOffersResponse = left(data.message ?? "تنسيق البيانات غير صحيح");
          }
        } else if (isSuccess && data.data == null) {
          print('Error: isSuccess but data.data is null');
          allOffersResponse = left(data.message ?? "لا توجد بيانات");
        } else {
          print('Error: Failed to fetch data');
          allOffersResponse = left(data.message ?? "فشل جلب البيانات");
        }
      },
      onError: (code, msg) {
        allOffersResponse = left(msg.toString());
      },
    );
    return allOffersResponse;
  }
}

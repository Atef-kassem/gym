import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import 'package:swat_gym/core/utils/functions/setup_service_locator.dart';
import 'package:swat_gym/features/captains/data/models/captains.dart';
import 'package:swat_gym/features/captains/data/models/captains_model.dart';

import '../../../../../../core/utils/network/api/network_api.dart';
import '../../../../../../core/utils/network/network_request.dart';
import '../../../../../../core/utils/network/network_utils.dart';

typedef AllCaptainsResponse = Either<String, AllCaptainsList>;

abstract class AllCaptainsRemoteDataSource {
  Future<AllCaptainsResponse> fetchAllCaptains(String userId);
}

class AllCaptainsRemoteDataSourceImpl extends AllCaptainsRemoteDataSource {
  @override
  Future<AllCaptainsResponse> fetchAllCaptains(String userId) async {
    AllCaptainsResponse allNewsResponse = left("");
    var queryParams = {"page": "1", "limit": "100"};
    await getIt<NetworkRequest>().requestFutureData<CaptainsModel>(
      Method.get,
      queryParams: queryParams,
      options: Options(contentType: Headers.jsonContentType),
      url: NewApi.doServerGetCaptainsList,
      newBaseUrl: NewApi.baseUrl,
      onSuccess: (data) {
        // التعامل مع format من interceptor: { code: 0, data: [...], message: "" }
        // أو format القديم: { status: int, data: [...], message: string }
        bool isSuccess = false;
        
        // التحقق من status (0 أو 200 يعني نجاح)
        if (data.status != null) {
          if (data.status == 200 || data.status == 0) {
            isSuccess = true;
          } else if (data.status.toString() == "success") {
            isSuccess = true;
          }
        }
        
        // إذا كان هناك data (حتى لو status null)، اعتبره نجاح
        if (data.data != null) {
          if (data.data is List) {
            final dataList = data.data as List;
            if (dataList.isNotEmpty) {
              isSuccess = true;
            }
          } else {
            isSuccess = true;
          }
        }
        
        // التحقق من البيانات وإرجاعها
        if (data.data != null) {
          if (data.data is List) {
            final dataList = data.data as List;
            if (dataList.isNotEmpty) {
              // data.data من CaptainsModel هو List<Captains>? بالفعل
              // AllCaptainsList هو List<Captains>?، لذا يمكننا استخدام data.data مباشرة
              allNewsResponse = right(data.data);
            } else {
              allNewsResponse = left(data.message ?? "لا توجد بيانات");
            }
          } else {
            // إذا لم تكن List، نحاول تحويلها
            allNewsResponse = left(data.message ?? "تنسيق البيانات غير صحيح");
          }
        } else if (isSuccess && data.data == null) {
          allNewsResponse = left(data.message ?? "لا توجد بيانات");
        } else {
          allNewsResponse = left(data.message ?? "فشل جلب البيانات");
        }
      },
      onError: (code, msg) {
        allNewsResponse = left(msg.toString());
      },
    );
    return allNewsResponse;
  }
}

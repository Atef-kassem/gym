import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import 'package:swat_gym/core/utils/functions/setup_service_locator.dart';
import '../../../../../../core/utils/network/api/network_api.dart';
import '../../../../../../core/utils/network/network_request.dart';
import '../../../../../../core/utils/network/network_utils.dart';
import '../models/about_app_model/about_app_model.dart';
import '../models/about_app_model/datum.dart';

typedef AboutAppResponse = Either<String, AboutAppDataList>;

abstract class AboutAppRemoteDataSource {
  Future<AboutAppResponse> fetchAboutAppData();
}

class AboutAppRemoteDataSourceImpl extends AboutAppRemoteDataSource {
  @override
  Future<AboutAppResponse> fetchAboutAppData() async {
    AboutAppResponse aboutAppResponse = left("");

    await getIt<NetworkRequest>().requestFutureData<AboutAppModel>(
      Method.get,
      options: Options(contentType: Headers.jsonContentType),
      url: NewApi.doServerAboutAppApiCall,
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
        if (isSuccess && data.data != null) {
          if (data.data is List) {
            final dataList = data.data as List;
            if (dataList.isNotEmpty) {
              aboutAppResponse = right(data.data);
            } else {
              aboutAppResponse = left(data.message ?? "لا توجد بيانات");
            }
          } else {
            // إذا لم تكن List، نحاول تحويلها
            aboutAppResponse = left(data.message ?? "تنسيق البيانات غير صحيح");
          }
        } else if (isSuccess && data.data == null) {
          aboutAppResponse = left(data.message ?? "لا توجد بيانات");
        } else {
          aboutAppResponse = left(data.message ?? "فشل جلب البيانات");
        }
      },
      onError: (code, msg) {
        aboutAppResponse = left(msg.toString());
      },
    );
    return aboutAppResponse;
  }
}

import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import 'package:swat_gym/features/app_home/data/models/ads_model/ads_model.dart';
import 'package:swat_gym/features/app_home/data/models/my_services_model/my_services_model.dart';
import 'package:swat_gym/features/app_home/domain/entities/services_entity.dart';
import 'package:swat_gym/core/utils/functions/setup_service_locator.dart';

import '../../../../../../core/utils/network/api/network_api.dart';
import '../../../../../../core/utils/network/network_request.dart';
import '../../../../../../core/utils/network/network_utils.dart';

typedef AllServicesResponse = Either<String, ServicesEntity>;
typedef AllAdsResponse = Either<String, AdsList>;

abstract class AllServicesRemoteDataSource {
  Future<AllServicesResponse> fetchAllServices();
  Future<AllAdsResponse> fetchAllAds();
}

class AllServicesRemoteDataSourceImpl extends AllServicesRemoteDataSource {
  @override
  Future<AllServicesResponse> fetchAllServices() async {
    AllServicesResponse allTa3memResponse = left("");

    await getIt<NetworkRequest>().requestFutureData<MyServicesModel>(
      Method.get,
      options: Options(contentType: Headers.jsonContentType),
      url: NewApi.doServerServicesList,
      newBaseUrl: NewApi.baseUrl,
      onSuccess: (data) {
        if ((data.status == 200 || data.status == "success") &&
            data.data != null) {
          allTa3memResponse = right(data);
        } else if ((data.status == 200 || data.status == "success") &&
            data.data == null) {
          allTa3memResponse = left(data.message ?? "لا توجد بيانات");
        } else {
          allTa3memResponse = left(data.message ?? "فشل جلب البيانات");
        }
      },
      onError: (code, msg) {
        allTa3memResponse = left(msg.toString());
      },
    );
    return allTa3memResponse;
  }

  @override
  Future<AllAdsResponse> fetchAllAds() async {
    AllAdsResponse adsResponse = left("");

    await getIt<NetworkRequest>().requestFutureData<AdsModel>(
      Method.get,
      options: Options(contentType: Headers.jsonContentType),
      url: NewApi.doServerAdsList,
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
        // إذا لم يكن هناك status، لكن هناك data، اعتبره نجاح
        else if (data.data != null &&
            (data.data is List && (data.data as List).isNotEmpty)) {
          isSuccess = true;
        }

        // التحقق من البيانات
        if (isSuccess && data.data != null) {
          // التحقق من أن data هي List وليست فارغة
          if (data.data is List) {
            final dataList = data.data as List;
            if (dataList.isNotEmpty) {
              adsResponse = right(data.data!);
            } else {
              adsResponse = left(data.message ?? "لا توجد بيانات");
            }
          } else {
            adsResponse = right(data.data!);
          }
        } else if (isSuccess && data.data == null) {
          adsResponse = left(data.message ?? "لا توجد بيانات");
        } else {
          adsResponse = left(data.message ?? "فشل جلب البيانات");
        }
      },
      onError: (code, msg) {
        adsResponse = left(msg.toString());
      },
    );
    return adsResponse;
  }
}

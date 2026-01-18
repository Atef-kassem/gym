import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import 'package:swat_gym/core/utils/functions/setup_service_locator.dart';
import 'package:swat_gym/features/subscribtions/data/models/my_messages_model/subscribtions.dart';
import 'package:swat_gym/features/subscribtions/data/models/my_messages_model/subscribtions_model.dart';

import '../../../../../core/utils/network/api/network_api.dart';
import '../../../../../core/utils/network/network_request.dart';
import '../../../../../core/utils/network/network_utils.dart';

typedef AllSubscribtionsResponse = Either<String, AllSubscribtionsList>;

abstract class SubscribtionsRemoteDataSource {
  Future<AllSubscribtionsResponse> fetchAllSubscribtions();
}

class SubscribtionsRemoteDataSourceImpl extends SubscribtionsRemoteDataSource {
  @override
  Future<AllSubscribtionsResponse> fetchAllSubscribtions() async {
    AllSubscribtionsResponse allMosalatResponse = left("");

    // الـ API الجديد يستخدم GET مع query parameters
    var queryParams = {
      "page": "1",
      "limit": "100",
      // يمكن إضافة branchId و memberId إذا لزم الأمر
    };
    await getIt<NetworkRequest>().requestFutureData<SubscribtionsModel>(
      Method.get,
      queryParams: queryParams,
      options: Options(contentType: Headers.jsonContentType),
      url: NewApi.doServerGetSubscribtions,
      newBaseUrl: NewApi.baseUrl,
      onSuccess: (data) {
        if ((data.status == 0 || data.status == 200 || data.status == "success") && 
            data.data != null && data.data!.isNotEmpty) {
          allMosalatResponse = right(data.data!);
        } else if ((data.status == 0 || data.status == 200 || data.status == "success") && 
            (data.data == null || data.data!.isEmpty)) {
          allMosalatResponse = left(data.message ?? "لا توجد بيانات");
        } else {
          allMosalatResponse = left(data.message ?? "فشل جلب البيانات");
        }
      },
      onError: (code, msg) {
        allMosalatResponse = left(msg.toString());
      },
    );
    return allMosalatResponse;
  }
}

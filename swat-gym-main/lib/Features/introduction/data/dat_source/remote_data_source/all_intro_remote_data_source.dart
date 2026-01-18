import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import 'package:swat_gym/features/introduction/data/models/my_services_model/intro.dart';
import 'package:swat_gym/features/introduction/data/models/my_services_model/my_intro_model.dart';
import 'package:swat_gym/core/utils/functions/setup_service_locator.dart';

import '../../../../../core/utils/network/api/network_api.dart';
import '../../../../../core/utils/network/network_request.dart';
import '../../../../../core/utils/network/network_utils.dart';

typedef AllIntroResponse = Either<String, AllIntroList>;

abstract class AllIntroRemoteDataSource {
  Future<AllIntroResponse> fetchAllServices();
}

class AllIntroRemoteDataSourceImpl extends AllIntroRemoteDataSource {
  @override
  Future<AllIntroResponse> fetchAllServices() async {
    AllIntroResponse allTa3memResponse = left("");

    await getIt<NetworkRequest>().requestFutureData<MyIntroModel>(
      Method.get,
      options: Options(
        contentType: Headers.jsonContentType,
      ),
      url: NewApi.doSplashScreens,
      newBaseUrl: NewApi.baseUrl,

      onSuccess: (data) {
        if ((data.status == 200 || data.status == "success") && data.data != null) {
          allTa3memResponse = right(data.data);
        } else if ((data.status == 200 || data.status == "success") && data.data == null) {
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
}

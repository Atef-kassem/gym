import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import 'package:swat_gym/features/calender/data/models/calender_model/calender_model.dart';
import 'package:swat_gym/core/utils/functions/setup_service_locator.dart';
import '../../../../../core/utils/network/api/network_api.dart';
import '../../../../../core/utils/network/network_request.dart';
import '../../../../../core/utils/network/network_utils.dart';

typedef CalenderResponse = Either<String, CalenderList>;

abstract class CalenderRemoteDataSource {
  Future<CalenderResponse> fetchCalenderData(String month, String empId);
}

class CalenderRemoteDataSourceImpl extends CalenderRemoteDataSource {
  @override
  Future<CalenderResponse> fetchCalenderData(String month, String empId) async {
    CalenderResponse loginResponse = left("");

    // الـ API الجديد قد يستخدم query parameters بدلاً من body
    var queryParams = {
      "memberId": empId.trim(),
      "month": month.trim(),
    };
    await getIt<NetworkRequest>().requestFutureData<CalenderModel>(
      Method.get,
      queryParams: queryParams,
      options: Options(contentType: Headers.jsonContentType),
      url: NewApi.doServerCalenderApiCall,
      newBaseUrl: NewApi.baseUrl,
      onSuccess: (data) {
        if (data.status == 200 || data.status == "success") {
          loginResponse = right(data.data);
        } else {
          loginResponse = left(data.message ?? "فشل جلب البيانات");
        }
      },
      onError: (code, msg) {
        loginResponse = left(msg.toString());
      },
    );
    return loginResponse;
  }
}

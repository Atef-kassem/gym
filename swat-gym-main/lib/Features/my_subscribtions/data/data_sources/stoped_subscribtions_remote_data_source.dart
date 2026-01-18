import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import 'package:swat_gym/core/utils/constants.dart';
import 'package:swat_gym/core/utils/functions/setup_service_locator.dart';
import 'package:swat_gym/features/auth/login/domain/entities/employee_entity.dart';
import 'package:swat_gym/features/subscribtions/data/models/delete_and_add_model.dart';
import 'package:hive/hive.dart';

import '../../../../../core/utils/network/api/network_api.dart';
import '../../../../../core/utils/network/network_request.dart';
import '../../../../../core/utils/network/network_utils.dart';

typedef StopedSubscribtionsResponse = Either<String, String>;

abstract class StopedSubscribtionsRemoteDataSource {
  Future<StopedSubscribtionsResponse> stopedSubscribtions(
      fromDate, subId, reason, numDays, typeFK);
}

class StopedSubscribtionsRemoteDataSourceImpl
    extends StopedSubscribtionsRemoteDataSource {
  @override
  Future<StopedSubscribtionsResponse> stopedSubscribtions(
      fromDate, subId, reason, numDays, typeFK) async {
    StopedSubscribtionsResponse addSubscribtionsResponse = left("");
    var box = Hive.box<EmployeeEntity>(kEmployeeDataBox);

    // الـ API الجديد قد يستخدم pauseDate, subscriptionId, reason, duration
    var body = {
      "pauseDate": fromDate,
      "subscriptionId": int.tryParse(subId.toString()) ?? subId,
      "reason": reason,
      "duration": int.tryParse(numDays.toString()) ?? numDays,
    };
    await getIt<NetworkRequest>().requestFutureData<DeleteAndAddModel>(
      Method.post,
      params: body,
      options: Options(contentType: Headers.jsonContentType),
      url: NewApi.stopedServerSubscribtions,
      newBaseUrl: NewApi.baseUrl,
      onSuccess: (data) {
        if (data.status == 200 ||
            data.status == 201 ||
            data.status == "success") {
          addSubscribtionsResponse =
              right(data.message ?? "تم إيقاف الاشتراك بنجاح");
        } else {
          addSubscribtionsResponse = left(data.message ?? "فشل إيقاف الاشتراك");
        }
      },
      onError: (code, msg) {
        addSubscribtionsResponse = left(msg.toString());
      },
    );
    return addSubscribtionsResponse;
  }
}

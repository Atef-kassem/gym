import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import 'package:swat_gym/features/new_bsama_add_Fingerprint/data/models/finger_print_model/new_finger_print_model.dart';
import 'package:swat_gym/features/new_bsama_add_Fingerprint/domain/entities/new_finger_print_entity.dart';

import '../../../../../../core/utils/functions/setup_service_locator.dart';
import '../../../../../../core/utils/network/api/network_api.dart';
import '../../../../../../core/utils/network/network_request.dart';
import '../../../../../../core/utils/network/network_utils.dart';

typedef FingerPrintResponse = Either<String, NewFingerPrintEntity>;

abstract class FingerPrintRemoteDataSource {
  Future<FingerPrintResponse> addFingerPrint(String empId);
}

class FingerPrintRemoteDataSourceImpl extends FingerPrintRemoteDataSource {
  @override
  Future<FingerPrintResponse> addFingerPrint(String empId) async {
    FingerPrintResponse fingerPrintResponse = left("");

    // الـ API الجديد قد يستخدم employeeId أو userId
    var body = {
      'employeeId': empId,
    };
    await getIt<NetworkRequest>().requestFutureData<NewFingerPrintModel>(
      Method.post,
      params: body,
      options: Options(contentType: Headers.jsonContentType),
      url: NewApi.doServerNewBasma, // استخدام endpoint الجديد
      newBaseUrl: NewApi.baseUrl,
      onSuccess: (data) {
        if (data.status == 200 || data.status == "success") {
          fingerPrintResponse = right(data);
        } else {
          fingerPrintResponse = left(data.message?.toString() ?? "فشل العملية");
        }
      },
      onError: (code, msg) {
        fingerPrintResponse = left(msg.toString());
      },
    );
    return fingerPrintResponse;

    // var loginData = await apiService.fingerPrintPost(
    //     endPoint: "/attendance",
    //     branchId: branchId,
    //     empId: empId,
    //     long: long,
    //     lat: lat,
    //     type: type);
    // FingerPrintModel.fromJson(loginData);
    // FingerPrintEntity fingerPrintEntity = FingerPrintModel.fromJson(loginData);

    // return fingerPrintEntity;

    //     var loginData = await apiService.loginPost(
    //     endPoint: "/login_by_mobile", mobileNumber: phone);

    // LoginEntity yy = loginData.data;
    // return yy;
  }
}

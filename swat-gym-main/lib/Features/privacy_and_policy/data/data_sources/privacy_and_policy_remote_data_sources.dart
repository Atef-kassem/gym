import 'package:swat_gym/features/privacy_and_policy/data/models/privacy_and_policy_model.dart';
import 'package:swat_gym/features/privacy_and_policy/domain/entities/privacy_and_policy_entity.dart';
import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';

import '../../../../../../core/utils/functions/setup_service_locator.dart';
import '../../../../../../core/utils/network/api/network_api.dart';
import '../../../../../../core/utils/network/network_request.dart';
import '../../../../../../core/utils/network/network_utils.dart';

typedef PrivacyAndPolicyResponse = Either<String, PrivacyAndPolicyEntity>;

abstract class PrivacyAndPolicyRemoteDataSource {
  Future<PrivacyAndPolicyResponse> getPrivacyAndPolicyData();
}

class PrivacyAndPolicyRemoteDataSourceImpl
    extends PrivacyAndPolicyRemoteDataSource {
  @override
  Future<PrivacyAndPolicyResponse> getPrivacyAndPolicyData() async {
    PrivacyAndPolicyResponse privacyAndPolicyResponse = left("");

    await getIt<NetworkRequest>().requestFutureData<PrivacyAndPolicyModel>(
      Method.get,
      options: Options(contentType: Headers.jsonContentType),
      url: NewApi.doServerPrivacyAndPolicyCall,
      newBaseUrl: NewApi.baseUrl,
      onSuccess: (data) {
        // Debug logs
        print('=== PrivacyAndPolicy onSuccess Debug ===');
        print('data type: ${data.runtimeType}');
        print('data.status: ${data.status}');
        print('data.message: ${data.message}');
        print('data.data: ${data.data}');
        
        // التحقق من success - دعم format الجديد (code: 0) أو format القديم (status: 200)
        bool isSuccess = false;
        if (data.status != null) {
          if (data.status == 200 || data.status == 0 || data.status.toString() == "success") {
            isSuccess = true;
            print('Success: status is ${data.status}');
          }
        } else {
          // إذا لم يكن هناك status، لكن هناك data، اعتبره نجاح
          if (data.data != null && data.data.toString().isNotEmpty) {
            isSuccess = true;
            print('Success: data.data is not empty');
          }
        }
        
        if (isSuccess) {
          privacyAndPolicyResponse = right(data);
        } else {
          privacyAndPolicyResponse = left(data.message ?? "فشل جلب البيانات");
        }
      },
      onError: (code, msg) {
        privacyAndPolicyResponse = left(msg.toString());
      },
    );
    return privacyAndPolicyResponse;
  }
}

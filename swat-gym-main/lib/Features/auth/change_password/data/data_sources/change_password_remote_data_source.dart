import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import 'package:swat_gym/features/auth/login/data/models/login_model/login_model/employee_model.dart';
import 'package:swat_gym/features/auth/login/domain/entities/employee_entity.dart';

import '../../../../../../core/utils/network/network_request.dart';
import '../../../../../core/utils/functions/setup_service_locator.dart';
import '../../../../../core/utils/network/api/network_api.dart';
import '../../../../../core/utils/network/network_utils.dart';

typedef ChangePasswordResponse = Either<String, EmployeeEntity>;

abstract class ChangePasswordRemoteDataSource {
  Future<ChangePasswordResponse> changePassword(
    String userId,
    String confirmUserPass,
    String newPassword,
  );
}

class ChangePasswordRemoteDataSourceImpl
    extends ChangePasswordRemoteDataSource {
  @override
  Future<ChangePasswordResponse> changePassword(
    String userId,
    String confirmUserPass,
    String newPassword,
  ) async {
    ChangePasswordResponse changePasswordResponse = left("");

    // الـ API الجديد يستخدم passwordCurrent, password, passwordConfirm
    var body = {
      "passwordCurrent": confirmUserPass,
      "password": newPassword,
      "passwordConfirm": newPassword,
    };
    await getIt<NetworkRequest>().requestFutureData<EmployeeModel>(
      Method.patch,
      params: body,
      options: Options(contentType: Headers.jsonContentType),
      url: NewApi.doServerChangePasswordApiCall,
      newBaseUrl: NewApi.baseUrl,
      onSuccess: (data) {
        if (data.status == 200 || data.status == "success") {
          changePasswordResponse = right(data.data);
        } else {
          changePasswordResponse =
              left(data.message?.toString() ?? "فشل تغيير كلمة المرور");
        }
      },
      onError: (code, msg) {
        changePasswordResponse = left(msg.toString());
      },
    );
    return changePasswordResponse;
  }
}

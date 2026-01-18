import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';

import '../../../../../../../core/utils/network/network_request.dart';
import '../../../../../../core/utils/functions/setup_service_locator.dart';
import '../../../../../../core/utils/network/api/network_api.dart';
import '../../../../../../core/utils/network/network_utils.dart';
import '../../../domain/entities/register_entity.dart';
import '../../models/register_model/register_model.dart';

typedef RegisterResponse = Either<String, RegisterEntity>;

abstract class RegisterRemoteDataSource {
  Future<RegisterResponse> register(
    String name,
    String branchId,
    String gender,
    String phone,
    String password,
    String confirmPassword,
  );
}

class RegisterRemoteDataSourceImpl extends RegisterRemoteDataSource {
  @override
  Future<RegisterResponse> register(
    String name,
    String branchId,
    String gender,
    String phone,
    String password,
    String confirmPassword,
    ) async {
    RegisterResponse registerResponse = left("");

    // الـ API الجديد يستخدم arabicName, email, password, phoneNumber, branchId
    var body = {
      "arabicName": name,
      "englinshName": name, // يمكن تحديثه لاحقاً
      "email": phone.trim().contains("@") ? phone.trim() : "${phone.trim()}@gym.com",
      "phoneNumber": phone.trim(),
      "password": password,
      "branchId": int.tryParse(branchId) ?? 1, // تحويل branchId إلى int
    };
    await getIt<NetworkRequest>().requestFutureData<RegisterModel>(
      Method.post,
      params: body,
      options: Options(contentType: Headers.jsonContentType),
      url: NewApi.doServerRegisterApiCall,
      newBaseUrl: NewApi.baseUrl,
      onSuccess: (data) {
        // الـ API الجديد يرجع status: "success" أو رقم HTTP status
        if (data.status == 200 || data.status == 201 || data.status == "success") {
          registerResponse = right(data);
        } else {
          registerResponse = left(data.message?.toString() ?? "فشل التسجيل");
        }
      },
      onError: (code, msg) {
        registerResponse = left(msg.toString());
      },
    );
    return registerResponse;
  }
}

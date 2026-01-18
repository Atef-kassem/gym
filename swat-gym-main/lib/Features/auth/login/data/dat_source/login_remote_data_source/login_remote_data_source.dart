import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';

import '../../../../../../core/utils/functions/setup_service_locator.dart';
import '../../../../../../core/utils/network/api/network_api.dart';
import '../../../../../../core/utils/network/network_request.dart';
import '../../../../../../core/utils/network/network_utils.dart';
import 'package:swat_gym/features/auth/login/data/models/login_model/login_model/employee_model.dart';

typedef LoginResponse = Either<String, EmployeeModel>;

abstract class LoginRemoteDataSource {
  Future<LoginResponse> login(String phone, String password);
}

class LoginRemoteDataSourceImpl extends LoginRemoteDataSource {
  @override
  Future<LoginResponse> login(String phone, String password) async {
    LoginResponse loginResponse = left("");

    // تنظيف رقم الهاتف: إزالة المسافات والرموز الخاصة
    String cleanPhone = phone.trim().replaceAll(RegExp(r'[\s\-\(\)\+]'), '');

    // إزالة البادئة 0 أو +20 أو 20 إذا كانت موجودة (للتوحيد)
    if (cleanPhone.startsWith('+20')) {
      cleanPhone = cleanPhone.substring(3);
    } else if (cleanPhone.startsWith('20') && cleanPhone.length > 10) {
      cleanPhone = cleanPhone.substring(2);
    }

    // الـ API الجديد يستخدم phoneNumber وكلمة المرور لتسجيل الدخول
    var body = {
      "phoneNumber": cleanPhone,
      "password": password,
    };
    await getIt<NetworkRequest>().requestFutureData<EmployeeModel>(
      Method.post,
      params: body,
      options: Options(contentType: Headers.jsonContentType),
      url: NewApi.doServerLoginApiCall,
      newBaseUrl: NewApi.baseUrl,
      onSuccess: (data) {
        // بعد AdapterInterceptor و BaseResponse.fromJson
        // data هو EmployeeModel الذي يحتوي على data (Employee) و status و message
        print('=== Login onSuccess Debug ===');
        print('data type: ${data.runtimeType}');
        print('data.data: ${data.data}');
        print('data.data type: ${data.data?.runtimeType}');
        print('data.status: ${data.status}');
        print('data.message: ${data.message}');

        // التحقق من وجود بيانات المستخدم
        // إذا كان data.data موجوداً (Employee object)، يعتبر نجاح
        if (data.data != null) {
          print('Login successful - data.data is not null');
          loginResponse = right(data);
        } else {
          // التحقق من status
          bool isSuccess = false;
          if (data.status != null) {
            if (data.status is int) {
              isSuccess = (data.status == 0 || data.status == 200);
            } else if (data.status is String) {
              isSuccess =
                  (data.status == "success" || data.status == "Success");
            }
          }

          if (isSuccess) {
            print('Login successful - status indicates success');
            loginResponse = right(data);
          } else {
            print('Login failed - no data and status not successful');
            loginResponse = left(data.message ?? "فشل تسجيل الدخول");
          }
        }
      },
      onError: (code, msg) {
        loginResponse = left(msg.toString());
      },
    );
    return loginResponse;
  }
}

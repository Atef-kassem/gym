import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import 'package:swat_gym/features/auth/login/data/models/login_model/login_model/employee_model.dart';
import 'package:swat_gym/features/auth/login/data/models/login_model/login_model/employee.dart';

import '../../../../../../core/utils/network/network_request.dart';
import '../../../../../core/utils/functions/setup_service_locator.dart';
import '../../../../../core/utils/network/api/network_api.dart';
import '../../../../../core/utils/network/network_utils.dart';

typedef GetProfileResponse = Either<String, EmployeeModel>;

abstract class GetProfileRemoteDataSource {
  Future<GetProfileResponse> getProfile(
    String phone,
  );
}

class GetProfileRemoteDataSourceImpl extends GetProfileRemoteDataSource {
  @override
  Future<GetProfileResponse> getProfile(
    String phone,
  ) async {
    GetProfileResponse getProfileResponse = left("");
    
    // تنظيف رقم الهاتف: إزالة المسافات والرموز الخاصة (مثل ما فعلنا في login)
    String cleanPhone = phone.trim().replaceAll(RegExp(r'[\s\-\(\)\+]'), '');
    
    print('=== GetProfile Debug ===');
    print('Original phone: $phone');
    print('Cleaned phone: $cleanPhone');
    
    // جلب بيانات العضو المرتبط برقم الهاتف من جدول الأعضاء (يحمل الباركود)
    // نستخدم search parameter للبحث في phone field
    await getIt<NetworkRequest>().requestFutureData<Employee>(
      Method.get,
      options: Options(contentType: Headers.jsonContentType),
      url: NewApi.doServerGetMembers, // "/gym/members"
      newBaseUrl: NewApi.baseUrl,
      queryParams: {
        "search": cleanPhone, // استخدام search بدلاً من phone للبحث المرن
      },
      isList: true,
      onSuccessList: (list) {
        print('=== GetProfile Success ===');
        print('Found ${list.length} members');
        
        if (list.isNotEmpty) {
          // البحث عن العضو الذي يطابق رقم الهاتف بدقة
          Employee? matchedMember;
          
          // أولاً: البحث عن تطابق دقيق
          for (var member in list) {
            String? memberPhone = member.phone?.toString().trim().replaceAll(RegExp(r'[\s\-\(\)\+]'), '');
            print('Comparing: $cleanPhone with $memberPhone');
            
            if (memberPhone == cleanPhone) {
              matchedMember = member;
              print('✅ Exact match found!');
              break;
            }
            
            // أيضاً: البحث بدون البادئة 0 أو معها
            if (cleanPhone.startsWith('0') && memberPhone == cleanPhone.substring(1)) {
              matchedMember = member;
              print('✅ Match found (without leading 0)!');
              break;
            }
            
            if (!cleanPhone.startsWith('0') && memberPhone == '0$cleanPhone') {
              matchedMember = member;
              print('✅ Match found (with leading 0)!');
              break;
            }
          }
          
          // إذا لم نجد تطابق دقيق، نأخذ أول عضو (fallback)
          matchedMember ??= list.first;
          print('Using member: ${matchedMember.name} (${matchedMember.phone})');
          
          // نأخذ العضو المطابق ونبنيه داخل EmployeeModel
          final model = EmployeeModel(
            status: 0,
            message: null,
            data: matchedMember,
            logoutOption: null,
          );
          getProfileResponse = right(model);
          print('✅ Profile data prepared successfully');
        } else {
          print('❌ No members found');
          getProfileResponse =
              left("لا توجد بيانات مطابقة لهذا الجوال");
        }
      },
      onError: (code, msg) {
        print('❌ GetProfile Error: $code - $msg');
        getProfileResponse = left(msg.toString());
      },
    );
    return getProfileResponse;
  }
}

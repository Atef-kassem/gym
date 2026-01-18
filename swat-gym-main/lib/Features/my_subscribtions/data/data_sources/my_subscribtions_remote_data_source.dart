import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import 'package:swat_gym/core/utils/functions/setup_service_locator.dart';
import 'package:swat_gym/features/my_subscribtions/data/models/my_messages_model/my_subscribtions.dart';
import 'package:swat_gym/features/my_subscribtions/data/models/my_messages_model/my_subscribtions_model.dart';

import '../../../../../core/utils/network/api/network_api.dart';
import '../../../../../core/utils/network/network_request.dart';
import '../../../../../core/utils/network/network_utils.dart';

typedef MySubscribtionsResponse = Either<String, AllSubscribtionsList>;

abstract class MySubscribtionsRemoteDataSource {
  Future<MySubscribtionsResponse> fetchAllMosalat({int? memberId});
}

class MySubscribtionsRemoteDataSourceImpl
    extends MySubscribtionsRemoteDataSource {
  @override
  Future<MySubscribtionsResponse> fetchAllMosalat({int? memberId}) async {
    MySubscribtionsResponse allMosalatResponse = left("");

    // الـ API الجديد يستخدم GET مع query parameters
    var queryParams = {
      "page": "1",
      "limit": "100",
    };
    
    // إضافة memberId في query params إذا كان موجوداً
    if (memberId != null) {
      queryParams["memberId"] = memberId.toString();
    }
    
    await getIt<NetworkRequest>().requestFutureData<MySubscribtionsModel>(
      Method.get,
      queryParams: queryParams,
      options: Options(contentType: Headers.jsonContentType),
      url: NewApi.doServerGetMySubscribtions,
      newBaseUrl: NewApi.baseUrl,
      isList: false, // تغيير إلى false لأننا نريد Model وليس List مباشرة
      onSuccess: (data) {
        print('=== MySubscribtions Success ===');
        print('Received MySubscribtionsModel with ${data.data?.length ?? 0} subscriptions');
        
        if ((data.status == 0 || data.status == 200 || data.status == "success") &&
            data.data != null && data.data is List) {
          // فلترة الاشتراكات بناءً على memberId
          List<MySubscribtions> filteredList = (data.data as List).cast<MySubscribtions>();
          if (memberId != null) {
            filteredList = filteredList.where((sub) {
              final subMemberId = sub.memIdFk;
              if (subMemberId != null) {
                try {
                  return int.parse(subMemberId) == memberId;
                } catch (e) {
                  return false;
                }
              }
              return false;
            }).toList();
            print('Filtered to ${filteredList.length} subscriptions for memberId: $memberId');
          }
          
          if (filteredList.isNotEmpty) {
            allMosalatResponse = right(filteredList);
          } else {
            allMosalatResponse = left("لا توجد اشتراكات");
          }
        } else if ((data.status == 0 || data.status == 200 || data.status == "success") &&
            (data.data == null || (data.data is List && (data.data as List).isEmpty))) {
          allMosalatResponse = left(data.message ?? "لا توجد اشتراكات");
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

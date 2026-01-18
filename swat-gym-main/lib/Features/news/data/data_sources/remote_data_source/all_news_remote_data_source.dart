import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import 'package:swat_gym/core/utils/functions/setup_service_locator.dart';

import '../../../../../../core/utils/network/api/network_api.dart';
import '../../../../../../core/utils/network/network_request.dart';
import '../../../../../../core/utils/network/network_utils.dart';
import '../../models/news.dart';
import '../../models/my_news_model.dart';

typedef AllNewsResponse = Either<String, AllNewsList>;

abstract class AllNewsRemoteDataSource {
  Future<AllNewsResponse> fetchAllNews(String userId);
}

class AllNewsRemoteDataSourceImpl extends AllNewsRemoteDataSource {
  @override
  Future<AllNewsResponse> fetchAllNews(String userId) async {
    AllNewsResponse allNewsResponse = left("");
    var queryParams = {"page": "1", "limit": "100"};
    await getIt<NetworkRequest>().requestFutureData<MyNewsModel>(
      Method.get,
      queryParams: queryParams,
      options: Options(contentType: Headers.jsonContentType),
      url: NewApi.doServerGetNewsList,
      newBaseUrl: NewApi.baseUrl,
      onSuccess: (data) {
        // Debug logs
        print('=== News onSuccess Debug ===');
        print('data type: ${data.runtimeType}');
        print('data.status: ${data.status}');
        print('data.message: ${data.message}');
        print('data.data: ${data.data}');
        print('data.data type: ${data.data?.runtimeType}');
        if (data.data is List) {
          print('data.data is List, length: ${(data.data as List).length}');
        }
        
        // التعامل مع format من interceptor: { code: 0, data: [...], message: "" }
        // أو format القديم: { status: int, data: [...], message: string }
        bool isSuccess = false;
        
        // التحقق من status (0 أو 200 يعني نجاح)
        if (data.status != null) {
          if (data.status == 200 || data.status == 0) {
            isSuccess = true;
            print('Success: status is 0 or 200');
          } else if (data.status.toString() == "success") {
            isSuccess = true;
            print('Success: status is "success"');
          }
        }
        
        // إذا كان هناك data (حتى لو status null)، اعتبره نجاح
        if (data.data != null) {
          if (data.data is List) {
            final dataList = data.data as List;
            if (dataList.isNotEmpty) {
              isSuccess = true;
              print('Success: data.data is non-empty List');
            } else {
              print('Warning: data.data is empty List');
            }
          } else {
            isSuccess = true;
            print('Success: data.data is not null (not a List)');
          }
        } else {
          print('Warning: data.data is null');
        }
        
        // التحقق من البيانات وإرجاعها
        if (data.data != null) {
          if (data.data is List) {
            final dataList = data.data as List;
            if (dataList.isNotEmpty) {
              // data.data من MyNewsModel هو List<News>? بالفعل
              // AllNewsList هو List<News>?، لذا يمكننا استخدام data.data مباشرة
              AllNewsList newsList = data.data;
              print('Returning newsList with ${newsList?.length} items');
              allNewsResponse = right(newsList);
            } else {
              print('Error: dataList is empty');
              allNewsResponse = left(data.message ?? "لا توجد بيانات");
            }
          } else {
            // إذا لم تكن List، نحاول تحويلها
            print('Error: data.data is not a List, type: ${data.data.runtimeType}');
            allNewsResponse = left(data.message ?? "تنسيق البيانات غير صحيح");
          }
        } else if (isSuccess && data.data == null) {
          print('Error: isSuccess but data.data is null');
          allNewsResponse = left(data.message ?? "لا توجد بيانات");
        } else {
          print('Error: Failed to fetch data');
          allNewsResponse = left(data.message ?? "فشل جلب البيانات");
        }
      },
      onError: (code, msg) {
        allNewsResponse = left(msg.toString());
      },
    );
    return allNewsResponse;
  }
}

import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import 'package:swat_gym/features/exercises/data/models/my_messages_model/exercise.dart';
import 'package:swat_gym/features/exercises/data/models/my_messages_model/exercise_cat_model.dart';
import 'package:swat_gym/core/utils/functions/setup_service_locator.dart';

import '../../../../../../core/utils/network/api/network_api.dart';
import '../../../../../../core/utils/network/network_request.dart';
import '../../../../../../core/utils/network/network_utils.dart';
import '../../models/my_messages_model/exercise_cat.dart';
import '../../models/my_messages_model/exercise_model.dart';

typedef AllExercisesResponse = Either<String, AllExercisesList>;
typedef AllExercisescatResponse = Either<String, AllExercisesCatList>;

abstract class AllExercisesRemoteDataSource {
  Future<AllExercisescatResponse> fetchAllExercisesCat(String userId);
  Future<AllExercisesResponse> fetchAllExercises(String catId);
}

class AllExercisesRemoteDataSourceImpl extends AllExercisesRemoteDataSource {
  @override
  Future<AllExercisesResponse> fetchAllExercises(String catId) async {
    AllExercisesResponse allExercisesResponse = left("");
    var queryParams = {"page": "1", "limit": "100", "categoryId": catId};
    await getIt<NetworkRequest>().requestFutureData<ExerciseModel>(
      Method.get,
      queryParams: queryParams,
      options: Options(contentType: Headers.jsonContentType),
      url: NewApi.doServerGetExercisesList,
      newBaseUrl: NewApi.baseUrl,
      onSuccess: (data) {
        // التعامل مع format من interceptor: { code: 0, data: [...], message: "" }
        // أو format القديم: { status: int, data: [...], message: string }
        bool isSuccess = false;
        
        // التحقق من status (0 أو 200 يعني نجاح)
        if (data.status != null) {
          if (data.status == 200 || data.status == 0) {
            isSuccess = true;
          } else if (data.status.toString() == "success") {
            isSuccess = true;
          }
        }
        
        // إذا كان هناك data (حتى لو status null)، اعتبره نجاح
        // لكن إذا كانت القائمة فارغة و status == 0، فهذا يعني نجاح لكن لا توجد بيانات
        if (data.data != null) {
          if (data.data is List) {
            final dataList = data.data as List;
            if (dataList.isNotEmpty) {
              isSuccess = true;
            } else {
              // القائمة فارغة - إذا كان status == 0، فهذا يعني نجاح لكن لا توجد بيانات
              if (data.status == 0 || data.status == 200) {
                isSuccess = true;
              }
            }
          } else {
            isSuccess = true;
          }
        }
        
        // Debug logs
        print('=== Exercises onSuccess Debug ===');
        print('data type: ${data.runtimeType}');
        print('data.status: ${data.status}');
        print('data.message: ${data.message}');
        print('data.data: ${data.data}');
        print('data.data type: ${data.data?.runtimeType}');
        if (data.data is List) {
          print('data.data is List, length: ${(data.data as List).length}');
        }
        
        // التحقق من البيانات وإرجاعها
        if (data.data != null && data.data is List) {
          final dataList = data.data as List;
          if (dataList.isNotEmpty) {
            // data.data من ExerciseModel هو List<Exercise>? بالفعل
            // AllExercisesList هو List<ExerciseEntity>?، و Exercise extends ExerciseEntity
            AllExercisesList exercisesList = dataList.cast<Exercise>();
            print('Returning exercisesList with ${exercisesList.length} items');
            allExercisesResponse = right(exercisesList);
          } else {
            print('Error: dataList is empty');
            allExercisesResponse = left(data.message ?? "لا توجد بيانات");
          }
        } else if (isSuccess && (data.data == null || (data.data is List && (data.data as List).isEmpty))) {
          print('Error: isSuccess but data.data is null or empty');
          allExercisesResponse = left(data.message ?? "لا توجد بيانات");
        } else {
          print('Error: Failed to fetch data');
          allExercisesResponse = left(data.message ?? "فشل جلب البيانات");
        }
      },
      onError: (code, msg) {
        allExercisesResponse = left(msg.toString());
      },
    );
    return allExercisesResponse;
  }

  @override
  Future<AllExercisescatResponse> fetchAllExercisesCat(String userId) async {
    AllExercisescatResponse allExercisesCatResponse = left("");
    var queryParams = {"page": "1", "limit": "100"};
    await getIt<NetworkRequest>().requestFutureData<ExerciseCatModel>(
      Method.get,
      queryParams: queryParams,
      options: Options(contentType: Headers.jsonContentType),
      url: NewApi.doServerExercisesCat,
      newBaseUrl: NewApi.baseUrl,
      onSuccess: (data) {
        // التعامل مع format من interceptor: { code: 0, data: [...], message: "" }
        // أو format القديم: { status: int, data: [...], message: string }
        bool isSuccess = false;
        
        // التحقق من status (0 أو 200 يعني نجاح)
        if (data.status != null) {
          if (data.status == 200 || data.status == 0) {
            isSuccess = true;
          } else if (data.status.toString() == "success") {
            isSuccess = true;
          }
        }
        
        // إذا كان هناك data (حتى لو status null)، اعتبره نجاح
        if (data.data != null) {
          if (data.data is List) {
            final dataList = data.data as List;
            if (dataList.isNotEmpty) {
              isSuccess = true;
            }
          } else {
            isSuccess = true;
          }
        }
        
        // التحقق من البيانات وإرجاعها
        if (data.data != null && data.data is List) {
          final dataList = data.data as List;
          if (dataList.isNotEmpty) {
            // data.data من ExerciseCatModel هو List<ExerciseCat>? بالفعل
            allExercisesCatResponse = right(dataList.cast());
          } else {
            // القائمة فارغة - لا توجد بيانات
            allExercisesCatResponse = left(data.message ?? "لا توجد بيانات");
          }
        } else if (isSuccess && (data.data == null || (data.data is List && (data.data as List).isEmpty))) {
          allExercisesCatResponse = left(data.message ?? "لا توجد بيانات");
        } else {
          allExercisesCatResponse = left(data.message ?? "فشل جلب البيانات");
        }
      },
      onError: (code, msg) {
        allExercisesCatResponse = left(msg.toString());
      },
    );
    return allExercisesCatResponse;
  }
}

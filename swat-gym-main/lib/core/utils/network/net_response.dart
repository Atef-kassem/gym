import 'dart:convert';

import '../constants.dart';
import 'entity_factory.dart';

///Basic classes for data analysis
class BaseResponse<T> {
  int? code;
  String? message;
  T? data;
  List<T>? listData = [];

  BaseResponse(this.code, this.message, this.data);

  BaseResponse.fromJson(Map<String, dynamic> json) {
    code = json[AppConstant.code];
    message = json[AppConstant.message];
    if (json.containsKey(AppConstant.data)) {
      dynamic dataValue = json[AppConstant.data];
      
      // إذا كان dataValue هو string، حاول تحويله إلى JSON
      if (dataValue is String && dataValue.isNotEmpty) {
        try {
          final decoded = jsonDecode(dataValue);
          if (decoded is List) {
            dataValue = decoded;
          } else if (decoded is Map) {
            // إذا كان decoded هو Map، استخدمه مباشرة
            dataValue = decoded;
          }
        } catch (e) {
          // إذا فشل التحويل، استخدم القيمة الأصلية
        }
      }
      
      if (dataValue is List) {
        // إذا كان T هو Model يحتوي على List في data (مثل MyNewsModel, MyOffersModel, AdsModel)
        // يجب تحويل json كله إلى T (لأن T يحتوي على data الذي هو List)
        // التحقق من أن T هو Model وليس نوع بسيط
        final typeString = T.toString();
        
        // قائمة بجميع Models التي تحتوي على data List
        final modelsWithListData = [
          "MyNewsModel", "MyOffersModel", "AdsModel", "MyServicesModel",
          "SubscribtionsModel", "MyMessagesModel", "MySubscribtionsModel",
          "ExerciseModel", "ExerciseCatModel", "CaptainsModel", "MyInbodyModel"
        ];
        
        bool isModelWithListData = modelsWithListData.any((modelName) => 
          typeString.contains(modelName));
        
        if (isModelWithListData) {
          // تحويل json كله إلى Model (لأن Model يحتوي على data List)
          // لكن أولاً نحتاج إلى تحديث json[AppConstant.data] بالقيمة المحولة
          final updatedJson = Map<String, dynamic>.from(json);
          updatedJson[AppConstant.data] = dataValue;
          final generatedObj = EntityFactory.generateOBJ<T>(updatedJson);
          data = generatedObj;
        } else {
          // إذا كان T هو نوع بسيط، أضف كل عنصر إلى listData
          // dataValue هو List بالفعل بعد التحقق في السطر 36
          for (var item in dataValue) {
            if (T.toString() == "String") {
              listData!.add(item.toString() as T);
            } else {
              final obj = EntityFactory.generateOBJ<T>(item);
              if (obj != null) {
                listData!.add(obj);
              }
            }
          }
        }
      } else {
        if (T.toString() == "String") {
          data = dataValue.toString() as T?;
        } else if (T.toString() == "Map<dynamic, dynamic>") {
          data = dataValue as T;
        } else {
          // التحقق من null قبل التحويل
          if (dataValue != null) {
            final typeString = T.toString();
            
            // قائمة بجميع Models التي تحتاج إلى json كامل (مثل AboutAppModel)
            final modelsNeedingFullJson = [
              "AboutAppModel", "PrivacyAndPolicyModel"
            ];
            
            bool needsFullJson = modelsNeedingFullJson.any((modelName) => 
              typeString.contains(modelName));
            
            if (needsFullJson) {
              // تحويل json كله إلى Model (لأن Model يحتاج إلى json كامل)
              final updatedJson = Map<String, dynamic>.from(json);
              updatedJson[AppConstant.data] = dataValue;
              final generatedObj = EntityFactory.generateOBJ<T>(updatedJson);
              data = generatedObj;
            } else {
              // إذا كان T هو Model معروف، استخدمه
              final generatedObj = EntityFactory.generateOBJ<T>(dataValue);
              data = generatedObj;
            }
          } else {
            data = null;
          }
        }
      }
    }
  }
}

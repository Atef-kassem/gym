import 'package:swat_gym/features/app_home/data/models/ads_model/ads_model.dart';
import 'package:swat_gym/features/app_home/data/models/my_services_model/my_services_model.dart';
import 'package:swat_gym/features/auth/register/data/models/register_model/branches_model.dart';
import 'package:swat_gym/features/captains/data/models/captains_model.dart';
import 'package:swat_gym/features/inbody/data/models/my_inbody_model.dart';

import 'package:swat_gym/features/introduction/data/models/my_services_model/my_intro_model.dart';
import 'package:swat_gym/features/my_subscribtions/data/models/my_messages_model/my_subscribtions_model.dart';

import 'package:swat_gym/features/new_bsama_add_Fingerprint/data/models/finger_print_model/new_finger_print_model.dart';
import 'package:swat_gym/Features/notification_view/data/models/my_messages_model/my_messages_model.dart';
import 'package:swat_gym/features/offers/data/models/add_offer_model.dart';
import 'package:swat_gym/features/offers/data/models/my_messages_model/my_offers_model.dart';

import 'package:swat_gym/features/privacy_and_policy/data/models/privacy_and_policy_model.dart';

import 'package:swat_gym/features/news/data/models/my_news_model.dart';
import 'package:swat_gym/features/subscribtions/data/models/delete_and_add_model.dart';
import 'package:swat_gym/features/subscribtions/data/models/my_messages_model/subscribtions_model.dart';

import '../../../features/about_app/data/models/about_app_model/about_app_model.dart';
import '../../../features/auth/fire_base_token/data/models/token_model.dart';
import '../../../features/auth/login/data/models/login_model/login_model/employee_model.dart';
import '../../../features/auth/login/data/models/login_model/login_model/employee.dart';
import '../../../features/auth/register/data/models/register_model/register_model.dart';
import '../../../features/calender/data/models/calender_model/calender_model.dart';
import '../../../features/exercises/data/models/my_messages_model/exercise_cat_model.dart';
import '../../../features/exercises/data/models/my_messages_model/exercise_model.dart';
import 'base_response/general_response.dart';
import 'net_response.dart';

class EntityFactory {
  static T? generateOBJ<T>(json) {
    // التحقق من null قبل المعالجة
    if (json == null) {
      print('EntityFactory: json is null');
      return null;
    }
    
    final typeString = T.toString();
    // إزالة nullable markers (? و *) من typeString للتحقق
    final cleanTypeString = typeString.replaceAll('?', '').replaceAll('*', '');
    
    print('=== EntityFactory.generateOBJ Debug ===');
    print('T type: $typeString');
    print('cleanTypeString: $cleanTypeString');
    print('json type: ${json.runtimeType}');
    if (json is Map) {
      print('json keys: ${json.keys}');
    }
    
    // معالجة خاصة لـ Map<String, dynamic> أو أي نوع Map مباشر
    if ((cleanTypeString.startsWith("Map") || cleanTypeString == "Map") && json is Map) {
      return json as T;
    }
    
    // استخدام contains للتحقق من النوع (للتأكد من التعامل مع nullable types)
    if (cleanTypeString.contains("BaseResponse")) {
      return BaseResponse.fromJson(json) as T;
    } else if (cleanTypeString.contains("GeneralResponse")) {
      return GeneralResponse.fromJson(json) as T;
    } else if (cleanTypeString.contains("EmployeeModel")) {
      return EmployeeModel.fromJson(json) as T;
    } else if (cleanTypeString.contains("Employee")) {
      // Employee هو model فردي (ليس EmployeeModel)
      try {
        final result = Employee.fromJson(json) as T;
        print('EntityFactory: Employee created successfully');
        return result;
      } catch (e, stackTrace) {
        print('EntityFactory: Error creating Employee: $e');
        print('Stack trace: $stackTrace');
        return null;
      }
    } else if (cleanTypeString.contains("TokenModel")) {
      return TokenModel.fromJson(json) as T;
    } else if (cleanTypeString.contains("CalenderModel")) {
      return CalenderModel.fromJson(json) as T;
    } else if (cleanTypeString.contains("RegisterModel")) {
      return RegisterModel.fromJson(json) as T;
    } else if (cleanTypeString.contains("AboutAppModel")) {
      return AboutAppModel.fromJson(json) as T;
    } else if (cleanTypeString.contains("PrivacyAndPolicyModel")) {
      return PrivacyAndPolicyModel.fromJson(json) as T;
    } else if (cleanTypeString.contains("MyTa3memModel")) {
      return MyNewsModel.fromJson(json) as T;
    } else if (cleanTypeString.contains("MyServicesModel")) {
      return MyServicesModel.fromJson(json) as T;
    } else if (cleanTypeString.contains("MyIntroModel")) {
      return MyIntroModel.fromJson(json) as T;
    } else if (cleanTypeString.contains("NewFingerPrintModel")) {
      return NewFingerPrintModel.fromJson(json) as T;
    } else if (cleanTypeString.contains("BranchesModel")) {
      return BranchesModel.fromJson(json) as T;
    } else if (cleanTypeString.contains("MyNewsModel")) {
      print('EntityFactory: Creating MyNewsModel');
      try {
        final result = MyNewsModel.fromJson(json) as T;
        print('EntityFactory: MyNewsModel created successfully');
        return result;
      } catch (e, stackTrace) {
        print('EntityFactory: Error creating MyNewsModel: $e');
        print('Stack trace: $stackTrace');
        return null;
      }
    } else if (cleanTypeString.contains("MyOffersModel")) {
      return MyOffersModel.fromJson(json) as T;
    } else if (cleanTypeString.contains("AddOfferModel")) {
      return AddOfferModel.fromJson(json) as T;
    } else if (cleanTypeString.contains("ExerciseCatModel")) {
      return ExerciseCatModel.fromJson(json) as T;
    } else if (cleanTypeString.contains("ExerciseModel")) {
      return ExerciseModel.fromJson(json) as T;
    } else if (cleanTypeString.contains("MySubscribtionsModel")) {
      // يجب التحقق من MySubscribtionsModel قبل SubscribtionsModel
      // لأن "MySubscribtionsModel" يحتوي على "SubscribtionsModel"
      print('EntityFactory: Creating MySubscribtionsModel');
      try {
        final result = MySubscribtionsModel.fromJson(json) as T;
        print('EntityFactory: MySubscribtionsModel created successfully');
        return result;
      } catch (e, stackTrace) {
        print('EntityFactory: Error creating MySubscribtionsModel: $e');
        print('Stack trace: $stackTrace');
        return null;
      }
    } else if (cleanTypeString.contains("SubscribtionsModel")) {
      return SubscribtionsModel.fromJson(json) as T;
    } else if (cleanTypeString.contains("AdsModel")) {
      return AdsModel.fromJson(json) as T;
    } else if (cleanTypeString.contains("CaptainsModel")) {
      return CaptainsModel.fromJson(json) as T;
    } else if (cleanTypeString.contains("MyMessagesModel")) {
      return MyMessagesModel.fromJson(json) as T;
    } else if (cleanTypeString.contains("DeleteAndAddModel")) {
      return DeleteAndAddModel.fromJson(json) as T;
    } else if (cleanTypeString.contains("MyInbodyModel")) {
      return MyInbodyModel.fromJson(json) as T;
    } else {
      print('EntityFactory: No match for type: $typeString (clean: $cleanTypeString)');
      return null;
    }
  }
}

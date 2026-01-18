import 'dart:convert';
import 'dart:io';

import 'package:dio/dio.dart';
import 'package:hive/hive.dart';
import 'package:sprintf/sprintf.dart';

import '../log_utils.dart';
import 'exception/error_status.dart';

///Header management interceptor
class AuthInterceptor extends Interceptor {
  // قائمة بالـ endpoints التي لا تحتاج token (مثل تسجيل الدخول والتسجيل)
  static const List<String> publicEndpoints = [
    '/auth/login',
    '/auth/signup',
    '/auth/forgotpassword',
    '/auth/resetpassword',
  ];

  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) {
    options.headers["Accept"] = "application/json";
    options.headers["Content-Type"] = "application/json";

    // التحقق من أن الـ endpoint ليس من الـ public endpoints
    // التحقق من الـ path الكامل (path و uri.path)
    String fullPath = options.uri.path; // المسار الكامل مع baseUrl
    String relativePath = options.path; // المسار النسبي فقط
    
    bool isPublicEndpoint = publicEndpoints.any((endpoint) => 
      fullPath.contains(endpoint) || relativePath.contains(endpoint)
    );

    // إضافة token في headers فقط إذا لم يكن endpoint عاماً
    if (!isPublicEndpoint) {
      try {
        // محاولة قراءة token من Hive
        final authBox = Hive.box('auth');
        final token = authBox.get('token') as String?;
        if (token != null && token.isNotEmpty) {
          options.headers["Authorization"] = "Bearer $token";
          Log.d("Token added to request: ${token.substring(0, 20)}...");
        } else {
          Log.d("No token found in storage");
        }
      } catch (e) {
        // إذا لم يكن هناك auth box، لا مشكلة - سيتم إنشاؤه عند حفظ token
        Log.d("Auth box not found, token will be saved on login");
      }
    } else {
      Log.d("Public endpoint - skipping token: ${options.path}");
    }

    super.onRequest(options, handler);
  }
}

///Log interceptor settings
class LoggingInterceptor extends Interceptor {
  DateTime? startTime;
  DateTime? endTime;

  @override
  onRequest(RequestOptions options, RequestInterceptorHandler handler) {
    startTime = DateTime.now();
    Log.d("----------Request Start---------");
    Log.i(" path :${options.path}");

    ///print full path request
    // Ensure proper URL concatenation with slash separator
    String baseUrl = options.baseUrl;
    String path = options.path;

    // Remove trailing slash from baseUrl if present
    if (baseUrl.endsWith('/')) {
      baseUrl = baseUrl.substring(0, baseUrl.length - 1);
    }

    // Ensure path starts with slash
    if (!path.startsWith('/')) {
      path = '/$path';
    }

    if (options.queryParameters.isEmpty) {
      if (path.contains(baseUrl)) {
        Log.i("RequestUrl:$path");
      } else {
        Log.i("RequestUrl:$baseUrl$path");
      }
    } else {
      ///If queryParameters is not empty, splice into a complete URl
      Log.i(
          "RequestUrl:$baseUrl$path?${Transformer.urlEncodeMap(options.queryParameters)}");
    }

    Log.w("RequestMethod:${options.method}");
    Log.w("RequestPath:${options.path}");
    Log.w("RequestFullUrl:${options.uri}");
    Log.w("RequestHeaders:${options.headers}");
    Log.w("RequestContentType:${options.contentType}");
    if (options.data != null) {
      Log.w("RequestDataOptions:"
          "${options.data is FormData ? '${(options.data as FormData).fields}\n${(options.data as FormData).files}' : options.data.toString()}");
    }
    return super.onRequest(options, handler);
  }

  @override
  void onResponse(Response response, ResponseInterceptorHandler handler) {
    endTime = DateTime.now();
    //Request duration
    int duration = endTime!.difference(startTime!).inMilliseconds;
    Log.i("----------End Request $duration millisecond---------");
    Log.d("Response Status Code: ${response.statusCode}");
    Log.d("Response Request Path: ${response.requestOptions.path}");
    Log.d("Response Data Type: ${response.data.runtimeType}");
    if (response.data != null) {
      String dataStr = response.data.toString();
      Log.d("Response Data Length: ${dataStr.length}");
      Log.d("Response Data Preview: ${dataStr.length > 300 ? '${dataStr.substring(0, 300)}...' : dataStr}");
    } else {
      Log.d("Response Data: null");
    }
    super.onResponse(response, handler);
  }
}

//parsing data
class AdapterInterceptor extends Interceptor {
  static const String mSG = "msg";
  static const String sLASH = "\"";
  static const String mESSAGE = "message";
  static const String eRROR = "validateError";

  static const String dEFAULT = "\"NOT_FOUND\"";
  static const String notFound = "Some Thing Wrong Happened";

  static const String fAILUREFORMAT = "{\"code\":%d,\"message\":\"%s\"}";
  static const String sUCCESSFORMAT =
      "{\"code\":0,\"data\":%s,\"message\":\"\"}";

  // متغير مؤقت لحفظ token حتى يتم حفظه في Hive
  static String? _pendingToken;

  // دالة للحصول على token المؤقت
  static String? getPendingToken() {
    final token = _pendingToken;
    _pendingToken = null; // مسح token بعد الاستخدام
    return token;
  }

  @override
  onResponse(Response response, ResponseInterceptorHandler handler) {
    Response mResponse = adapterData(response);
    return super.onResponse(mResponse, handler);
  }

  @override
  onError(DioException err, ErrorInterceptorHandler handler) {
    Log.w("----------Request Error---------");
    Log.w("Error Type: ${err.type}");
    Log.w("Error Message: ${err.message}");

    // إضافة معلومات أكثر عن خطأ الاتصال
    if (err.type == DioExceptionType.connectionError) {
      Log.w("Connection Error Details:");
      Log.w("  - Request URL: ${err.requestOptions.uri}");
      Log.w("  - Base URL: ${err.requestOptions.baseUrl}");
      Log.w("  - Path: ${err.requestOptions.path}");
      Log.w("  - Error: ${err.error}");
      Log.w("  - SocketException: ${err.error is SocketException}");

      // رسالة خطأ أوضح مع حلول
      String errorMessage = "لا يمكن الاتصال بالسيرفر";
      String baseUrl = err.requestOptions.baseUrl;
      String fullUrl = err.requestOptions.uri.toString();

      if (err.message?.contains("No route to host") == true ||
          err.message?.contains("Network is unreachable") == true) {
        errorMessage = "❌ لا يمكن الوصول إلى السيرفر\n\n"
            "🔍 تفاصيل الاتصال:\n"
            "   • السيرفر: $baseUrl\n"
            "   • الرابط الكامل: $fullUrl\n\n"
            "✅ الحلول المقترحة:\n"
            "   1. تأكد من أن السيرفر يعمل على المنفذ 4000\n"
            "   2. تحقق من أن IP address صحيح (افتح CMD واكتب: ipconfig)\n"
            "   3. تأكد من أن الجهاز والسيرفر على نفس الشبكة (WiFi/LAN)\n"
            "   4. تحقق من إعدادات Firewall (افتح المنفذ 4000)\n"
            "   5. إذا كنت تستخدم Emulator:\n"
            "      - Android: جرب https://metagym.metacodecx.com (localhost)\n"
            "      - iOS: استخدم https://metagym.metacodecx.com\n"
            "   6. جرب استخدام السيرفر الإنتاجي: https://metagym.metacodecx.com";
      } else if (err.message?.contains("Connection refused") == true) {
        errorMessage = "❌ السيرفر يرفض الاتصال\n\n"
            "🔍 تفاصيل الاتصال:\n"
            "   • السيرفر: $baseUrl\n\n"
            "✅ الحلول المقترحة:\n"
            "   1. تأكد من أن السيرفر يعمل (افتح المتصفح وجرب: $baseUrl)\n"
            "   2. تحقق من أن السيرفر يستمع على المنفذ 4000\n"
            "   3. أعد تشغيل السيرفر\n"
            "   4. تحقق من سجلات السيرفر للأخطاء";
      } else if (err.message?.contains("timeout") == true ||
          err.message?.contains("timed out") == true) {
        errorMessage = "⏱️ انتهت مهلة الاتصال\n\n"
            "🔍 تفاصيل الاتصال:\n"
            "   • السيرفر: $baseUrl\n\n"
            "✅ الحلول المقترحة:\n"
            "   1. تحقق من اتصال الإنترنت\n"
            "   2. تحقق من سرعة الشبكة\n"
            "   3. جرب إعادة المحاولة\n"
            "   4. تحقق من أن السيرفر يستجيب (افتح المتصفح وجرب: $baseUrl)";
      } else if (err.message?.contains("Failed host lookup") == true ||
          err.message?.contains("Name resolution failed") == true) {
        errorMessage = "❌ فشل في حل اسم السيرفر\n\n"
            "🔍 تفاصيل الاتصال:\n"
            "   • السيرفر: $baseUrl\n\n"
            "✅ الحلول المقترحة:\n"
            "   1. تحقق من صحة عنوان السيرفر\n"
            "   2. استخدم IP address بدلاً من اسم النطاق\n"
            "   3. تحقق من اتصال DNS\n"
            "   4. جرب استخدام: https://metagym.metacodecx.com";
      } else {
        errorMessage = "❌ خطأ في الاتصال بالسيرفر\n\n"
            "🔍 تفاصيل الخطأ:\n"
            "   • النوع: ${err.type}\n"
            "   • الرسالة: ${err.message}\n"
            "   • السيرفر: $baseUrl\n\n"
            "✅ الحلول المقترحة:\n"
            "   1. تحقق من اتصال الإنترنت\n"
            "   2. تأكد من أن السيرفر يعمل\n"
            "   3. أعد تشغيل التطبيق\n"
            "   4. تحقق من إعدادات الشبكة";
      }
      Log.w("User-friendly Error: $errorMessage");
    }

    if (err.response != null) {
      Log.w("Error Response Status: ${err.response!.statusCode}");
      Log.w("Error Response Data: ${err.response!.data}");
      adapterData(err.response!);
    }
    return super.onError(err, handler);
  }

  Response adapterData(Response response) {
    String result;
    String content = response.data == null ? "" : response.data.toString();

    Log.d("=== AdapterInterceptor Debug ===");
    Log.d("Response Status Code: ${response.statusCode}");
    Log.d("Response Data Type: ${response.data.runtimeType}");
    Log.d("Response Data Length: ${content.length}");
    Log.d("Response Data Preview: ${content.length > 200 ? '${content.substring(0, 200)}...' : content}");

    // التحقق من أخطاء السيرفر (502, 503, 504, إلخ)
    if (response.statusCode != null && response.statusCode! >= 500) {
      String errorMessage = "خطأ في السيرفر";
      if (response.statusCode == 502) {
        errorMessage = "السيرفر غير متاح حالياً (502 Bad Gateway)";
      } else if (response.statusCode == 503) {
        errorMessage = "الخدمة غير متاحة حالياً (503 Service Unavailable)";
      } else if (response.statusCode == 504) {
        errorMessage = "انتهت مهلة الاتصال بالسيرفر (504 Gateway Timeout)";
      }
      result = sprintf(fAILUREFORMAT, [response.statusCode!, errorMessage]);
      response.statusCode = ErrorStatus.sUCCESS;
      response.data = result;
      return response;
    }

    // التحقق من أن content يبدأ بـ { أو [ (JSON) وليس HTML
    bool isJson = content.trim().startsWith('{') || content.trim().startsWith('[');
    bool isHtml = content.trim().toLowerCase().startsWith('<html') || 
                  content.trim().toLowerCase().startsWith('<!doctype');

    try {
      // محاولة تحويل الـ response إلى JSON فقط إذا كان JSON
      Map<String, dynamic>? jsonData;
      if (content.isNotEmpty && isJson && !isHtml) {
        try {
          jsonData = jsonDecode(content) as Map<String, dynamic>?;
          Log.d("JSON Data Keys: ${jsonData?.keys.toList()}");
        } catch (e) {
          Log.w("Failed to parse JSON: $e");
          // إذا فشل parsing، اعتبره خطأ
          result = sprintf(fAILUREFORMAT, [response.statusCode ?? 400, "تنسيق البيانات غير صحيح"]);
          response.statusCode = ErrorStatus.sUCCESS;
          response.data = result;
          return response;
        }
      } else if (isHtml) {
        // إذا كان HTML (مثل 502 Bad Gateway)، اعتبره خطأ
        String errorMessage = "خطأ في السيرفر";
        if (content.contains("502 Bad Gateway")) {
          errorMessage = "السيرفر غير متاح حالياً (502 Bad Gateway)";
        } else if (content.contains("503")) {
          errorMessage = "الخدمة غير متاحة حالياً (503 Service Unavailable)";
        } else if (content.contains("504")) {
          errorMessage = "انتهت مهلة الاتصال بالسيرفر (504 Gateway Timeout)";
        }
        result = sprintf(fAILUREFORMAT, [response.statusCode ?? 502, errorMessage]);
        response.statusCode = ErrorStatus.sUCCESS;
        response.data = result;
        return response;
      }

      // استخراج token من response إذا كان موجوداً (للـ API الجديد)
      if (jsonData != null && jsonData.containsKey('token')) {
        String? token = jsonData['token']?.toString();
        if (token != null && token.isNotEmpty) {
          // حفظ token في Hive (sync operation)
          try {
            // محاولة الوصول إلى auth box
            if (Hive.isBoxOpen('auth')) {
              final authBox = Hive.box('auth');
              authBox.put('token', token);
              Log.d("Token saved to storage: ${token.substring(0, 20)}...");
            } else {
              // إذا لم يكن box مفتوحاً، نحفظ token مؤقتاً
              // سيتم حفظه في login_view_form بعد تسجيل الدخول
              Log.d(
                  "Auth box not open, saving token temporarily: ${token.substring(0, 20)}...");
              AdapterInterceptor._pendingToken = token;
            }
          } catch (e) {
            Log.w("Error saving token: $e");
            AdapterInterceptor._pendingToken = token; // حفظ token مؤقتاً
          }
        }
      }

      // التحقق من format الـ API الجديد
      // Format 1: { success: true, data: [...], count: ... } (من appManagementController)
      // Format 2: { status: "success" أو "error" }
      // Format 3: { code: 0 أو 200 }
      if (jsonData != null &&
          (jsonData.containsKey('success') ||
              jsonData.containsKey('status') ||
              jsonData.containsKey('code'))) {
        // التحقق من success أو status أو code
        bool isSuccess = false;
        dynamic data = jsonData['data'];
        String message = jsonData['message']?.toString() ?? '';

        if (jsonData.containsKey('success')) {
          // Format الجديد: { success: true, data: [...], count: ... }
          isSuccess = jsonData['success'] == true;
        } else if (jsonData.containsKey('status')) {
          String status = jsonData['status'].toString();
          isSuccess = (status == 'success' || status == 'Success');
        } else if (jsonData.containsKey('code')) {
          int code = jsonData['code'] is int
              ? jsonData['code']
              : int.tryParse(jsonData['code'].toString()) ?? -1;
          isSuccess = (code == 0 || code == 200);
        }

        if (isSuccess) {
          Log.d("✅ Success detected - processing data");
          Log.d("Data type: ${data.runtimeType}");
          
          // دعم List و Map
          if (data is Map) {
            Log.d("Data is Map with keys: ${data.keys.toList()}");
            
            // استخراج data.user إذا كان موجوداً (للـ API الجديد)
            if (data.containsKey('user')) {
              Log.d("Found 'user' key in data, extracting...");
              data = data['user'];
              if (data is Map) {
                Log.d("Extracted user data keys: ${data.keys.toList()}");
              } else if (data is List) {
                Log.d("Extracted user data is List with ${data.length} items");
              }
            }
          } else if (data is List) {
            Log.d("Data is List with ${data.length} items");
          } else {
            Log.d("Data is neither Map nor List, type: ${data.runtimeType}");
          }

          // تحويل format الجديد إلى format القديم
          // jsonEncode يدعم Map و List و null
          dynamic dataToEncode = data;
          dataToEncode ??= {};
          
          String dataJson = jsonEncode(dataToEncode);
          Log.d("Final data JSON length: ${dataJson.length}");
          result = sprintf(sUCCESSFORMAT, [dataJson]);
          response.statusCode = ErrorStatus.sUCCESS;
          Log.d("✅ Response adapted successfully");
        } else {
          // خطأ في الـ API الجديد
          // استخدام status code من الـ response الأصلي أو من الـ code في JSON
          int errorCode = response.statusCode ?? 400;
          if (jsonData.containsKey('code')) {
            int? jsonCode = jsonData['code'] is int
                ? jsonData['code'] as int?
                : int.tryParse(jsonData['code'].toString());
            if (jsonCode != null) {
              errorCode = jsonCode;
            }
          }
          result = sprintf(fAILUREFORMAT,
              [errorCode, message.isNotEmpty ? message : notFound]);
          response.statusCode = ErrorStatus.sUCCESS;
        }
      } else if (response.statusCode == ErrorStatus.sUCCESS) {
        // format القديم أو format غير معروف
        if (content.isEmpty) {
          content = dEFAULT;
        }
        result = sprintf(sUCCESSFORMAT, [content]);
        response.statusCode = ErrorStatus.sUCCESS;
      } else if (response.statusCode == ErrorStatus.notToken) {
        result = sprintf(fAILUREFORMAT, [response.statusCode, "No Token"]);
        response.statusCode = ErrorStatus.sUCCESS;
      } else {
        result = sprintf(fAILUREFORMAT, [response.statusCode ?? 400, notFound]);
        response.statusCode = ErrorStatus.sUCCESS;
      }
    } catch (e) {
      // في حالة فشل التحويل، استخدم format القديم
      if (content.isEmpty) {
        content = dEFAULT;
      }
      result = sprintf(sUCCESSFORMAT, [content]);
      response.statusCode = ErrorStatus.sUCCESS;
    }

    if (response.statusCode == ErrorStatus.sUCCESS) {
      Log.d("ResponseCode:${response.statusCode}");
      try {
        Log.d("response:${jsonDecode(result)}");
      } catch (e) {
        Log.d("response:$result");
      }
    } else {
      try {
        Log.d("response:${jsonDecode(result)}");
      } catch (e) {
        Log.d("response:$result");
      }
    }
    try {
      Log.json(result);
    } catch (e) {
      Log.d("JSON response: $result");
    }
    response.data = result;
    return response;
  }
}

import 'dart:convert';
import 'dart:io';

import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';

import '../log_utils.dart';
import 'api/network_api.dart';
import 'exception/error_status.dart';
import 'exception/exception_handle.dart';
import 'interceptors.dart';
import 'net_response.dart';

//Set default Header Not configured User-Agent Eye open API 403
Map<String, dynamic> headers = {
  "Accept": "application/json",
  HttpHeaders.authorizationHeader: ' '
  // "User-Agent": "insomnia/6.4.1",
//  "Content-Type":"application/x-www-form-urlencoded",
};

class DioUtils {
  factory DioUtils() {
    return _singleInstance;
  }

  DioUtils._internal() {
    _options = BaseOptions(
      baseUrl: NewApi.baseUrl,
      connectTimeout:
          const Duration(milliseconds: 30000), // زيادة timeout إلى 30 ثانية

      ///The interval between receiving data before and after the response stream
      receiveTimeout:
          const Duration(milliseconds: 30000), // زيادة timeout إلى 30 ثانية

      ///If the returned is json (content-type), dio is automatically converted to json by default, no need to manually transfer
      ///(https://github.com/flutterchina/dio/issues/30)
      responseType: ResponseType.plain,

      //Default headers configuration
      headers: headers,

      validateStatus: (status) {
        //Whether to use http status code for judgment, true means not to use http status code for judgment
        return true;
      },
    );
    _dio = Dio(_options);

    //Add cookie blocker management
//    _dio.interceptors.add(CookieManager(CookieJar()));

    //Unified request header interceptor
    _dio!.interceptors.add(AuthInterceptor());

    //Web log blocker
    _dio!.interceptors.add(LoggingInterceptor());

    _dio!.interceptors.add(AdapterInterceptor());
  }

  static Dio? _dio;
  static final DioUtils _singleInstance = DioUtils._internal();

  BaseOptions? _options;

  static DioUtils get instance => DioUtils();

  Dio getDio() {
    return _dio!;
  }

  Future requestDataFuture<T>(Method method, String url, String newBaseUrl,
      {Function(T t)? onSuccess,
      Function(List<T> list)? onSuccessList,
      Function(int code, String msg)? onError,
      dynamic params,
      FormData? dataForm,
      bool? isFormData,
      Map<String, dynamic>? queryParameters,
      CancelToken? cancelToken,
      Options? options,
      bool isList = false}) async {
    if (newBaseUrl.isNotEmpty) {
      _options!.baseUrl = newBaseUrl;
    } else {
      _options!.baseUrl = NewApi.baseUrl;
    }
    String requestMethod = _getMethod(method);
    return await _request<T>(requestMethod, url,
            data: params,
            isFormData: isFormData,
            dataForm: dataForm,
            queryParameters: queryParameters,
            options: options,
            cancelToken: cancelToken)
        .then((BaseResponse<T> result) {
      print('=== requestDataFuture Debug ===');
      print('isList: $isList');
      print('result.code: ${result.code}');
      print('result.listData: ${result.listData?.length ?? 0} items');
      print('result.data type: ${result.data?.runtimeType}');
      print('result.data is List: ${result.data is List}');

      if (result.code == ErrorStatus.rEQUESTDATAOK) {
        if (isList) {
          if (onSuccessList != null) {
            // التحقق من وجود listData وعدم كونه فارغاً
            if (result.listData != null && result.listData!.isNotEmpty) {
              print('✅ Using listData: ${result.listData!.length} items');
              onSuccessList(result.listData!);
            } else {
              // إذا كان listData فارغاً أو null، حاول استخدام data إذا كان List
              if (result.data != null && result.data is List) {
                print(
                    '✅ Using data as List: ${(result.data as List).length} items');
                onSuccessList(result.data as List<T>);
              } else if (result.data != null) {
                // إذا كان data هو Model يحتوي على data List (مثل MySubscribtionsModel)
                // استخدم dynamic reflection للوصول إلى data property
                try {
                  final dataObj = result.data;
                  // محاولة الوصول إلى data property باستخدام reflection
                  if (dataObj.runtimeType.toString().contains('Model')) {
                    // استخدام dynamic للوصول إلى data property
                    final dynamic modelData = dataObj;
                    if (modelData.data != null && modelData.data is List) {
                      print(
                          '✅ Using data from Model: ${(modelData.data as List).length} items');
                      onSuccessList(modelData.data as List<T>);
                    } else {
                      print('❌ Model data is null or not a List');
                      _onError(
                          ErrorStatus.pARSEERROR, "لا توجد بيانات", onError!);
                    }
                  } else {
                    print('❌ No data found in listData or data');
                    _onError(
                        ErrorStatus.pARSEERROR, "لا توجد بيانات", onError!);
                  }
                } catch (e) {
                  print('❌ Error extracting data from Model: $e');
                  _onError(ErrorStatus.pARSEERROR, "لا توجد بيانات", onError!);
                }
              } else {
                print('❌ No data found in listData or data');
                // إذا لم توجد بيانات، استدعاء onError
                _onError(ErrorStatus.pARSEERROR, "لا توجد بيانات", onError!);
              }
            }
          }
        } else {
          if (onSuccess != null) {
            // التحقق من null قبل التحويل لتجنب Type Cast Error
            if (result.data != null) {
              onSuccess(result.data as T);
            } else {
              // إذا كانت البيانات null، استدعاء onError
              _onError(ErrorStatus.pARSEERROR, "لا توجد بيانات", onError!);
            }
          }
        }
      } else {
        //Logo.e(result.toString());
        _onError(result.code ?? ErrorStatus.pARSEERROR, result.message ?? "فشل جلب البيانات", onError!);
      }
    }, onError: (e) {
      //Logo.e(e.toString());
      _cancelLog(e, url);
      NetError error = ExceptionHandle.handleException(e);
      _onError(error.code, error.msg, onError!);
    });
  }

  BaseResponse parseError() {
    return BaseResponse(ErrorStatus.pARSEERROR, "Data parsing error", null);
  }

  //Request the operation of a single object
  Future<BaseResponse<T?>> request<T>(String method, String url,
      {dynamic params,
      Map<String, dynamic>? dataForm,
      bool? isFormData,
      Map<String, dynamic>? queryParameters,
      CancelToken? cancelToken,
      Options? options}) async {
    var response = await _request<T>(method, url,
        data: isFormData == true ? dataForm : params,
        queryParameters: queryParameters,
        options: options,
        cancelToken: cancelToken);
    return response;
  }

  requestData<T>(Method method, String url,
      {Function(T t)? onSuccess,
      Function(List<T> t)? onSuccessList,
      Function(int code, String msg)? onError,
      dynamic params,
      FormData? dataForm,
      bool? isFormData = false,
      Map<String, dynamic>? queryParameters,
      CancelToken? cancelToken,
      Options? options,
      bool isList = false}) {
    String requestMethod = _getMethod(method);
    Stream.fromFuture(_request<T>(requestMethod, url,
            data: isFormData == true ? dataForm : params,
            queryParameters: queryParameters,
            options: options,
            cancelToken: cancelToken))
        .asBroadcastStream()
        .listen((result) {
      //Successful data returned
      if (result.code == ErrorStatus.rEQUESTDATAOK) {
        if (isList) {
          if (onSuccessList != null) {
            onSuccessList(result.listData!);
          }
        } else {
          if (onSuccess != null) {
            onSuccess(result.data as T);
          }
        }
      } else {
        _onError(result.code!, result.message!, onError!);
        if (result.code! == 401) {
          // Utils.showToast(
          //   message: S.current.logoutSuccess,
          // );
          ////    AppSharedPreferences().clearPref();
          // GoRoute(
          //   path: RouterPathsConstant.moveToLogin,
          //   pageBuilder: (context, state) {
          //     Navigator.of(context).pushAndRemoveUntil(
          //         MaterialPageRoute(builder: (context) => const LoginScreen()),
          //         (Route<dynamic> route) => false);
          //     return MaterialPage(
          //       key: state.pageKey,
          //       child: BlocProvider(
          //         create: (context) => getIt<LoginCubit>(),
          //         child: const LoginScreen(),
          //       ),
          //     );
          //   },
          // );
          // context.go(RouterPathsConstant.moveToOpening);
        }
      }
    }, onError: (e) {
      _cancelLog(e, url);
      NetError error = ExceptionHandle.handleException(e);

      _onError(error.code, error.msg, onError!);
    });
  }

  ///The returned data is processed uniformly and parsed into corresponding Bean
  Future<BaseResponse<T>> _request<T>(String method, String url,
      {Map<String, dynamic>? data,
      FormData? dataForm,
      bool? isFormData = false,
      Map<String, dynamic>? queryParameters,
      CancelToken? cancelToken,
      Options? options}) async {
    var response = await _dio!.request(url,
        data: isFormData == true ? dataForm : data,
        queryParameters: queryParameters,
        options: _setOptions(method, options!),
        cancelToken: cancelToken);
    late Map<String, dynamic> map;
    try {
      map = await compute(parseData, response.data.toString());

      return BaseResponse.fromJson(map);
    } catch (e) {
      // Utils.showToast(
      //   message: _map[data],
      // );
      debugPrint('$e');
      return BaseResponse(ErrorStatus.pARSEERROR, map["data"]["message"], null);
    }
  }

  Options _setOptions(String method, Options options) {
    options.method = method;
    return options;
  }

  _cancelLog(dynamic e, String url) {
    if (e is DioException && CancelToken.isCancel(e)) {
      Log.i("Cancel network request：$url");
    }
  }

  _onError(int code, String msg, Function(int code, String msg) onError) {
    if (code == 401) {
      // Utils.showToast(
      //   message: S.current.logoutSuccess,
      // );
      //    AppSharedPreferences().clearPref();
      // common_utils.showToastMessage("you Should Log In First");
      // GoRoute(
      //   path: RouterPathsConstant.moveToLogin,
      //   pageBuilder: (context, state) => MaterialPage(
      //     key: state.pageKey,
      //     child: BlocProvider(
      //       create: (context) => getIt<LoginCubit>(),
      //       child: const LoginScreen(),
      //     ),
      //   ),
      // );
      // context.go(RouterPathsConstant.moveToOpening);
    }
    //Logo.e("Interface request exception code:$code message:$msg");
    onError(code, msg);
  }

  //Request type
  String _getMethod(Method method) {
    String netMethod;
    switch (method) {
      case Method.get:
        netMethod = "GET";
        break;
      case Method.post:
        netMethod = "POST";
        break;
      case Method.put:
        netMethod = "PUT";
        break;
      case Method.delete:
        netMethod = "DELETE";
        break;
      case Method.patch:
        netMethod = "PATCH";
        break;
    }
    return netMethod;
  }
}

Map<String, dynamic> parseData(String data) {
  return json.decode(data);
}

enum Method {
  get,
  post,
  put,
  delete,
  patch,
}

import 'dart:io';

import 'package:dio/dio.dart';

import 'error_status.dart';

class ExceptionHandle {
  static String globalError = "Some Thing Wrong Happened...";

  static NetError handleException(dynamic error) {
    if (error is DioException) {
      if (error.type == DioExceptionType.unknown ||
          error.type == DioExceptionType.badResponse) {
        dynamic e = error.error;

        ///网络异常
        if (e is SocketException) {
          return NetError(ErrorStatus.sOCKETERROR, globalError);
        }

        ///服务器异常`
        if (e is HttpException) {
          return NetError(ErrorStatus.sERVERERROR, globalError);
        }
        //默认返回网络异常

        return NetError(ErrorStatus.nETWORKERROR, globalError);

        ///各种超时
      } else if (error.type == DioExceptionType.connectionTimeout ||
          error.type == DioExceptionType.sendTimeout ||
          error.type == DioExceptionType.receiveTimeout) {
        return NetError(ErrorStatus.tIMEOUTERROR, globalError);

        ///取消请求操作
      } else if (error.type == DioExceptionType.cancel) {
        return NetError(ErrorStatus.cACCELERATOR, "");

        //其他异常
      } else {
        return NetError(ErrorStatus.uNKNOWNERROR, globalError);
      }
    } else {
      return NetError(ErrorStatus.uNKNOWNERROR, globalError);
    }
  }
}

class NetError {
  int code;
  String msg;

  NetError(this.code, this.msg);
}

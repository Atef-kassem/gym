import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import 'package:swat_gym/core/utils/constants.dart';
import 'package:swat_gym/core/utils/functions/setup_service_locator.dart';
import 'package:swat_gym/features/auth/login/domain/entities/employee_entity.dart';
import 'package:swat_gym/features/subscribtions/data/models/delete_and_add_model.dart';
import 'package:hive/hive.dart';

import '../../../../../core/utils/network/api/network_api.dart';
import '../../../../../core/utils/network/network_request.dart';
import '../../../../../core/utils/network/network_utils.dart';

typedef SendInvitationResponse = Either<String, String>;

abstract class SendInvitationRemoteDataSource {
  Future<SendInvitationResponse> sendInvitation(phone, name);
}

class SendInvitationRemoteDataSourceImpl
    extends SendInvitationRemoteDataSource {
  @override
  Future<SendInvitationResponse> sendInvitation(phone, name) async {
    SendInvitationResponse sendInvitationResponse = left("");
    var box = Hive.box<EmployeeEntity>(kEmployeeDataBox);

    var body = {
      "phone": phone,
      "name": name,
      // يمكن إضافة memberId إذا لزم الأمر
    };
    await getIt<NetworkRequest>().requestFutureData<DeleteAndAddModel>(
      Method.post,
      params: body,
      options: Options(contentType: Headers.jsonContentType),
      url: NewApi.doServerSendInvitation,
      newBaseUrl: NewApi.baseUrl,
      onSuccess: (data) {
        if (data.status == 200 || data.status == 201 || data.status == "success") {
          sendInvitationResponse = right(data.message ?? "تم الإرسال بنجاح");
        } else {
          sendInvitationResponse = left(data.message ?? "فشل الإرسال");
        }
      },
      onError: (code, msg) {
        sendInvitationResponse = left(msg.toString());
      },
    );
    return sendInvitationResponse;
  }
}

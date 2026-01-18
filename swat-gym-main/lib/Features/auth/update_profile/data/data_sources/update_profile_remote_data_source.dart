import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import 'package:swat_gym/features/auth/login/data/models/login_model/login_model/employee_model.dart';
import 'package:swat_gym/features/auth/login/domain/entities/employee_entity.dart';

import '../../../../../../core/utils/network/network_request.dart';
import '../../../../../core/utils/functions/setup_service_locator.dart';
import '../../../../../core/utils/network/api/network_api.dart';
import '../../../../../core/utils/network/network_utils.dart';

typedef UpdateProfileResponse = Either<String, EmployeeEntity>;

abstract class UpdateProfileRemoteDataSource {
  Future<UpdateProfileResponse> updateProfile(
    String userId,
    dynamic attachment,
  );
}

class UpdateProfileRemoteDataSourceImpl extends UpdateProfileRemoteDataSource {
  @override
  Future<UpdateProfileResponse> updateProfile(
    String userId,
    dynamic attachment,
  ) async {
    UpdateProfileResponse updateProfileResponse = left("");

    var formData = FormData();

    if (attachment != null) {
      formData.files.add(MapEntry(
        "profilePicture",
        await MultipartFile.fromFile(attachment.path,
            filename: attachment.path.split('/').last),
      ));
    }

    await getIt<NetworkRequest>().requestFutureData<EmployeeModel>(
      Method.patch,
      formData: formData,
      isFormData: true,
      options: Options(contentType: Headers.multipartFormDataContentType),
      url: NewApi.doServerUpdateProfileApiCall,
      newBaseUrl: NewApi.baseUrl,
      onSuccess: (data) {
        if (data.status == 200 || data.status == "success") {
          updateProfileResponse = right(data.data);
        } else {
          updateProfileResponse = left(data.message?.toString() ?? "فشل تحديث الملف الشخصي");
        }
      },
      onError: (code, msg) {
        updateProfileResponse = left(msg.toString());
      },
    );
    return updateProfileResponse;
  }
}

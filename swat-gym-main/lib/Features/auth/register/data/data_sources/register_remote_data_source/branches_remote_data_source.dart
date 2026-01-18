import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import 'package:swat_gym/features/auth/register/data/models/register_model/branches_model.dart';
import 'package:swat_gym/features/auth/register/data/models/register_model/branches.dart';
import 'package:swat_gym/core/utils/functions/setup_service_locator.dart';

import '../../../../../../core/utils/network/api/network_api.dart';
import '../../../../../../core/utils/network/network_request.dart';
import '../../../../../../core/utils/network/network_utils.dart';

typedef TypeBranchesaResponse = Either<String, TypeBranchesList>;

abstract class TypeBranchesRemoteDataSource {
  Future<TypeBranchesaResponse> fetchTypesBranches();
}

class TypeBranchesRemoteDataSourceImpl extends TypeBranchesRemoteDataSource {
  @override
  Future<TypeBranchesaResponse> fetchTypesBranches() async {
    TypeBranchesaResponse typeBranchesResponse = left("");

    await getIt<NetworkRequest>().requestFutureData<BranchesModel>(
      Method.get,
      options: Options(contentType: Headers.jsonContentType),
      url: NewApi.doServerAllBranches,
      newBaseUrl: NewApi.baseUrl,
      onSuccess: (data) {
        if ((data.status == 200 || data.status == "success") && data.data != null) {
          typeBranchesResponse = right(data.data!);
        } else if ((data.status == 200 || data.status == "success") && data.data == null) {
          typeBranchesResponse = left(data.message ?? "لا توجد بيانات");
        } else {
          typeBranchesResponse = left(data.message ?? "فشل جلب البيانات");
        }
      },
      onError: (code, msg) {
        typeBranchesResponse = left(msg.toString());
      },
    );
    return typeBranchesResponse;
  }
}

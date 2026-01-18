// ignore_for_file: file_names

import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import 'package:swat_gym/core/utils/functions/setup_service_locator.dart';

import '../../../../../../core/utils/network/api/network_api.dart';
import '../../../../../../core/utils/network/network_request.dart';
import '../../../../../../core/utils/network/network_utils.dart';
import '../../../../../features/offers/data/models/add_offer_model.dart';
import '../../../../../features/offers/domain/entities/add_offers_entity.dart';

typedef SeenTa3memResponse = Either<String, AddOffersEntity>;

abstract class AddOfferRemoteDataSource {
  Future<SeenTa3memResponse> seenTa3mem(String messageId, String toUserId);
}

class AddOfferRemoteDataSourceImpl extends AddOfferRemoteDataSource {
  @override
  Future<SeenTa3memResponse> seenTa3mem(
      String messageId, String toUserId) async {
    SeenTa3memResponse deleteMessageResponse = left("");
    var body = {
      "offerId": int.tryParse(messageId) ?? messageId,
      "memberId": int.tryParse(toUserId) ?? toUserId,
    };
    await getIt<NetworkRequest>().requestFutureData<AddOfferModel>(
      Method.post,
      params: body,
      options: Options(contentType: Headers.jsonContentType),
      url: NewApi.doServerAddFavOffer,
      newBaseUrl: NewApi.baseUrl,
      onSuccess: (data) {
        // التحقق من success بناءً على statusCode أو code
        // code: 0 يعني نجاح في API الجديد
        if (data.statusCode == 200 || data.statusCode == 201 || data.statusCode == 0) {
          deleteMessageResponse = right(data);
        } else {
          deleteMessageResponse = left(data.messageResponse ?? "فشل العملية");
        }
      },
      onError: (code, msg) {
        deleteMessageResponse = left(msg.toString());
      },
    );
    return deleteMessageResponse;
  }
}

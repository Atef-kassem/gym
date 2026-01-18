

import '../../domain/repositories/offers_repo.dart';
import '../data_sources/remote_data_source/add_offer_remote_data_source.dart';
import '../data_sources/remote_data_source/all_offers_remote_data_source.dart';

class OffersRepositoryImp extends OffersRepo {
  final AllOffersRemoteDataSource myOffersRemoteDataSource;

  final AddOfferRemoteDataSource seenTa3memRemoteDataSource;

  OffersRepositoryImp(
      this.myOffersRemoteDataSource, this.seenTa3memRemoteDataSource);

  @override
  Future<AllOffersResponse> fetchAllOffers(String userId) async {
    var userData = await myOffersRemoteDataSource.fetchAllOffers(userId);

    return userData;
  }

  @override
  Future<SeenTa3memResponse> seenTa3mem(
      String messageId, String toUserId) async {
    var userData = await seenTa3memRemoteDataSource.seenTa3mem(
      messageId,
      toUserId,
    );

    return userData;
  }
}

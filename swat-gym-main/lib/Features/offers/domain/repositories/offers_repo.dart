import '../../data/data_sources/remote_data_source/all_offers_remote_data_source.dart';
import '../../data/data_sources/remote_data_source/add_offer_remote_data_source.dart';

abstract class OffersRepo {
  Future<AllOffersResponse> fetchAllOffers(
    String userId,
  );

  Future<SeenTa3memResponse> seenTa3mem(
    String messageId,
    String toUserId,
  );
}

import 'package:swat_gym/features/offers/domain/entities/offers_entity.dart';

import '../../data/data_sources/remote_data_source/all_offers_remote_data_source.dart';
import '../../data/data_sources/remote_data_source/add_offer_remote_data_source.dart';
import '../repositories/offers_repo.dart';

abstract class UseCase<type, Param> {
  Future<AllOffersResponse> callAllOffers(String userId);
}

class OffersUseCase extends UseCase<OffersEntity, void> {
  final OffersRepo offersRepository;
  OffersUseCase(this.offersRepository);
  @override
  Future<AllOffersResponse> callAllOffers(String userId) async {
    return await offersRepository.fetchAllOffers(userId);
  }

  Future<SeenTa3memResponse> AddOffer(String messageId, String toUserId) async {
    return await offersRepository.seenTa3mem(
      messageId,
      toUserId,
    );
  }
}

import 'package:swat_gym/features/captains/domain/entities/captains_entity.dart';

import '../../data/data_sources/remote_data_source/all_captains_remote_data_source.dart';
import '../repositories/captains_repo.dart';

abstract class UseCase<type, Param> {
  Future<AllCaptainsResponse> callAllCaptains(String userId);
}

class CaptainsUseCase extends UseCase<CaptainsEntity, void> {
  final CaptainsRepo captainsRepository;
  CaptainsUseCase(this.captainsRepository);
  @override
  Future<AllCaptainsResponse> callAllCaptains(String userId) async {
    return await captainsRepository.fetchAllCaptains(userId);
  }
}

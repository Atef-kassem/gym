import 'package:swat_gym/features/introduction/data/dat_source/remote_data_source/all_intro_remote_data_source.dart';
import 'package:swat_gym/features/introduction/domain/entities/intro_entity.dart';

import '../repository/intro_repo.dart';

abstract class UseCase<type> {
  Future<AllIntroResponse> fetchAllServices();
}

class IntroUseCase extends UseCase<IntroEntity> {
  final IntroRepository fingerPrintRepository;
  IntroUseCase(this.fingerPrintRepository);

  @override
  Future<AllIntroResponse> fetchAllServices() async {
    return await fingerPrintRepository.fetchAllServices();
  }
}

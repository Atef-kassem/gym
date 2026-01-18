import '../../data/data_sources/about_app_remote_data_sources.dart';
import '../repositories/about_app_repo.dart';

abstract class UseCase<type, Param> {
  Future<AboutAppResponse> call();
}

class AboutAppUseCase extends UseCase<void, void> {
  final AboutAppRepo aboutAppRepo;
  AboutAppUseCase(this.aboutAppRepo);
  @override
  Future<AboutAppResponse> call() async {
    return await aboutAppRepo.fetchAboutAppData();
  }
}

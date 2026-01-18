import '../../domain/repositories/about_app_repo.dart';
import '../data_sources/about_app_remote_data_sources.dart';

class AboutAppRepositoryImpl extends AboutAppRepo {
  final AboutAppRemoteDataSource aboutAppRemoteDataSource;

  AboutAppRepositoryImpl(this.aboutAppRemoteDataSource);

  @override
  Future<AboutAppResponse> fetchAboutAppData() async {
    var userData = await aboutAppRemoteDataSource.fetchAboutAppData();

    return userData;
  }
}

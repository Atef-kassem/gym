import '../../data/data_sources/about_app_remote_data_sources.dart';

abstract class AboutAppRepo {
  Future<AboutAppResponse> fetchAboutAppData();
}

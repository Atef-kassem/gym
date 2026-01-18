import 'package:swat_gym/features/introduction/data/dat_source/remote_data_source/all_intro_remote_data_source.dart';
import 'package:swat_gym/features/introduction/domain/repository/intro_repo.dart';

class IntroRepoImpl extends IntroRepository {
  final AllIntroRemoteDataSource allServicesRemoteDataSource;

  IntroRepoImpl(this.allServicesRemoteDataSource);
  @override
  @override
  Future<AllIntroResponse> fetchAllServices() async {
    var services = await allServicesRemoteDataSource.fetchAllServices();

    return services;
  }
}

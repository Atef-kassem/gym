import 'package:swat_gym/features/app_home/data/dat_source/finger_print/_remote_data_source/all_services_remote_data_source.dart';

import '../../domain/repository/finger_print_repo.dart';
import '../dat_source/finger_print/_remote_data_source/finger_print_remote_data_source.dart';

class FingerPrintRepoImpl extends FingerPrintRepository {
  final FingerPrintRemoteDataSource fingerPrintRemoteDataSource;
  final AllServicesRemoteDataSource allServicesRemoteDataSource;


  FingerPrintRepoImpl(
      this.fingerPrintRemoteDataSource, this.allServicesRemoteDataSource);
  @override
  Future<FingerPrintResponse> addFingerPrint(String empId) async {
    var fingerPrintData =
        await fingerPrintRemoteDataSource.addFingerPrint(empId);

    return fingerPrintData;
  }

  @override
  Future<AllServicesResponse> fetchAllServices() async {
    var services = await allServicesRemoteDataSource.fetchAllServices();

    return services;
  }
  
  @override
  Future<AllAdsResponse> fetchAllAds() async{
    return await allServicesRemoteDataSource.fetchAllAds();
    
  }

  
}

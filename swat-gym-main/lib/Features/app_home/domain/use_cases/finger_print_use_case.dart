import 'package:swat_gym/features/app_home/data/dat_source/finger_print/_remote_data_source/all_services_remote_data_source.dart';
import 'package:swat_gym/features/new_bsama_add_Fingerprint/domain/entities/new_finger_print_entity.dart';

import '../../data/dat_source/finger_print/_remote_data_source/finger_print_remote_data_source.dart';
import '../repository/finger_print_repo.dart';

abstract class UseCase<type> {
  Future<FingerPrintResponse> call(String empId);

  Future<AllServicesResponse> fetchAllServices();

  Future<AllAdsResponse> fetchAllAds();
}

class FingerPrintUseCase extends UseCase<NewFingerPrintEntity> {
  final FingerPrintRepository fingerPrintRepository;
  FingerPrintUseCase(this.fingerPrintRepository);

  @override
  Future<FingerPrintResponse> call(String empId) async {
    return await fingerPrintRepository.addFingerPrint(empId);
  }

  @override
  Future<AllServicesResponse> fetchAllServices() async {
    return await fingerPrintRepository.fetchAllServices();
  }
  
  @override
  Future<AllAdsResponse> fetchAllAds() async {
    return await fingerPrintRepository.fetchAllAds();
  }
}

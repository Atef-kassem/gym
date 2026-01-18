import 'package:swat_gym/features/app_home/data/dat_source/finger_print/_remote_data_source/all_services_remote_data_source.dart';

import '../../data/dat_source/finger_print/_remote_data_source/finger_print_remote_data_source.dart';

abstract class FingerPrintRepository {
  Future<FingerPrintResponse> addFingerPrint(String empId);

  Future<AllServicesResponse> fetchAllServices();

  Future<AllAdsResponse> fetchAllAds();
}

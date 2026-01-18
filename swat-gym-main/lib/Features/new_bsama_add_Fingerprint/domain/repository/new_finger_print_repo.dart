import '../../data/dat_source/finger_print/_remote_data_source/new_finger_print_remote_data_source.dart';

abstract class NewFingerPrintRepository {
  Future<NewFingerPrintResponse> addFingerPrint(
      String empId, dynamic image, String lat, String long);
}

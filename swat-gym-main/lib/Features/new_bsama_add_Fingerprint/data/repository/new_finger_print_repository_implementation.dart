import '../../domain/repository/new_finger_print_repo.dart';
import '../dat_source/finger_print/_remote_data_source/new_finger_print_remote_data_source.dart';

class NewFingerPrintRepoImpl extends NewFingerPrintRepository {
  final NewFingerPrintRemoteDataSource fingerPrintRemoteDataSource;

  NewFingerPrintRepoImpl(this.fingerPrintRemoteDataSource);
  @override
  Future<NewFingerPrintResponse> addFingerPrint(
      String empId, dynamic image, String lat, String long) async {
    var fingerPrintData = await fingerPrintRemoteDataSource.addFingerPrint(
        empId, image, lat, long);

    return fingerPrintData;
  }
}

import '../../data/dat_source/finger_print/_remote_data_source/new_finger_print_remote_data_source.dart';
import '../entities/new_finger_print_entity.dart';
import '../repository/new_finger_print_repo.dart';

abstract class UseCase<type> {
  Future<NewFingerPrintResponse> call(
      String empId, dynamic image, String lat, String long);
}

class NewFingerPrintUseCase extends UseCase<NewFingerPrintEntity> {
  final NewFingerPrintRepository fingerPrintRepository;
  NewFingerPrintUseCase(this.fingerPrintRepository);

  @override
  Future<NewFingerPrintResponse> call(
      String empId, dynamic image, String lat, String long) async {
    return await fingerPrintRepository.addFingerPrint(empId, image, lat, long);
  }
}

import 'package:swat_gym/features/calender/domain/entities/calender_entity.dart';

import '../../data/data_sources/calender_remote_data_source/calender_remote_data_source.dart';
import '../repositories/calender_repository.dart';

abstract class UseCase<type> {
  Future<CalenderResponse> call(String month, String empId);
}

class CalenderUseCase extends UseCase<CalenderEntity> {
  final CalenderRepository tableRepository;
  CalenderUseCase(this.tableRepository);

  @override
  Future<CalenderResponse> call(String month, String empId) async {
    return await tableRepository.fetchCalenderData(month, empId);
  }
}

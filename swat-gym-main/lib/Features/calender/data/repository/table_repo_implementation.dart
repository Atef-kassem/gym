import '../../domain/repositories/calender_repository.dart';
import '../data_sources/calender_remote_data_source/calender_remote_data_source.dart';

class CalenderRepositoryImp extends CalenderRepository {
  final CalenderRemoteDataSource calenderRemoteDataSource;

  CalenderRepositoryImp(this.calenderRemoteDataSource);

  @override
  Future<CalenderResponse> fetchCalenderData(String month, String empId) async {
    var userData =
        await calenderRemoteDataSource.fetchCalenderData(month, empId);

    return userData;
  }
}

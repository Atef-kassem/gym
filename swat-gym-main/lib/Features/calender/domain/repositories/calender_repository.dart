import '../../data/data_sources/calender_remote_data_source/calender_remote_data_source.dart';

abstract class CalenderRepository {
  Future<CalenderResponse> fetchCalenderData(String month, String empId);
}

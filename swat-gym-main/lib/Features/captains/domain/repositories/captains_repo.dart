import '../../data/data_sources/remote_data_source/all_captains_remote_data_source.dart';

abstract class CaptainsRepo {
  Future<AllCaptainsResponse> fetchAllCaptains(
    String userId,
  );
}

import '../../data/data_sources/get_profile_remote_data_source.dart';

abstract class GetProfileRepository {
  Future<GetProfileResponse> getProfile(
    String userId,
  );
}

import '../../data/data_sources/update_profile_remote_data_source.dart';

abstract class UpdateProfileRepository {
  Future<UpdateProfileResponse> updateProfile(
    String userId,
    dynamic attachment,
  );
}

import '../../data/data_sources/remote_data_source/all_inbody_remote_data_source.dart';

abstract class AllInbodyRepo {
  Future<AllInbodyResponse> fetchAllAllInbody(
    String userId,
  );
}

import 'package:swat_gym/features/subscribtions/data/data_sources/add_subscribtions_remote_data_source.dart';
import 'package:swat_gym/features/subscribtions/data/data_sources/subscribtions_remote_data_source.dart';

abstract class SubscribtionsRepo {
  Future<AllSubscribtionsResponse> fetchAllSubscribtions();

  Future<AddSubscribtionsResponse> addSubscribtions(fromDate, subId);
}

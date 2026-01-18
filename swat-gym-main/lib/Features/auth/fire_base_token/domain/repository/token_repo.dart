import '../../data/dat_source/token_data_source.dart';

abstract class TokenRepository {
  Future<TokenResponse> getToken(String token);
}

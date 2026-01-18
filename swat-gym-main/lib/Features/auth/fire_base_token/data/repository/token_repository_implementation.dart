import '../../domain/repository/token_repo.dart';
import '../dat_source/token_data_source.dart';

class TokenRepoImpl extends TokenRepository {
  final TokenRemoteDataSource tokenRemoteDataSource;

  TokenRepoImpl(this.tokenRemoteDataSource);

  @override
  Future<TokenResponse> getToken(String token) async {
    var tokenData = await tokenRemoteDataSource.getToken(token);
    return tokenData;
  }
}

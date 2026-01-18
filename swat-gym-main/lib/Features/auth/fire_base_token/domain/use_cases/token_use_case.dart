import '../../data/dat_source/token_data_source.dart';
import '../repository/token_repo.dart';

abstract class UseCase<type> {
  Future<TokenResponse> call(String token);
}

class TokenUseCase extends UseCase<String> {
  final TokenRepository tokenRepository;
  TokenUseCase(this.tokenRepository);

  @override
  Future<TokenResponse> call(String token) async {
    return await tokenRepository.getToken(token);
  }
}

// ignore: depend_on_referenced_packages
import 'package:bloc/bloc.dart';

import '../../domain/use_cases/token_use_case.dart';

part 'token_state.dart';

class TokenCubit extends Cubit<TokenState> {
  final TokenUseCase tokenRequest;
  bool isLoading = false;

  TokenCubit(this.tokenRequest) : super(TokenInitial());

  Future<void> getTokenData(String token) async {
    emit(const TokenLoading());
    final result = await tokenRequest.call(token);

    emit(result.fold(TokenFailed.new, TokenSuccessful.new));
  }
}

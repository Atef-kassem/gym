part of 'token_cubit.dart';

abstract class TokenState {
  const TokenState();
  List<Object> get props => [];
}

class TokenInitial extends TokenState {}

class TokenLoading extends TokenState {
  const TokenLoading();
}

class TokenSuccessful extends TokenState {
  final String message;

  const TokenSuccessful(this.message);
}

class TokenFailed extends TokenState {
  final String message;
  const TokenFailed(this.message);
}

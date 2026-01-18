part of 'login_cubit.dart';

abstract class LoginState {
  const LoginState();
  List<Object> get props => [];
}

class LoginInitial extends LoginState {}

class LoginLoading extends LoginState {
  const LoginLoading();
}

class LoginSuccessful extends LoginState {
  final EmployeeModel user;

  const LoginSuccessful(this.user);
}

class LoginFailed extends LoginState {
  final String message;
  const LoginFailed(this.message);
}

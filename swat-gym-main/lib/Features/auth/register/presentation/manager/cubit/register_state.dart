part of 'register_cubit.dart';

@immutable
abstract class RegisterState {
  const RegisterState();
  List<Object> get props => [];
}

class RegisterInitial extends RegisterState {}

class RegisterLoading extends RegisterState {
  const RegisterLoading();
}

class RegisterSuccessful extends RegisterState {
  final RegisterEntity data;

  const RegisterSuccessful(this.data);
}

class RegisterFailed extends RegisterState {
  final String failMessage;
  const RegisterFailed(this.failMessage);
}

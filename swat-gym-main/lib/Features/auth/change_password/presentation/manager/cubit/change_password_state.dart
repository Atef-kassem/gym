part of 'change_password_cubit.dart';

@immutable
abstract class ChangePasswordState {
  const ChangePasswordState();
  List<Object> get props => [];
}

class ChangePasswordInitial extends ChangePasswordState {}

class ChangePasswordLoading extends ChangePasswordState {
  const ChangePasswordLoading();
}

class ChangePasswordSuccessful extends ChangePasswordState {
  final EmployeeEntity data;

  const ChangePasswordSuccessful(this.data);
}

class ChangePasswordFailed extends ChangePasswordState {
  final String failMessage;
  const ChangePasswordFailed(this.failMessage);
}

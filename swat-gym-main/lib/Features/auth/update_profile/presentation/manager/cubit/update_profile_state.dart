part of 'update_profile_cubit.dart';

@immutable
abstract class UpdateProfileState {
  const UpdateProfileState();
  List<Object> get props => [];
}

class UpdateProfileInitial extends UpdateProfileState {}

class UpdateProfileLoading extends UpdateProfileState {
  const UpdateProfileLoading();
}

class UpdateProfileSuccessful extends UpdateProfileState {
  final EmployeeEntity data;

  const UpdateProfileSuccessful(this.data);
}

class UpdateProfileFailed extends UpdateProfileState {
  final String failMessage;
  const UpdateProfileFailed(this.failMessage);
}

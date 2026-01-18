part of 'get_profile_cubit.dart';

@immutable
abstract class GetProfileState {
  const GetProfileState();
  List<Object> get props => [];
}

class GetProfileInitial extends GetProfileState {}

class getProfileLoading extends GetProfileState {
  const getProfileLoading();
}

class GetProfileSuccessful extends GetProfileState {
  final EmployeeModel data;

  const GetProfileSuccessful(this.data);
}

class GetProfileFailed extends GetProfileState {
  final String failMessage;
  const GetProfileFailed(this.failMessage);
}

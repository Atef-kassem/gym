part of 'about_app_cubit.dart';

@immutable
abstract class AboutAppState {
  const AboutAppState();
  List<Object> get props => [];
}

class AboutAppInitial extends AboutAppState {}

class AboutAppLoading extends AboutAppState {
  const AboutAppLoading();
}

class AboutAppSuccessful extends AboutAppState {
  final AboutAppDataList? data;

  const AboutAppSuccessful(this.data);
}

class AboutAppFailed extends AboutAppState {
  final String message;
  const AboutAppFailed(this.message);
}

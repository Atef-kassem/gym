part of 'intro_cubit.dart';

abstract class IntroState {
  const IntroState();
  List<Object> get props => [];
}

class Ta3memInitial extends IntroState {}

class FetchLoading extends IntroState {
  const FetchLoading();
}

class FetchSuccessful extends IntroState {
  final AllIntroList? data;

  const FetchSuccessful(this.data);
}

class FetchFailed extends IntroState {
  final String message;
  const FetchFailed(this.message);
}

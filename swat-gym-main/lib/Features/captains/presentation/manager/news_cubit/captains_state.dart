part of 'captains_cubit.dart';

abstract class CaptainsState {
  const CaptainsState();
  List<Object> get props => [];
}

class NewsInitial extends CaptainsState {}

class FetchLoading extends CaptainsState {
  const FetchLoading();
}

class FetchSuccessful extends CaptainsState {
  final AllCaptainsList? data;

  const FetchSuccessful(this.data);
}

class FetchFailed extends CaptainsState {
  final String message;
  const FetchFailed(this.message);
}

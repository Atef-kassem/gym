part of 'my_subscribtions_cubit.dart';

abstract class MySubscribtionsState {
  const MySubscribtionsState();
  List<Object> get props => [];
}

class MosalatInitial extends MySubscribtionsState {}

class FetchLoading extends MySubscribtionsState {
  const FetchLoading();
}

class FetchSuccessful extends MySubscribtionsState {
  final AllSubscribtionsList? data;

  const FetchSuccessful(this.data);
}

class FetchFailed extends MySubscribtionsState {
  final String message;
  const FetchFailed(this.message);
}

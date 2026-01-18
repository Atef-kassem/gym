part of 'subscribtions_cubit.dart';


abstract class SubscribtionsState {
 const  SubscribtionsState();
  List<Object> get props => [];
}

class SubscribtionsInitial extends SubscribtionsState {}

class FetchLoading extends SubscribtionsState {
  const FetchLoading();
}

class FetchSuccessful extends SubscribtionsState {
  final AllSubscribtionsList? data;

  const FetchSuccessful(this.data);
}

class FetchFailed extends SubscribtionsState {
  final String message;
  const FetchFailed(this.message);
}

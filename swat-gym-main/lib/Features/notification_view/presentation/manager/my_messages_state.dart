part of 'my_messages_cubit.dart';

abstract class MyMessagesState {
  const MyMessagesState();
  List<Object> get props => [];
}

class MyMessagesInitial extends MyMessagesState {}

class FetchLoading extends MyMessagesState {
  const FetchLoading();
}

class FetchSuccessful extends MyMessagesState {
  final AllMessagesList? data;

  const FetchSuccessful(this.data);
}

class FetchFailed extends MyMessagesState {
  final String message;
  const FetchFailed(this.message);
}

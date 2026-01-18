part of 'add_subscribtions_cubit.dart';

@immutable
abstract class AddSubscribtionsState {
  const AddSubscribtionsState();
  List<Object> get props => [];
}

class AddSubscribtionsInitial extends AddSubscribtionsState {}

class AddSubscribtionsLoading extends AddSubscribtionsState {
  const AddSubscribtionsLoading();
}

class AddSubscribtionsSuccessful extends AddSubscribtionsState {
  final String message;

  const AddSubscribtionsSuccessful(this.message);
}

class AddSubscribtionsFailed extends AddSubscribtionsState {
  final String message;
  const AddSubscribtionsFailed(this.message);
}

part of 'stoped_subscribtions_cubit.dart';

@immutable
abstract class StopedSubscribtionsState {
  const StopedSubscribtionsState();
  List<Object> get props => [];
}

class StopedSubscribtionsInitial extends StopedSubscribtionsState {}

class StopedSubscribtionsLoading extends StopedSubscribtionsState {
  const StopedSubscribtionsLoading();
}

class StopedSubscribtionsSuccessful extends StopedSubscribtionsState {
  final String message;

  const StopedSubscribtionsSuccessful(this.message);
}

class StopedSubscribtionsFailed extends StopedSubscribtionsState {
  final String message;
  const StopedSubscribtionsFailed(this.message);
}

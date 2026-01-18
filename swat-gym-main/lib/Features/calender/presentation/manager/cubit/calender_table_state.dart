part of 'calender_table_cubit.dart';

abstract class CalenderState {
  const CalenderState();
  List<Object> get props => [];
}

class FetchInitial extends CalenderState {}

class FetchLoading extends CalenderState {
  const FetchLoading();
}

class FetchSuccessful extends CalenderState {
  final CalenderList? data;

  const FetchSuccessful(this.data);
}

class FetchFailed extends CalenderState {
  final String message;
  const FetchFailed(this.message);
}

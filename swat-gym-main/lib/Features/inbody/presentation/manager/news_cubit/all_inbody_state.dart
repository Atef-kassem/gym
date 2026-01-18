part of 'all_inbody_cubit.dart';

abstract class AllInbodyState {
  const AllInbodyState();
  List<Object> get props => [];
}

class AllInbodyInitial extends AllInbodyState {}

class FetchLoading extends AllInbodyState {
  const FetchLoading();
}

class FetchSuccessful extends AllInbodyState {
  final AllInbodyList? data;

  const FetchSuccessful(this.data);
}

class FetchFailed extends AllInbodyState {
  final String message;
  const FetchFailed(this.message);
}

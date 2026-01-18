part of 'services_cubit.dart';

abstract class ServicesState {
  const ServicesState();
  List<Object> get props => [];
}

class Ta3memInitial extends ServicesState {}

class FetchLoading extends ServicesState {
  const FetchLoading();
}

class FetchSuccessful extends ServicesState {
  final ServicesEntity? data;

  const FetchSuccessful(this.data);
}

class FetchFailed extends ServicesState {
  final String message;
  const FetchFailed(this.message);
}

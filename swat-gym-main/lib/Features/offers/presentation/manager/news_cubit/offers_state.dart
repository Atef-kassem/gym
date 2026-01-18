part of 'offers_cubit.dart';

abstract class OffersState {
  const OffersState();
  List<Object> get props => [];
}

class NewsInitial extends OffersState {}

class FetchLoading extends OffersState {
  const FetchLoading();
}

class FetchSuccessful extends OffersState {
  final AllOffersList? data;

  const FetchSuccessful(this.data);
}

class FetchFailed extends OffersState {
  final String message;
  const FetchFailed(this.message);
}

part of 'add_offers_cubit.dart';

@immutable
abstract class AddOffersState {
  const AddOffersState();
  List<Object> get props => [];
}

class SeenTa3memInitial extends AddOffersState {}

class SeenTa3memLoading extends AddOffersState {
  const SeenTa3memLoading();
}

class AddOfferSuccessful extends AddOffersState {
  final AddOffersEntity? data;

  const AddOfferSuccessful(this.data);
}

class AddOfferFailed extends AddOffersState {
  final String message;
  const AddOfferFailed(this.message);
}

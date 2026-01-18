part of 'ads_cubit.dart';

abstract class AdsState {
  const AdsState();
  List<Object> get props => [];
}

class AdsInitialal extends AdsState {}

class FetchAdsLoading extends AdsState {
  const FetchAdsLoading();
}

class FetchAdsSuccessful extends AdsState {
  final AdsList? data;

  const FetchAdsSuccessful(this.data);
}

class FetchAdsFailed extends AdsState {
  final String message;
  const FetchAdsFailed(this.message);
}

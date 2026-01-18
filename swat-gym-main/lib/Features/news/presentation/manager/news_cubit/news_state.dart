part of 'news_cubit.dart';

abstract class NewsState {
  const NewsState();
  List<Object> get props => [];
}

class NewsInitial extends NewsState {}

class FetchLoading extends NewsState {
  const FetchLoading();
}

class FetchSuccessful extends NewsState {
  final AllNewsList? data;

  const FetchSuccessful(this.data);
}

class FetchFailed extends NewsState {
  final String message;
  const FetchFailed(this.message);
}

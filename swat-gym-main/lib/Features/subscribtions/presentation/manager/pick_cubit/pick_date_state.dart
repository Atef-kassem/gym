part of 'pick_date_cubit.dart';

@immutable
abstract class RequestPickDateState {}

class PickDateInitial extends RequestPickDateState {}

class PickDateFromSuccess extends RequestPickDateState {
  final String date;

  PickDateFromSuccess(this.date);
}

class PickDateToSuccess extends RequestPickDateState {
  final String date;

  PickDateToSuccess(this.date);
}

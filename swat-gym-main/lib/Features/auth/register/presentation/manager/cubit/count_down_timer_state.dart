part of 'count_down_timer_cubit.dart';

@immutable
abstract class CountDownTimerState {
  final int? elapsed;
  const CountDownTimerState(this.elapsed);
}

class CountDownTimerInitial extends CountDownTimerState {
  const CountDownTimerInitial() : super(0);
  List<Object?> get props => [];
}

class CountDownTimerProgress extends CountDownTimerState {
  const CountDownTimerProgress(super.elapsed);
  List<Object?> get props => [];
}

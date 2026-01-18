part of 'new_finger_print_cubit.dart';

abstract class NewFingerPrintState {
  const NewFingerPrintState();
  List<Object> get props => [];
}

class FingerPrintInitial extends NewFingerPrintState {}

class FingerPrintLoading extends NewFingerPrintState {
  const FingerPrintLoading();
}

class FingerPrintSuccessful extends NewFingerPrintState {
  final NewFingerPrintModel data;

  const FingerPrintSuccessful(this.data);
}

class FingerPrintFailed extends NewFingerPrintState {
  final String message;
  const FingerPrintFailed(this.message);
}

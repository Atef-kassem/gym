part of 'finger_print_cubit.dart';

abstract class FingerPrintState {
  const FingerPrintState();
  List<Object> get props => [];
}

class FingerPrintInitial extends FingerPrintState {}

class FingerPrintLoading extends FingerPrintState {
  const FingerPrintLoading();
}

class FingerPrintSuccessful extends FingerPrintState {
  final NewFingerPrintEntity data;

  const FingerPrintSuccessful(this.data);
}

class FingerPrintFailed extends FingerPrintState {
  final String message;
  const FingerPrintFailed(this.message);
}

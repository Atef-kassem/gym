part of 'update_signature_cubit.dart';

@immutable
abstract class UpdateSignatureState {
  const UpdateSignatureState();
  List<Object> get props => [];
}

class UpdateSignatureInitial extends UpdateSignatureState {}

class UpdateSignatureLoading extends UpdateSignatureState {
  const UpdateSignatureLoading();
}

class UpdateSignatureSuccessful extends UpdateSignatureState {
  final EmployeeEntity data;

  const UpdateSignatureSuccessful(this.data);
}

class UpdateSignatureFailed extends UpdateSignatureState {
  final String failMessage;
  const UpdateSignatureFailed(this.failMessage);
}

// ignore: depend_on_referenced_packages
import 'package:bloc/bloc.dart';
// ignore: depend_on_referenced_packages
import 'package:meta/meta.dart';
import 'package:swat_gym/features/auth/login/domain/entities/employee_entity.dart';
import 'package:swat_gym/features/auth/update_signature/domain/use_cases/update_signature_use_case.dart';

part 'update_signature_state.dart';

class UpdateSignatureCubit extends Cubit<UpdateSignatureState> {
  final UpdateSignatureUseCase updateSignatureUseCase;
  bool isLoading = false;

  UpdateSignatureCubit(this.updateSignatureUseCase)
      : super(UpdateSignatureInitial());

  Future<void> updateSignature(
    String userId,
    dynamic attachment,
  ) async {
    emit(const UpdateSignatureLoading());
    final result = await updateSignatureUseCase.call(userId, attachment);

    emit(result.fold(
      UpdateSignatureFailed.new,
      UpdateSignatureSuccessful.new,
    ));
  }
}

// ignore: depend_on_referenced_packages
import 'package:bloc/bloc.dart';
// ignore: depend_on_referenced_packages
import 'package:meta/meta.dart';

import '../../../domain/entities/register_entity.dart';
import '../../../domain/use_cases/register_use_case.dart';

part 'register_state.dart';

class RegisterCubit extends Cubit<RegisterState> {
  final RegisterUseCase registerRequest;
  bool isLoading = false;

  RegisterCubit(this.registerRequest) : super(RegisterInitial());

  Future<void> registerUser(

        String name,
    String branchId,
    String gender,
    String phone,
    String password,
    String confirmPassword,


  ) async {
    emit(const RegisterLoading());
    final result = await registerRequest.call(
      name,
      branchId,
      gender,
      phone,
      password,
      confirmPassword,
    );

    emit(
      result.fold(
        RegisterFailed.new,
        RegisterSuccessful.new,
      ),
    );
  }
}

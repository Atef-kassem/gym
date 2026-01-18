// ignore: depend_on_referenced_packages
import 'package:bloc/bloc.dart';
// ignore: depend_on_referenced_packages
import 'package:meta/meta.dart';
import 'package:swat_gym/features/auth/login/domain/entities/employee_entity.dart';
import 'package:swat_gym/features/auth/update_profile/domain/use_cases/update_profile_use_case.dart';

part 'update_profile_state.dart';

class UpdateProfileCubit extends Cubit<UpdateProfileState> {
  final UpdateProfileUseCase updateProfileUseCase;
  bool isLoading = false;

  UpdateProfileCubit(this.updateProfileUseCase) : super(UpdateProfileInitial());

  Future<void> updateProfile(
    String userId,
    dynamic attachment,
  ) async {
    emit(const UpdateProfileLoading());
    final result = await updateProfileUseCase.call(userId, attachment);

    emit(result.fold(
      UpdateProfileFailed.new,
      UpdateProfileSuccessful.new,
    ));
  }
}

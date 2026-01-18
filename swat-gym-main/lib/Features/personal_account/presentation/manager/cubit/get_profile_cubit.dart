// ignore: depend_on_referenced_packages
import 'package:bloc/bloc.dart';
// ignore: depend_on_referenced_packages
import 'package:meta/meta.dart';
import 'package:swat_gym/features/auth/login/data/models/login_model/login_model/employee_model.dart';
import 'package:swat_gym/features/personal_account/domain/use_cases/get_profile_use_case.dart';

part 'get_profile_state.dart';

class GetProfileCubit extends Cubit<GetProfileState> {
  final GetProfileUseCase getProfileUseCase;
  bool isLoading = false;

  GetProfileCubit(this.getProfileUseCase) : super(GetProfileInitial());

  Future<void> getProfile(
    String userId,
  ) async {
    emit(const getProfileLoading());
    final result = await getProfileUseCase.call(userId);

    emit(result.fold(
      GetProfileFailed.new,
      GetProfileSuccessful.new,
    ));
  }
}

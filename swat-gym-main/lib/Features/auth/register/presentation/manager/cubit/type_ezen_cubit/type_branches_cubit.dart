// ignore: depend_on_referenced_packages
import 'package:bloc/bloc.dart';
import 'package:swat_gym/features/auth/register/data/models/register_model/branches.dart';
import 'package:swat_gym/features/auth/register/domain/use_cases/register_use_case.dart';

part 'type_ezen_state.dart';

class TypeBranchesCubit extends Cubit<BranchesState> {
  RegisterUseCase myMessagesUseCase;
  TypeBranchesCubit(this.myMessagesUseCase) : super(MyMessagesInitial());

  Future<void> getTypesEzen() async {
    emit(const FetchLoading());
    final result = await myMessagesUseCase.fetchTypesBranches();

    emit(result.fold(FetchFailed.new, FetchSuccessful.new));
  }
}

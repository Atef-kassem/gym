// ignore: depend_on_referenced_packages
import 'package:bloc/bloc.dart';
import 'package:swat_gym/features/introduction/data/models/my_services_model/intro.dart';
import 'package:swat_gym/features/introduction/domain/use_cases/intro_use_case.dart';

part 'intro_state.dart';

class IntroCubit extends Cubit<IntroState> {
  IntroUseCase servicesUseCase;
  IntroCubit(this.servicesUseCase) : super(Ta3memInitial());

  Future<void> getAllLwae7List() async {
    emit(const FetchLoading());
    final result = await servicesUseCase.fetchAllServices();

    emit(result.fold(FetchFailed.new, FetchSuccessful.new));
  }
}

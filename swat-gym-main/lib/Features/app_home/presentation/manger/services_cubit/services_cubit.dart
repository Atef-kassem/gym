// ignore: depend_on_referenced_packages
import 'package:bloc/bloc.dart';
import 'package:swat_gym/features/app_home/domain/entities/services_entity.dart';
import 'package:swat_gym/features/app_home/domain/use_cases/finger_print_use_case.dart';

part 'services_state.dart';

class ServicesCubit extends Cubit<ServicesState> {
  FingerPrintUseCase servicesUseCase;
  ServicesCubit(this.servicesUseCase) : super(Ta3memInitial());

  Future<void> getAllLwae7List() async {
    emit(const FetchLoading());
    final result = await servicesUseCase.fetchAllServices();

    emit(result.fold(FetchFailed.new, FetchSuccessful.new));
  }
}

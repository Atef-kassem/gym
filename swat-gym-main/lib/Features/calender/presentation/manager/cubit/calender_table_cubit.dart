// ignore: depend_on_referenced_packages
import 'package:bloc/bloc.dart';

import 'package:swat_gym/features/calender/data/models/calender_model/calender_model.dart';
import '../../../domain/use_case/calender_use_case.dart';

part 'calender_table_state.dart';

class CalenderCubit extends Cubit<CalenderState> {
  CalenderUseCase tableUseCase;
  CalenderCubit(this.tableUseCase) : super(FetchInitial());

  Future<void> getCalenderData(String month, String empId) async {
    emit(const FetchLoading());
    final result = await tableUseCase.call(month, empId);

    emit(result.fold(FetchFailed.new, FetchSuccessful.new));
  }
}

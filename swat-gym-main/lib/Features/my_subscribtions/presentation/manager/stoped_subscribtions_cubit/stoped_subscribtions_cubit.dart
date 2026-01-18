import 'package:bloc/bloc.dart';
import 'package:swat_gym/features/my_subscribtions/domain/use_cases/my_subscribtions_use_case.dart';
import 'package:meta/meta.dart';

part 'stoped_subscribtions_state.dart';

class StopedSubscribtionsCubit extends Cubit<StopedSubscribtionsState> {
  MySubscribtionsUseCase subscribtionsUseCase;

  StopedSubscribtionsCubit(this.subscribtionsUseCase)
      : super(StopedSubscribtionsInitial());
  Future<void> stopedSubscribtions(
      fromDate, subId, reason, numDays, typeFK) async {
    emit(const StopedSubscribtionsLoading());
    final result = await subscribtionsUseCase.callStopedSubscribtions(
        fromDate, subId, reason, numDays, typeFK);

    emit(
      result.fold(
        StopedSubscribtionsFailed.new,
        StopedSubscribtionsSuccessful.new,
      ),
    );
  }
}

// ignore: depend_on_referenced_packages
import 'package:bloc/bloc.dart';
import 'package:swat_gym/features/subscribtions/domain/use_cases/subscribtions_use_case.dart';
// ignore: depend_on_referenced_packages
import 'package:meta/meta.dart';

part 'add_subscribtions_state.dart';

class AddSubscribtionsCubit extends Cubit<AddSubscribtionsState> {
  SubscribtionsUseCase subscribtionsUseCase;

  AddSubscribtionsCubit(this.subscribtionsUseCase)
      : super(AddSubscribtionsInitial());
  Future<void> addSubscribtions(fromDate, subId) async {
    emit(const AddSubscribtionsLoading());
    final result =
        await subscribtionsUseCase.callAddSubscribtions(fromDate, subId);

    emit(
      result.fold(
        AddSubscribtionsFailed.new,
        AddSubscribtionsSuccessful.new,
      ),
    );
  }
}

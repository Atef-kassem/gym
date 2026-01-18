// ignore: depend_on_referenced_packages
import 'package:bloc/bloc.dart';
import 'package:swat_gym/features/subscribtions/data/models/my_messages_model/subscribtions.dart';
import 'package:swat_gym/features/subscribtions/domain/use_cases/subscribtions_use_case.dart';

part 'subscribtions_state.dart';

class SubscribtionsCubit extends Cubit<SubscribtionsState> {
  SubscribtionsUseCase mosalatUseCase;
  SubscribtionsCubit(this.mosalatUseCase) : super(SubscribtionsInitial());

  Future<void> getAllMosalat() async {
    emit(const FetchLoading());
    final result = await mosalatUseCase.callAllSubscribtions();

    emit(result.fold(FetchFailed.new, FetchSuccessful.new));
  }
}

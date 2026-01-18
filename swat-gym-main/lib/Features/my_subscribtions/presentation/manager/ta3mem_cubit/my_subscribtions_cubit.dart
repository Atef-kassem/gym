// ignore: depend_on_referenced_packages
import 'package:bloc/bloc.dart';
import 'package:swat_gym/features/my_subscribtions/data/models/my_messages_model/my_subscribtions.dart';
import 'package:swat_gym/features/my_subscribtions/domain/use_cases/my_subscribtions_use_case.dart';

part 'my_subscribtions_state.dart';

class MySubscribtionsCubit extends Cubit<MySubscribtionsState> {
  MySubscribtionsUseCase mosalatUseCase;
  MySubscribtionsCubit(this.mosalatUseCase) : super(MosalatInitial());

  Future<void> getMySubscribtions({int? memberId}) async {
    emit(const FetchLoading());
    final result = await mosalatUseCase.callMySubscribtions(memberId: memberId);

    emit(result.fold(FetchFailed.new, FetchSuccessful.new));
  }
}

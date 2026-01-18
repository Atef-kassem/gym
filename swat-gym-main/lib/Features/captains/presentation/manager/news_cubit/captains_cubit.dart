// ignore: depend_on_referenced_packages
import 'package:bloc/bloc.dart';
import 'package:swat_gym/features/captains/data/models/captains.dart';

import '../../../domain/use_cases/captains_use_case.dart';

part 'captains_state.dart';

class CaptainsCubit extends Cubit<CaptainsState> {
  CaptainsUseCase newsUseCase;
  CaptainsCubit(this.newsUseCase) : super(NewsInitial());

  Future<void> getAllCaptains(String userId) async {
    emit(const FetchLoading());
    final result = await newsUseCase.callAllCaptains(userId);

    emit(result.fold(FetchFailed.new, FetchSuccessful.new));
  }
}

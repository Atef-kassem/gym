// ignore: depend_on_referenced_packages
import 'package:bloc/bloc.dart';
import 'package:swat_gym/features/inbody/data/models/all_inbody.dart';

import '../../../domain/use_cases/all_inbody_use_case.dart';

part 'all_inbody_state.dart';

class AllInbodyCubit extends Cubit<AllInbodyState> {
  AllInbodyUseCase allInbodyUseCase;
  AllInbodyCubit(this.allInbodyUseCase) : super(AllInbodyInitial());

  Future<void> getAllInbody(String userId) async {
    emit(const FetchLoading());
    final result = await allInbodyUseCase.callAllInbody(userId);

    emit(result.fold(FetchFailed.new, FetchSuccessful.new));
  }
}

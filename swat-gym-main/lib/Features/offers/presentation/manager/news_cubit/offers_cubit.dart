// ignore: depend_on_referenced_packages
import 'package:bloc/bloc.dart';

import '../../../data/models/my_messages_model/offers.dart';
import '../../../domain/use_cases/offers_use_case.dart';

part 'offers_state.dart';

class OffersCubit extends Cubit<OffersState> {
  OffersUseCase newsUseCase;
  OffersCubit(this.newsUseCase) : super(NewsInitial());

  Future<void> getAllOffers(String userId) async {
    if (isClosed) return;
    emit(const FetchLoading());
    
    final result = await newsUseCase.callAllOffers(userId);
    
    // التحقق من أن الـ Cubit لم يتم إغلاقه قبل emit حالة جديدة
    if (!isClosed) {
      emit(result.fold(FetchFailed.new, FetchSuccessful.new));
    }
  }
}

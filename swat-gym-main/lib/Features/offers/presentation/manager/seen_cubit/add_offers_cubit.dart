// ignore: depend_on_referenced_packages
import 'package:bloc/bloc.dart';
// ignore: depend_on_referenced_packages
import 'package:meta/meta.dart';

import '../../../../../features/offers/domain/entities/add_offers_entity.dart';
import '../../../domain/use_cases/offers_use_case.dart';

part 'add_offers_state.dart';

class AddOffersCubit extends Cubit<AddOffersState> {
  OffersUseCase offerUseCase;

  AddOffersCubit(this.offerUseCase) : super(SeenTa3memInitial());
  Future<void> addFavorit(
    String messageId,
    String toUserId,
  ) async {
    emit(const SeenTa3memLoading());
    final result = await offerUseCase.AddOffer(messageId, toUserId);

    emit(
      result.fold(
        AddOfferFailed.new,
        AddOfferSuccessful.new,
      ),
    );
  }
}

// ignore: depend_on_referenced_packages
import 'package:bloc/bloc.dart';
import 'package:swat_gym/features/app_home/data/models/ads_model/ads_model.dart';
import 'package:swat_gym/features/app_home/domain/use_cases/finger_print_use_case.dart';

part 'ads_state.dart';

class AdsCubit extends Cubit<AdsState> {
  FingerPrintUseCase servicesUseCase;
  AdsCubit(this.servicesUseCase) : super(AdsInitialal());

  Future<void> getAllAdsList() async {
    if (isClosed) return;
    emit(const FetchAdsLoading());

    final result = await servicesUseCase.fetchAllAds();

    // التحقق من أن الـ Cubit لم يتم إغلاقه قبل emit حالة جديدة
    if (!isClosed) {
      emit(result.fold(FetchAdsFailed.new, FetchAdsSuccessful.new));
    }
  }
}

// ignore: depend_on_referenced_packages
import 'package:bloc/bloc.dart';
// ignore: depend_on_referenced_packages
import 'package:meta/meta.dart';

import '../../../data/models/about_app_model/datum.dart';
import '../../../domain/use_cases/about_app_use_case.dart';

part 'about_app_state.dart';

class AboutAppCubit extends Cubit<AboutAppState> {
  AboutAppUseCase aboutAppUseCase;
  AboutAppCubit(this.aboutAppUseCase) : super(AboutAppInitial());
  Future<void> getAboutAppData() async {
    emit(const AboutAppLoading());
    final result = await aboutAppUseCase.call();

    emit(result.fold(AboutAppFailed.new, AboutAppSuccessful.new));
  }
}

// ignore: depend_on_referenced_packages
import 'package:bloc/bloc.dart';

import 'package:flutter/material.dart' show Locale;
// ignore: depend_on_referenced_packages
import 'package:meta/meta.dart';

import '../../../../../core/utils/constants.dart';
import '../../../domain/use_case/change_locale_use_case.dart';
import '../../../domain/use_case/get_saved_lang_use_case.dart';

part 'locale_state.dart';

class LocaleCubit extends Cubit<LocaleState> {
  final ChangeLocaleUseCase changeLocaleUseCase;
  final GetSavedLangUseCase getSavedLangUseCase;

  LocaleCubit(
      {required this.changeLocaleUseCase, required this.getSavedLangUseCase})
      : super(const SelectedLocale(Locale('ar')));

  String langCode = arabic;

  Future<void> _changeLocale(String locale) async {
    changeLocaleUseCase.call(locale: locale);
    langCode = locale;
    emit(SelectedLocale(Locale(langCode)));
  }

  void getSavedLang() async {
    langCode = await getSavedLangUseCase.call();
    emit(SelectedLocale(Locale(langCode)));
  }

  void toEnglish() => _changeLocale(english);
  void toArabic() => _changeLocale(arabic);
}

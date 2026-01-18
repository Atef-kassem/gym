// ignore: depend_on_referenced_packages
import 'package:shared_preferences/shared_preferences.dart';

import '../../../../core/utils/constants.dart';
import 'language_local_data_source.dart';

class LanguageLocalDataSourceImpl implements LanguageLocalDataSource {
  final SharedPreferences sharedPreferences;

  LanguageLocalDataSourceImpl({required this.sharedPreferences});

  @override
  Future<void> changeLocale({required String locale}) =>
      sharedPreferences.setString(locale, locale);

  @override
  Future<String> getSavedLang() async {
    return sharedPreferences.containsKey(locale)
        ? sharedPreferences.getString(locale)!
        : english;
  }
}

abstract class LanguageLocalDataSource {
  Future<String> getSavedLang();
  Future<void> changeLocale({required String locale});
}

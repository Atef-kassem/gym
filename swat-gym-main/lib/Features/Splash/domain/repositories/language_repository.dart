abstract class LanguageRepository {
  Future<void> changeLocale({required String locale});
  Future<String> getSavedLang();
}

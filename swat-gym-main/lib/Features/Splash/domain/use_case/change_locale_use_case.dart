import '../repositories/language_repository.dart';

class ChangeLocaleUseCase {
  final LanguageRepository languageRepository;
  ChangeLocaleUseCase({required this.languageRepository});

  Future<void> call({required String locale}) async =>
      await languageRepository.changeLocale(locale: locale);
}

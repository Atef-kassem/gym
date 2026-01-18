part of 'select_file_cubit.dart';

@immutable
abstract class SelectFileState {}

class RequestVacationInitial extends SelectFileState {}

class PickFileState extends SelectFileState {
  final String fileName;
  final File filePath;

  PickFileState(this.fileName, this.filePath);
}

class PickImageState extends SelectFileState {
  final File imagePath;

  PickImageState(this.imagePath);
}

import 'package:equatable/equatable.dart';

class ExerciseCatEntity extends Equatable {
  final String? catId;
  final String? catName;

  const ExerciseCatEntity({
    this.catId,
    this.catName,
  });

  @override
  List<Object?> get props => [
        catId,
        catName,
      ];
}

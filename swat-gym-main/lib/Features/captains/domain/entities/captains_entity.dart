import 'package:equatable/equatable.dart';

class CaptainsEntity extends Equatable {
  final String? id;
  final String? name;
  final String? about;
  final String? mainImage;
  final String? imagePath;

  const CaptainsEntity(
      {this.id, this.name, this.about, this.imagePath, this.mainImage});

  @override
  List<Object?> get props => [id, name, about, imagePath, mainImage];
}

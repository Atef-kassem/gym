import 'package:equatable/equatable.dart';

class AllInbodyEntity extends Equatable {
  final String? id;
  final String? title;
  final String? memCodeFk;
  final String? memIdFk;
  final String? dayDate;
  final String? forMonth;
  final String? forYear;
  final String? created;
  final dynamic updated;
  final String? image;
  final String? imagePath;

  const AllInbodyEntity(
      {this.id,
      this.title,
      this.memCodeFk,
      this.memIdFk,
      this.dayDate,
      this.forMonth,
      this.forYear,
      this.created,
      this.updated,
      this.image,
      this.imagePath});

  @override
  List<Object?> get props => [
        id,
        title,
        memCodeFk,
        memIdFk,
        dayDate,
        forMonth,
        forYear,
        created,
        updated,
        image,
        imagePath
      ];
}

// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'employee_entity.dart';

// **************************************************************************
// TypeAdapterGenerator
// **************************************************************************

class EmployeeEntityAdapter extends TypeAdapter<EmployeeEntity> {
  @override
  final int typeId = 1;

  @override
  EmployeeEntity read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return EmployeeEntity(
      memId: fields[0] as String?,
      mCode: fields[1] as String?,
      gender: fields[2] as String?,
      phone: fields[3] as String?,
      image: fields[4] as String?,
      blocked: fields[5] as String?,
      branchIdFk: fields[6] as String?,
      active: fields[7] as String?,
      branchName: fields[8] as String?,
      imgPath: fields[9] as String?,
      name: fields[10] as String?,
      barcodePath: fields[11] as String?,
    );
  }

  @override
  void write(BinaryWriter writer, EmployeeEntity obj) {
    writer
      ..writeByte(12)
      ..writeByte(0)
      ..write(obj.memId)
      ..writeByte(1)
      ..write(obj.mCode)
      ..writeByte(2)
      ..write(obj.gender)
      ..writeByte(3)
      ..write(obj.phone)
      ..writeByte(4)
      ..write(obj.image)
      ..writeByte(5)
      ..write(obj.blocked)
      ..writeByte(6)
      ..write(obj.branchIdFk)
      ..writeByte(7)
      ..write(obj.active)
      ..writeByte(8)
      ..write(obj.branchName)
      ..writeByte(9)
      ..write(obj.imgPath)
      ..writeByte(10)
      ..write(obj.name)
      ..writeByte(11)
      ..write(obj.barcodePath);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is EmployeeEntityAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}

// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'new_finger_print_entity.dart';

// **************************************************************************
// TypeAdapterGenerator
// **************************************************************************

class NewFingerPrintEntityAdapter extends TypeAdapter<NewFingerPrintEntity> {
  @override
  final int typeId = 20;

  @override
  NewFingerPrintEntity read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return NewFingerPrintEntity(
      hodoorId: fields[0] as dynamic,
      empCode: fields[1] as dynamic,
      hdoorTime: fields[2] as dynamic,
      ensrafTime: fields[3] as dynamic,
      lateMin: fields[4] as dynamic,
    );
  }

  @override
  void write(BinaryWriter writer, NewFingerPrintEntity obj) {
    writer
      ..writeByte(5)
      ..writeByte(0)
      ..write(obj.hodoorId)
      ..writeByte(1)
      ..write(obj.empCode)
      ..writeByte(2)
      ..write(obj.hdoorTime)
      ..writeByte(3)
      ..write(obj.ensrafTime)
      ..writeByte(4)
      ..write(obj.lateMin);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is NewFingerPrintEntityAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}

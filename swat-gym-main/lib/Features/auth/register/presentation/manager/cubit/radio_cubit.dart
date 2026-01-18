import 'package:bloc/bloc.dart';

class RadioCubit extends Cubit<int> {
  RadioCubit() : super(1); // الحالة الافتراضية هي "Male"

  void selectRadio(int value) {
    emit(value); // تحديث الحالة عند تغيير الراديو
  }
}

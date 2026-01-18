import 'package:flutter_bloc/flutter_bloc.dart';

class ToggleCubit extends Cubit<int> {
  ToggleCubit(super.initialState);

  void toggleIndex(index) {
    emit(index);
  }
}

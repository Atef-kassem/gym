// ignore: depend_on_referenced_packages
import 'package:bloc/bloc.dart';
import 'package:flutter/material.dart';
import 'package:swat_gym/core/utils/constants.dart';
import 'package:intl/intl.dart';

part 'pick_date_state.dart';

class PickDateCubit extends Cubit<RequestPickDateState> {
  PickDateCubit() : super(PickDateInitial());
  String? from;
  String? to;
  DateTime? valueTo;
  DateTime? valueFrom;

  Future<void> pickDate(context, check) async {
    showDatePicker(
            builder: (context, child) {
              return Theme(
                data: Theme.of(context).copyWith(
                    colorScheme: ColorScheme.light(
                      primary: kPrimaryColor, // header background color
                      onPrimary: Colors.white, // header text color
                      onSurface: kPrimaryColor, // body text color
                    ),
                    textButtonTheme: TextButtonThemeData(
                      style: TextButton.styleFrom(
                        foregroundColor: kPrimaryColor, // button text color
                      ),
                    ),
                    primaryTextTheme: const TextTheme(
                      headlineMedium: TextStyle(fontSize: 10),
                    ),
                    textTheme: const TextTheme(
                      headlineMedium: TextStyle(fontSize: 20),
                    )),
                child: child!,
              );
            },
            context: context,
            initialDate: DateTime.now(),
            firstDate: DateTime(2022),
            lastDate: DateTime(2030))
        .then((value) {
      if (value != null) {
        var formatted = DateFormat("yyyy-MM-dd").format(value);
        if (check == "from") {
          from = formatted;
          emit(PickDateFromSuccess(formatted));
          valueFrom = value;
        } else {
          valueTo = value;
          to = formatted;

          emit(PickDateToSuccess(formatted));
        }
      }
    });
  }
}

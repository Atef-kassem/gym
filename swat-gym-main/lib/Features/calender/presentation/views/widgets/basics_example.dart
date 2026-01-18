// Copyright 2019 Aleksander Woźniak
// SPDX-License-Identifier: Apache-2.0

// ignore_for_file: library_private_types_in_public_api

import 'package:swat_gym/core/utils/constants.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:table_calendar/table_calendar.dart';

import '../../../data/models/calender_model/calender_model.dart';
import '../utils.dart';

class TableBasicsExample extends StatefulWidget {
  final Data data;

  const TableBasicsExample({super.key, required this.data});
  @override
  _TableBasicsExampleState createState() => _TableBasicsExampleState();
}

class _TableBasicsExampleState extends State<TableBasicsExample> {
  CalendarFormat _calendarFormat = CalendarFormat.month;
  DateTime _focusedDay = DateTime.now();
  DateTime? _selectedDay;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(8.0),
      child: TableCalendar(
        startingDayOfWeek: StartingDayOfWeek.sunday,
        daysOfWeekHeight: 30,
        daysOfWeekStyle: DaysOfWeekStyle(
          weekdayStyle: const TextStyle(color: Colors.white, fontSize: 10),
          weekendStyle: const TextStyle(color: Colors.black, fontSize: 10),
          dowTextFormatter: (date, locale) {
            return DateFormat('EEEE', "ar").format(date);
          },
          decoration: BoxDecoration(
              color: kPrimaryColor,
              shape: BoxShape.rectangle,
              borderRadius: const BorderRadius.all(Radius.circular(10))),
        ),
        weekendDays: const [DateTime.friday, DateTime.saturday],
        headerStyle: const HeaderStyle(
          formatButtonVisible: false,
          titleCentered: true,
          rightChevronIcon: Icon(
            Icons.chevron_right,
            size: 16,
            color: Colors.grey,
          ),
          leftChevronIcon: Icon(
            Icons.chevron_left,
            size: 16,
            color: Colors.grey,
          ),
        ),
        firstDay: kFirstDay,
        lastDay: kLastDay,
        focusedDay: _focusedDay,
        calendarFormat: _calendarFormat,
        calendarStyle: CalendarStyle(
          defaultTextStyle: const TextStyle(color: Colors.white),
          weekendTextStyle: const TextStyle(color: Colors.white),
          holidayTextStyle: const TextStyle(color: Colors.white),
          defaultDecoration: BoxDecoration(
              shape: BoxShape.rectangle,
              color: kPrimaryColor,
              borderRadius: const BorderRadius.all(Radius.circular(10))),
          //  markersAlignment: Alignment.center,
          // selectedDecoration: BoxDecoration(
          //     color: Color.fromARGB(255, 184, 108, 21),
          //     shape: BoxShape.rectangle),
          holidayDecoration: const BoxDecoration(
              color: Colors.red,
              shape: BoxShape.rectangle,
              borderRadius: BorderRadius.all(Radius.circular(10))),

          weekendDecoration: const BoxDecoration(
              color: Colors.amber,
              shape: BoxShape.rectangle,
              borderRadius: BorderRadius.all(Radius.circular(10))),
        ),
        holidayPredicate: (day) {
          return day.day == 12 || day.day == 7;
        },
        selectedDayPredicate: (day) {
          // Use `selectedDayPredicate` to determine which day is currently selected.
          // If this returns true, then `day` will be marked as selected.

          // Using `isSameDay` is recommended to disregard
          // the time-part of compared DateTime objects.
          return isSameDay(_selectedDay, day);
        },
        onDaySelected: (selectedDay, focusedDay) {
          if (!isSameDay(_selectedDay, selectedDay)) {
            // Call `setState()` when updating the selected day
            setState(() {
              _selectedDay = selectedDay;
              _focusedDay = focusedDay;
            });
          }
        },
        onFormatChanged: (format) {
          if (_calendarFormat != format) {
            // Call `setState()` when updating calendar format
            setState(() {
              _calendarFormat = format;
            });
          }
        },
        onPageChanged: (focusedDay) {
          // No need to call `setState()` here
          _focusedDay = focusedDay;
        },
      ),
    );
  }
}

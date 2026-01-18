// ignore: depend_on_referenced_packages
import 'package:bloc/bloc.dart';
import 'package:flutter/material.dart';
import 'package:geocoding/geocoding.dart';
import 'package:geolocator/geolocator.dart';
import 'package:get/get.dart';
import 'package:swat_gym/features/new_bsama_add_Fingerprint/data/models/finger_print_model/new_finger_print_model.dart';

import '../../domain/use_cases/new_finger_print_use_case.dart';

part 'new_finger_print_state.dart';

class NewFingerPrintCubit extends Cubit<NewFingerPrintState> {
  final NewFingerPrintUseCase fingerPrint;
  bool isLoading = false;
  Position? _currentPosition;

  NewFingerPrintCubit(this.fingerPrint) : super(FingerPrintInitial());

  Future<void> getUserData(String empId, dynamic image, context) async {
    await _getCurrentPosition(context);
    if (_currentPosition != null) {
      String lat = _currentPosition!.latitude.toString();
      String long = _currentPosition!.longitude.toString();

      emit(const FingerPrintLoading());
      final result = await fingerPrint.call(empId, image, lat, long);

      emit(result.fold(FingerPrintFailed.new, FingerPrintSuccessful.new));
    } else {
      await _getCurrentPosition(context);
    }
  }

  Future<void> _getAddressFromLatLng(Position position) async {
    await placemarkFromCoordinates(
            _currentPosition!.latitude, _currentPosition!.longitude)
        .then((List<Placemark> placemarks) {
      // setState(() {
      //   _currentAddress =
      //       '${place.street}, ${place.subLocality}, ${place.subAdministrativeArea}, ${place.postalCode}';
      // });
    }).catchError((e) {
      debugPrint(e);
    });
  }

  Future<void> _getCurrentPosition(context) async {
    final hasPermission = await _handleLocationPermission(context);

    if (!hasPermission) return;
    await Geolocator.getCurrentPosition(desiredAccuracy: LocationAccuracy.high)
        .then((Position position) {
      _currentPosition = position;
      _getAddressFromLatLng(_currentPosition!);
    }).catchError((e) {
      debugPrint(e.toString());
    });
  }

  Future<bool> _handleLocationPermission(context) async {
    bool serviceEnabled;
    LocationPermission permission;

    serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      // ScaffoldMessenger.of(context!).showSnackBar(const SnackBar(
      //     content: Text(
      //         'Location services are disabled. Please enable the services')));

      await Geolocator.openLocationSettings();

      return false;
    }
    permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        ScaffoldMessenger.of(Get.context!).showSnackBar(
            const SnackBar(content: Text('Location permissions are denied')));
        return false;
      }
    }
    if (permission == LocationPermission.deniedForever) {
      ScaffoldMessenger.of(Get.context!).showSnackBar(const SnackBar(
          content: Text(
              'Location permissions are permanently denied, we cannot request permissions.')));
      return false;
    }
    return true;
  }
}

// ignore: depend_on_referenced_packages
import 'package:bloc/bloc.dart';
import 'package:swat_gym/features/new_bsama_add_Fingerprint/domain/entities/new_finger_print_entity.dart';

import '../../domain/use_cases/finger_print_use_case.dart';

part 'finger_print_state.dart';

class FingerPrintCubit extends Cubit<FingerPrintState> {
  final FingerPrintUseCase fingerPrint;
  bool isLoading = false;
  // Position? _currentPosition;

  FingerPrintCubit(this.fingerPrint) : super(FingerPrintInitial());

  Future<void> getUserData(String empId) async {
    emit(const FingerPrintLoading());
    final result = await fingerPrint.call(empId);

    emit(result.fold(FingerPrintFailed.new, FingerPrintSuccessful.new));
  }

  // Future<void> _getAddressFromLatLng(Position position) async {
  //   await placemarkFromCoordinates(
  //           _currentPosition!.latitude, _currentPosition!.longitude)
  //       .then((List<Placemark> placemarks) {
  //     // setState(() {
  //     //   _currentAddress =
  //     //       '${place.street}, ${place.subLocality}, ${place.subAdministrativeArea}, ${place.postalCode}';
  //     // });
  //   }).catchError((e) {
  //     debugPrint(e);
  //   });
  // }

  // Future<bool> _handleLocationPermission(context) async {
  //   bool serviceEnabled;
  //   LocationPermission permission;

  //   serviceEnabled = await Geolocator.isLocationServiceEnabled();
  //   if (!serviceEnabled) {
  //     // ScaffoldMessenger.of(context!).showSnackBar(const SnackBar(
  //     //     content: Text(
  //     //         'Location services are disabled. Please enable the services')));

  //     await Geolocator.openLocationSettings();

  //     return false;
  //   }
  //   permission = await Geolocator.checkPermission();
  //   if (permission == LocationPermission.denied) {
  //     permission = await Geolocator.requestPermission();
  //     if (permission == LocationPermission.denied) {
  //       ScaffoldMessenger.of(Get.context!).showSnackBar(
  //           const SnackBar(content: Text('Location permissions are denied')));
  //       return false;
  //     }
  //   }
  //   if (permission == LocationPermission.deniedForever) {
  //     ScaffoldMessenger.of(Get.context!).showSnackBar(const SnackBar(
  //         content: Text(
  //             'Location permissions are permanently denied, we cannot request permissions.')));
  //     return false;
  //   }
  //   return true;
  // }
}

import 'dart:async';
import 'dart:io';

import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:swat_gym/core/utils/gaps.dart';
import 'package:swat_gym/features/auth/login/presentation/views/login_view.dart';
import 'package:hive/hive.dart';

import '../../../../core/utils/constants.dart';
import '../../../../core/utils/functions/setup_service_locator.dart';
import '../../../../core/widgets/error_text.dart';
import '../../../auth/login/domain/entities/employee_entity.dart';
import '../../../auth/login/presentation/manger/login_cubit.dart';
import '../../../auth/register/presentation/manager/cubit/phone_auth_cubit.dart';
import '../../../bottom_nav/presentation/views/bottom_nav.dart';

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key});

  @override
  _MyHomePageState createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  final Connectivity _connectivity = Connectivity();
  late StreamSubscription<ConnectivityResult> _connectivitySubscription;
  ConnectivityResult _connectionStatus = ConnectivityResult.wifi;

  @override
  void initState() {
    super.initState();
    initConnectivity();
    _connectivitySubscription =
        _connectivity.onConnectivityChanged.listen(_updateConnectionStatus);
  }

  @override
  void dispose() {
    _connectivitySubscription.cancel();
    super.dispose();
  }

  Future<void> initConnectivity() async {
    try {
      final result = await _connectivity.checkConnectivity();
      if (mounted) _updateConnectionStatus(result);
    } on PlatformException catch (e) {
      debugPrint('Connectivity Error: $e');
    }
  }

  void _updateConnectionStatus(ConnectivityResult result) {
    setState(() {
      _connectionStatus = result;
    });
  }

  @override
  Widget build(BuildContext context) {
    final bool isConnected = _connectionStatus == ConnectivityResult.mobile ||
        _connectionStatus == ConnectivityResult.wifi;

    final employeeBox = Hive.box<EmployeeEntity>(kEmployeeDataBox);
    final localStorage = Hive.box('local_storage');

    final employee = employeeBox.get(kEmployeeDataBox);
    final localPath = localStorage.get('barcode_path');

    if (isConnected) {
      if (employee == null) {
        return MultiBlocProvider(
          providers: [
            BlocProvider(create: (_) => getIt<PhoneAuthCubit>()),
            BlocProvider(create: (_) => getIt<LoginCubit>()),
          ],
          child: const LoginView(),
        );
      } else {
        return const BottomNav(senderId: 0);
      }
    } else {
      return Scaffold(
        body: Center(
          child: SingleChildScrollView(
            child: Column(
              children: [
                Gaps.vGap100,
                if (localPath != null && File(localPath).existsSync())
                  Image.file(
                    File(localPath),
                    width: 350,
                    height: 200,
                    fit: BoxFit.fill,
                  )
                else
                  const Text("لا يوجد صورة محفوظة"),
                Gaps.vGap50,
                ErrorText(
                  width: MediaQuery.of(context).size.width,
                  text: 'No internet connection!',
                  isNetwork: true,
                  image: "assets/images/network_error.png",
                ),
              ],
            ),
          ),
        ),
      );
    }
  }
}

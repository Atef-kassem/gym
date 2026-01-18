import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:swat_gym/features/auth/login/domain/entities/employee_entity.dart';
import 'package:hive_flutter/adapters.dart';
import 'package:swat_gym/features/new_bsama_add_Fingerprint/domain/entities/new_finger_print_entity.dart';
import 'package:swat_gym/core/utils/simple_bloc_observer.dart';

import 'app.dart';
import 'core/utils/constants.dart';
import 'core/utils/functions/setup_service_locator.dart' as di;

void main() async {
  try {
    // Initialize Flutter binding first
    WidgetsFlutterBinding.ensureInitialized();
    
    // Initialize Hive
    await Hive.initFlutter();
    
    // Box used by network interceptors to cache auth token
    if (!Hive.isBoxOpen('auth')) {
      await Hive.openBox('auth');
    }
    
    // Initialize dependency injection
    await di.init();
    
    // Register Hive adapters
    Hive.registerAdapter(EmployeeEntityAdapter());
    Hive.registerAdapter(NewFingerPrintEntityAdapter());

    // Open Hive boxes - التحقق من حالة الـ box قبل الفتح
    if (!Hive.isBoxOpen(kEmployeeDataBox)) {
      await Hive.openBox<EmployeeEntity>(kEmployeeDataBox);
    }
    if (!Hive.isBoxOpen(kNewFingerPrintDataBox)) {
      await Hive.openBox<NewFingerPrintEntity>(kNewFingerPrintDataBox);
    }
    if (!Hive.isBoxOpen('local_storage')) {
      await Hive.openBox('local_storage');
    }
    if (!Hive.isBoxOpen(kLogoutOptionDataBox)) {
      await Hive.openBox<int>(kLogoutOptionDataBox);
    }

    // Set up Bloc observer
    Bloc.observer = SimpleBlocObserver();

    // Run the app
    runApp(const FingerPrint());
  } catch (e, stackTrace) {
    // Log error and show error screen instead of crashing
    debugPrint('Error initializing app: $e');
    debugPrint('Stack trace: $stackTrace');
    
    // Run app with error handler
    runApp(
      MaterialApp(
        home: Scaffold(
          body: Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(Icons.error_outline, size: 64, color: Colors.red),
                const SizedBox(height: 16),
                const Text(
                  'خطأ في بدء التطبيق',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 8),
                Text(
                  'Error: $e',
                  textAlign: TextAlign.center,
                  style: const TextStyle(fontSize: 12),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

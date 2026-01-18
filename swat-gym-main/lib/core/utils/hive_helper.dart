import 'package:hive/hive.dart';
import 'package:swat_gym/features/auth/login/domain/entities/employee_entity.dart';
import 'package:swat_gym/core/utils/constants.dart';

/// Helper class for safe Hive box access
/// يمنع أخطاء "box already open" من خلال التحقق من حالة الـ box قبل الوصول إليه
class HiveHelper {
  /// Get employee data box safely
  /// يحصل على employee_data_box بشكل آمن
  static Box<EmployeeEntity>? getEmployeeBox() {
    try {
      if (Hive.isBoxOpen(kEmployeeDataBox)) {
        return Hive.box<EmployeeEntity>(kEmployeeDataBox);
      }
      return null;
    } catch (e) {
      // إذا حدث خطأ، حاول الوصول مرة أخرى
      try {
        return Hive.box<EmployeeEntity>(kEmployeeDataBox);
      } catch (_) {
        return null;
      }
    }
  }

  /// Get any Hive box safely by name
  /// يحصل على أي Hive box بشكل آمن باستخدام الاسم
  static Box<T>? getBox<T>(String boxName) {
    try {
      if (Hive.isBoxOpen(boxName)) {
        return Hive.box<T>(boxName);
      }
      return null;
    } catch (e) {
      // إذا حدث خطأ، حاول الوصول مرة أخرى
      try {
        return Hive.box<T>(boxName);
      } catch (_) {
        return null;
      }
    }
  }

  /// Open a box safely (checks if already open)
  /// يفتح box بشكل آمن (يتحقق من أنه غير مفتوح بالفعل)
  static Future<Box<T>?> openBoxSafely<T>(String boxName) async {
    try {
      if (Hive.isBoxOpen(boxName)) {
        return Hive.box<T>(boxName);
      }
      return await Hive.openBox<T>(boxName);
    } catch (e) {
      // إذا كان الخطأ "already open"، حاول الوصول إلى الـ box
      if (e.toString().contains('already open')) {
        try {
          return Hive.box<T>(boxName);
        } catch (_) {
          return null;
        }
      }
      return null;
    }
  }
}


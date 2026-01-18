import 'package:flutter/material.dart';

import '../../locale/app_localizations.dart';

mixin ValidationMixin<T extends StatefulWidget> on State<T> {
  String? validateUserPhone(String? phoneNo) {
    if (phoneNo == null || phoneNo.trim().isEmpty) {
      return AppLocalizations.of(context)!
          .translate("Please_enter_phone_number");
    }

    // تنظيف رقم الهاتف للتحقق من الطول
    String cleanPhone = phoneNo.trim().replaceAll(RegExp(r'[\s\-\(\)\+]'), '');
    
    // إزالة البادئة 0 أو +20 أو 20 إذا كانت موجودة
    if (cleanPhone.startsWith('+20')) {
      cleanPhone = cleanPhone.substring(3);
    } else if (cleanPhone.startsWith('20') && cleanPhone.length > 10) {
      cleanPhone = cleanPhone.substring(2);
    }
    
    // التحقق من أن رقم الهاتف يحتوي على أرقام فقط
    if (!RegExp(r'^[0-9]+$').hasMatch(cleanPhone)) {
      return AppLocalizations.of(context)!
          .translate("enter_valid_phone");
    }
    
    // التحقق من الطول (10 أو 11 رقم)
    if (cleanPhone.length < 10 || cleanPhone.length > 11) {
      return AppLocalizations.of(context)!
          .translate("enter_valid_phone");
    }

    return null;
  }

  String? validateInputText(String? inputText) {
    if (inputText == null || inputText.trim().isEmpty) {
      return AppLocalizations.of(context)!.translate("enter_valid_data");
    }
    return null;
  }

  String? validateNewPassword(String? passWord) {
    newPassWord = passWord;

    if (passWord == null || passWord.trim().isEmpty) {
      return AppLocalizations.of(context)!.translate("new_password_validation");
    } else if (passWord.length < 6) {
      return AppLocalizations.of(context)!
          .translate("Please_enter_length_password");
    }
    return null;
  }

  String? newPassWord;
  String? confirmNewPassWord;

  String? validateConfirmPassword(String? passWord) {
    confirmNewPassWord = passWord;

    if (passWord == null || passWord.trim().isEmpty) {
      return AppLocalizations.of(context)!
          .translate("confirm_new_password_validation");
    } else if (passWord.length < 6) {
      return AppLocalizations.of(context)!
          .translate("Please_enter_length_password");
    } else if (newPassWord != confirmNewPassWord) {
      return AppLocalizations.of(context)!.translate("Password_not_identical");
    }
    return null;
  }

  String? validateCurrentPassword(String? passWord) {
    if (passWord == null || passWord.trim().isEmpty) {
      return AppLocalizations.of(context)!
          .translate("current_password_validation");
    }
    return null;
  }

  String? validateNameText(String? inputText) {
    if (inputText == null || inputText.trim().isEmpty) {
      return AppLocalizations.of(context)!.translate("enter_valid_name");
    }
    return null;
  }

  String? validateAddress(String? inputText) {
    if (inputText == null || inputText.trim().isEmpty) {
      return AppLocalizations.of(context)!.translate("enter_valid_address");
    }
    return null;
  }

  String? validateEmail(String? email) {
    if (email!.trim().isEmpty) {
      return AppLocalizations.of(context)!.translate("email_validation");
    } else if (!RegExp(
            r"[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")
        .hasMatch(email)) {
      return AppLocalizations.of(context)!.translate("enter_valid_email");
    }
    return null;
  }

  String? validatePassWord(String? password) {
    if (password == null || password.trim().isEmpty) {
      return AppLocalizations.of(context)!.translate("password_validation");
    } else if (password.length < 6) {
      return AppLocalizations.of(context)!
          .translate("Please_enter_length_password");
    }
    return null;
  }

  String? validatePhoneNumber(String? phoneNumber) {
    if (phoneNumber!.isEmpty) {
      return AppLocalizations.of(context)!
          .translate("Please_enter_phone_number");
    } else if (phoneNumber.length != 11) {
      return AppLocalizations.of(context)!.translate("enter_valid_phone");
    }
    return null;
  }

  // String? validateConfirmPassWord(String? passWord) {
  //   if (passWord!.isEmpty) {
  //     return S.of(context).Please_enter_confirm_password;
  //   } else if (passWord.length < 8) {
  //     return S.of(context).Password_must_be_at_least_8_characters;
  //   }
  //   return null;
  // }
}

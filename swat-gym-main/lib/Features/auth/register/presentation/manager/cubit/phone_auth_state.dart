import 'package:firebase_auth/firebase_auth.dart';
import 'package:meta/meta.dart';

@immutable
abstract class PhoneAuthState {}

class PhoneAuthInitial extends PhoneAuthState {}

class PhoneAuthLoading extends PhoneAuthState {}

class PhoneAuthSubmitted extends PhoneAuthState {}

class PhoneAuthVerified extends PhoneAuthState {
  final User? user;

  PhoneAuthVerified({this.user});
}

class PhoneAuthFailed extends PhoneAuthState {
  final String failMessage;

  PhoneAuthFailed({required this.failMessage});
}

class PhoneAuthTimeOut extends PhoneAuthState {}

import 'dart:convert';

import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';

import '/core/utils/log_utils.dart';

class FCMSettings {
  final BuildContext context;
  FCMSettings({required this.context});

  final FirebaseMessaging firebaseMessaging = FirebaseMessaging.instance;
  final FlutterLocalNotificationsPlugin localNotificationsPlugin =
      FlutterLocalNotificationsPlugin();

  void initialize() {
    Log.d('-------------configLocalNotification----------');
    const InitializationSettings initializationSettings =
        InitializationSettings(
      android: AndroidInitializationSettings('@mipmap/ic_launcher'),
    );
    localNotificationsPlugin.initialize(
      initializationSettings,
      onDidReceiveNotificationResponse:
          (NotificationResponse notificationResponse) {
        debugPrint("------notificationResponse--------");

        onSelect(notificationResponse.payload.toString(), context);
      },
    );
  }

  void createNotification(RemoteMessage message) {
    try {
      final id = DateTime.now().millisecondsSinceEpoch ~/ 1000;
      const NotificationDetails notificationDetails = NotificationDetails(
        android: AndroidNotificationDetails(
          "com.alatheer.hrms",
          'Hr Ms',
          channelDescription: 'Hr  description',
          playSound: true,
          enableVibration: true,
          importance: Importance.max,
          priority: Priority.high,
        ),
      );
      localNotificationsPlugin.show(
        id,
        message.notification!.title,
        message.notification!.body,
        notificationDetails,
        payload: json.encode(message.data),
      );
    } on Exception catch (e) {
      Log.e("createNotification:- ${e.toString()}");
    }
  }

  void registerNotification() {
    debugPrint('-------------registerNotification----------');
    FirebaseMessaging.instance.requestPermission(
      alert: true,
      announcement: false,
      badge: true,
      carPlay: false,
      criticalAlert: false,
      provisional: false,
      sound: true,
    );
    FirebaseMessaging.instance
        .getInitialMessage()
        .then((RemoteMessage? message) {
      if (message != null) {
        debugPrint('getInitialMessage');
        debugPrint(message.toString());
        // showNotification(message);
      }
    });
    FirebaseMessaging.onMessage.listen((RemoteMessage message) {
      debugPrint('Got a message whilst in the foreground!');
      debugPrint('Message data: $message');
      debugPrint('Message data: ${message.data}');
      debugPrint('Message notification: ${message.notification?.body}');
      // showNotification(message);
      createNotification(message);
    });
    FirebaseMessaging.onMessageOpenedApp.listen((RemoteMessage event) async {
      debugPrint('Got a event whilst in the foreground!');
      debugPrint('event data: $event');
      debugPrint('event data: ${event.data}');
      debugPrint('event notification: ${event.notification?.body ?? 'body'}');
      onSelect(json.encode(event.data), context);
    });
  }

  void onDidReceiveLocalNotification(
      int? id, String? title, String? body, String? payload) async {
    // display a dialog with the notification details, tap ok to go to another page
    debugPrint('onDidReceiveLocalNotification');
    debugPrint('Notification data');
    debugPrint(id.toString());
    debugPrint(title);
    debugPrint(body);
    debugPrint(payload);
    showDialog(
      context: context,
      builder: (BuildContext context) => CupertinoAlertDialog(
        title: Text(title ?? ''),
        content: Text(body ?? ''),
        actions: [
          CupertinoDialogAction(
            isDefaultAction: true,
            child: const Text('Ok'),
            onPressed: () async {
              Navigator.of(context, rootNavigator: true).pop();
              debugPrint('Navigator - onDidReceiveLocalNotification');
              Navigator.of(context, rootNavigator: true).pop();
              // await Navigator.pushNamed(context, Routes.notificationsViewRoute);
            },
          )
        ],
      ),
    );
  }

  void onSelect(String? payload, BuildContext context) async {
    if (payload != null) {
      Log.d('notification payload: $payload');
      Map<String, dynamic> payloadDecode = json.decode(payload);

      var type = payloadDecode['type'];

      switch (type) {
        case "chat":
          try {
            // await Navigator.pushNamed(context, Routes.chatScreenRoute);
          } catch (e) {
            debugPrint("store${e.toString()}");
          }
          break;

        case "trip":
          // String tripId = payloadDecode['trip_id'].toString();
          int status = int.parse(payloadDecode['status'].toString());
          try {
            if (status == 2 || status == 1) {
              // Navigator.pushNamed(
              //   context,
              //   Routes.congTripScreenRoute,
              //   arguments: tripId,
              // );
            } else if (status == 3) {
              // Navigator.pushNamed(
              //   context,
              //   Routes.timeCounterScreenRoute,
              //   arguments: tripId,
              // );
            } else if (status == 4) {
              // Navigator.pushNamed(
              //   context,
              //   Routes.endedTripScreenRoute,
              //   arguments: Trip(id: tripId.strToInt(), status: status),
              // );
            }
          } catch (e) {
            debugPrint(e.toString());
          }

          break;
        default:
        // Navigator.pushReplacementNamed(context, Routes.homeScreenRoute);
      }
    }
  }
}

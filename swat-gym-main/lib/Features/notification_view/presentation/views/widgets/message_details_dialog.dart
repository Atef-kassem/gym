import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:swat_gym/core/utils/constants.dart';
import 'package:swat_gym/core/utils/network/api/network_api.dart';
import 'package:swat_gym/Features/notification_view/data/models/my_messages_model/datum.dart';
import 'package:swat_gym/Features/notification_view/presentation/manager/my_messages_cubit.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class MessageDetailsDialog extends StatelessWidget {
  final Datum message;
  final MyMessagesCubit? cubit;

  const MessageDetailsDialog({
    super.key,
    required this.message,
    this.cubit,
  });

  @override
  Widget build(BuildContext context) {
    // بناء URL الصورة
    String? imageUrl;
    if (message.fromEmpImg != null && message.fromEmpImg!.isNotEmpty) {
      imageUrl = message.fromEmpImg!.startsWith('http')
          ? message.fromEmpImg
          : "${NewApi.imageBaseUrl}${message.fromEmpImg}";
    } else if (message.file != null && message.file.toString().isNotEmpty) {
      final fileUrl = message.file.toString();
      if (fileUrl.startsWith('http://') || fileUrl.startsWith('https://')) {
        imageUrl = fileUrl;
      } else if (fileUrl.startsWith('/Uploads')) {
        final baseUrl = NewApi.imageBaseUrl.replaceAll('/Uploads', '');
        imageUrl = "$baseUrl$fileUrl";
      } else if (fileUrl.startsWith('Uploads')) {
        imageUrl = "${NewApi.imageBaseUrl}/$fileUrl";
      } else {
        imageUrl = "${NewApi.imageBaseUrl}/$fileUrl";
      }
    }

    return Dialog(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16.0),
      ),
      child: Container(
        constraints: BoxConstraints(
          maxHeight: MediaQuery.of(context).size.height * 0.8,
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Header
            Container(
              padding: const EdgeInsets.all(16.0),
              decoration: BoxDecoration(
                color: kPrimaryColor.withOpacity(0.1),
                borderRadius: const BorderRadius.only(
                  topLeft: Radius.circular(16.0),
                  topRight: Radius.circular(16.0),
                ),
              ),
              child: Row(
                children: [
                  Expanded(
                    child: Text(
                      message.subject ?? "إشعار",
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close),
                    onPressed: () => Navigator.of(context).pop(),
                  ),
                ],
              ),
            ),
            // Content
            Flexible(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Date and Time
                    if (message.msgDate != null || message.msgTime != null)
                      Padding(
                        padding: const EdgeInsets.only(bottom: 16.0),
                        child: Row(
                          children: [
                            if (message.msgDate != null)
                              Text(
                                message.msgDate!,
                                style: TextStyle(
                                  fontSize: 12,
                                  color: Colors.grey[600],
                                ),
                              ),
                            if (message.msgDate != null &&
                                message.msgTime != null)
                              const Text(" - "),
                            if (message.msgTime != null)
                              Text(
                                message.msgTime!,
                                style: TextStyle(
                                  fontSize: 12,
                                  color: Colors.grey[600],
                                ),
                              ),
                          ],
                        ),
                      ),
                    // Image
                    if (imageUrl != null && imageUrl.isNotEmpty)
                      Padding(
                        padding: const EdgeInsets.only(bottom: 16.0),
                        child: ClipRRect(
                          borderRadius: BorderRadius.circular(12.0),
                          child: CachedNetworkImage(
                            imageUrl: imageUrl,
                            width: double.infinity,
                            fit: BoxFit.cover,
                            placeholder: (context, url) => Container(
                              height: 200,
                              color: Colors.grey[200],
                              child: const Center(
                                child: CircularProgressIndicator(),
                              ),
                            ),
                            errorWidget: (context, url, error) => Container(
                              height: 200,
                              color: Colors.grey[200],
                              child: Icon(
                                Icons.error_outline,
                                color: Colors.grey[400],
                                size: 40,
                              ),
                            ),
                          ),
                        ),
                      ),
                    // Message Content
                    Text(
                      message.message ?? "",
                      style: const TextStyle(
                        fontSize: 16,
                        height: 1.5,
                      ),
                    ),
                  ],
                ),
              ),
            ),
            // Actions
            Container(
              padding: const EdgeInsets.all(16.0),
              decoration: BoxDecoration(
                border: Border(
                  top: BorderSide(color: Colors.grey[300]!),
                ),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  TextButton(
                    onPressed: () {
                      Navigator.of(context).pop();
                      // حذف الإشعار بعد إغلاق الـ dialog
                      if (cubit != null) {
                        cubit!.deleteMessage(message.msgId.toString());
                      } else {
                        // محاولة الوصول عبر context إذا لم يتم تمرير cubit
                        try {
                          context
                              .read<MyMessagesCubit>()
                              .deleteMessage(message.msgId.toString());
                        } catch (e) {
                          // إذا فشل، لا نفعل شيئاً
                        }
                      }
                    },
                    child: const Text(
                      "حذف",
                      style: TextStyle(color: Colors.red),
                    ),
                  ),
                  const SizedBox(width: 8),
                  ElevatedButton(
                    onPressed: () {
                      Navigator.of(context).pop();
                      // تمييز الإشعار كمقروء
                      if (cubit != null) {
                        cubit!.markAsRead(message.msgId.toString());
                      } else {
                        // محاولة الوصول عبر context إذا لم يتم تمرير cubit
                        try {
                          context
                              .read<MyMessagesCubit>()
                              .markAsRead(message.msgId.toString());
                        } catch (e) {
                          // إذا فشل، لا نفعل شيئاً
                        }
                      }
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: kPrimaryColor,
                    ),
                    child: const Text("تم"),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}


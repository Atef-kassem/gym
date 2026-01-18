import 'package:animate_do/animate_do.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../../../../core/utils/constants.dart';
import '../../../../../../core/utils/network/api/network_api.dart';
import '../../../data/models/my_messages_model/datum.dart';
import '../../manager/my_messages_cubit.dart';
import 'message_details_dialog.dart';

class AllMessagesListItem extends StatelessWidget {
  const AllMessagesListItem({
    super.key,
    required this.messagesList,
    required this.itemIndex,
  });
  final AllMessagesList messagesList;
  final int itemIndex;
  @override
  Widget build(BuildContext context) {
    if (messagesList == null || itemIndex >= messagesList!.length) {
      return const SizedBox.shrink();
    }
    
    final message = messagesList![itemIndex];
    final isUnread = message.seen == 0 || message.seen.toString() == "0";
    final msgDate = message.msgDate ?? "";
    final msgTime = message.msgTime ?? "";
    
    // بناء URL الصورة بشكل صحيح
    String? imageUrl;
    if (message.fromEmpImg != null && message.fromEmpImg!.isNotEmpty) {
      imageUrl = message.fromEmpImg!.startsWith('http')
          ? message.fromEmpImg
          : "${NewApi.imageBaseUrl}${message.fromEmpImg}";
    } else if (message.file != null && message.file.toString().isNotEmpty) {
      final fileUrl = message.file.toString();
      // بناء URL الصورة بشكل صحيح
      if (fileUrl.startsWith('http://') || fileUrl.startsWith('https://')) {
        // إذا كان URL كامل، استخدمه مباشرة
        imageUrl = fileUrl;
      } else if (fileUrl.startsWith('/Uploads')) {
        // إذا كان يبدأ بـ /Uploads، أضف mainAppUrl
        // استخدام imageBaseUrl وإزالة /Uploads منه ثم إضافة fileUrl
        final baseUrl = NewApi.imageBaseUrl.replaceAll('/Uploads', '');
        imageUrl = "$baseUrl$fileUrl";
      } else if (fileUrl.startsWith('Uploads')) {
        // إذا كان يبدأ بـ Uploads بدون /، أضف / و mainAppUrl
        imageUrl = "${NewApi.imageBaseUrl}/$fileUrl";
      } else {
        // إذا كان مسار نسبي، أضف imageBaseUrl
        imageUrl = "${NewApi.imageBaseUrl}/$fileUrl";
      }
      print('📷 Image URL built: $imageUrl (from file: $fileUrl)');
    }

    return Column(
      children: [
        FadeInLeft(
          child: Padding(
            padding: const EdgeInsets.symmetric(vertical: 2.0),
            child: Card(
              shadowColor: Colors.black,
              shape: isUnread
                  ? RoundedRectangleBorder(
                      side: const BorderSide(
                        color:
                            Color.fromARGB(255, 146, 146, 146), //<-- SEE HERE
                      ),
                      borderRadius: BorderRadius.circular(10.0),
                    )
                  : null,
              color: isUnread
                  ? const Color.fromARGB(255, 245, 241, 241)
                  : Colors.white,
              child: InkWell(
                onTap: () {
                  // عرض dialog مع المحتوى الكامل عند الضغط على الإشعار
                  final cubit = context.read<MyMessagesCubit>();
                  showDialog(
                    context: context,
                    builder: (context) => MessageDetailsDialog(
                      message: message,
                      cubit: cubit,
                    ),
                  );
                },
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    ListTile(
                      contentPadding: const EdgeInsets.symmetric(
                        horizontal: 16.0,
                        vertical: 8.0,
                      ),
                      subtitle: Text(
                        message.message?.toString() ?? "",
                        overflow: TextOverflow.ellipsis,
                        maxLines: 2,
                        style: const TextStyle(fontSize: 12),
                      ),
                      title: Text(
                        message.subject?.toString() ?? "",
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    trailing: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        if (msgDate.isNotEmpty)
                          Text(
                            msgDate,
                            style: const TextStyle(fontSize: 12),
                          ),
                        if (msgTime.isNotEmpty)
                          Text(
                            msgTime,
                            style: const TextStyle(fontSize: 10),
                          ),
                      ],
                    ),
                    leading: imageUrl != null && imageUrl.isNotEmpty
                        ? CircleAvatar(
                            radius: 25,
                            backgroundColor: kPrimaryColor.withOpacity(.4),
                            backgroundImage: CachedNetworkImageProvider(imageUrl),
                            onBackgroundImageError: (exception, stackTrace) {},
                            child: null,
                          )
                        : CircleAvatar(
                            radius: 25,
                            backgroundColor: kPrimaryColor.withOpacity(.4),
                            child: Icon(
                              Icons.notifications,
                              color: kPrimaryColor,
                            ),
                          ),
                  ),
                  // عرض الصورة إذا كانت موجودة
                  if (imageUrl != null && imageUrl.isNotEmpty)
                    Padding(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 16.0,
                        vertical: 8.0,
                      ),
                      child: GestureDetector(
                        onTap: () {
                          // عرض dialog مع المحتوى الكامل عند الضغط على الصورة
                          final cubit = context.read<MyMessagesCubit>();
                          showDialog(
                            context: context,
                            builder: (context) => MessageDetailsDialog(
                              message: message,
                              cubit: cubit,
                            ),
                          );
                        },
                        child: ClipRRect(
                          borderRadius: BorderRadius.circular(8.0),
                          child: CachedNetworkImage(
                            imageUrl: imageUrl,
                            width: double.infinity,
                            height: 200,
                            fit: BoxFit.cover,
                            placeholder: (context, url) => Container(
                              width: double.infinity,
                              height: 200,
                              color: Colors.grey[200],
                              child: const Center(
                                child: CircularProgressIndicator(),
                              ),
                            ),
                            errorWidget: (context, url, error) => Container(
                              width: double.infinity,
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
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }
}

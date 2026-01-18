import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:swat_gym/core/widgets/empty_widget.dart';
import 'package:swat_gym/Features/notification_view/data/models/my_messages_model/datum.dart';
import 'package:swat_gym/Features/notification_view/presentation/manager/my_messages_cubit.dart';
import 'package:swat_gym/Features/notification_view/presentation/views/widgets/all_messages_list_item.dart';
import 'package:hive/hive.dart';

import '../../../../../core/locale/app_localizations.dart';
import '../../../../../core/utils/constants.dart';
import '../../../../../core/utils/hive_helper.dart';
import '../../../../../core/utils/media_query_sizes.dart';
import '../../../../../core/widgets/custom_loading_widget.dart';
import '../../../../../core/widgets/error_text.dart';
import 'package:swat_gym/features/auth/login/domain/entities/employee_entity.dart';
import '../../../../bottom_nav/presentation/manger/cubit/bottom_nav_cubit.dart';

class NotificationViewBody extends StatefulWidget {
  const NotificationViewBody({super.key});

  @override
  State<NotificationViewBody> createState() => _NotificationViewBodyState();
}

class _NotificationViewBodyState extends State<NotificationViewBody> {
  // استخدام نفس الطريقة التي تستخدم في أماكن أخرى في المشروع
  // استخدام var box مباشرة مثل ما يفعلون في exercises_view_body.dart و profile_screen_body.dart
  // لكن مع try-catch للتعامل مع أي خطأ محتمل
  Box<EmployeeEntity>? _box;
  
  @override
  void initState() {
    super.initState();
    // تهيئة الـ box مرة واحدة فقط في initState
    _initializeBox();
    
    // استخدام addPostFrameCallback لضمان أن context جاهز
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted) {
        getNotSeenMessages(context);
      }
    });
  }
  
  void _initializeBox() {
    // استخدام الـ helper function الآمنة
    _box = HiveHelper.getEmployeeBox();
  }

  @override
  Widget build(BuildContext context) {
    late AppLocalizations locale;
    locale = AppLocalizations.of(context)!;
    SizeConfig().init(context);

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20.0),
      child: SingleChildScrollView(
        child: Column(
          children: [
            // CustomAppBar(
            //   icon: const Icon(Icons.arrow_forward),
            //   function: () {
            //     Navigator.pop(context);
            //   },
            // ),

            BlocBuilder<MyMessagesCubit, MyMessagesState>(
              builder: (context, state) {
                if (state is FetchSuccessful) {
                  AllMessagesList messagesList = state.data!;

                  return Column(
                    children: [
                      // Gaps.vGap30,
                      RefreshIndicator(
                        onRefresh: () async {
                          return getNotSeenMessages(context);
                        },
                        child: ListView.builder(
                          shrinkWrap: true,
                          physics: const BouncingScrollPhysics(),
                          itemCount: state.data!.length,
                          itemBuilder: (context, index) {
                            return InkWell(
                              onTap: () {
                                // حفظ messageId للاستخدام لاحقًا
                                BlocProvider.of<BottomNavCubit>(context)
                                    .getMessageId(
                                        state.data![index].msgId.toString());
                                
                                // يمكن إضافة navigation إلى صفحة التفاصيل هنا لاحقًا
                                // Navigator.push(...) أو استخدام bottomNavScreens
                                
                                // لا نغير bottomNavIndex لأن kMessagesDetailsView (23) غير موجود في bottomNavScreens
                                // يمكن إضافة screen للتفاصيل في bottomNavScreens لاحقًا إذا لزم الأمر
                              },
                              child: AllMessagesListItem(
                                messagesList: messagesList,
                                itemIndex: index,
                              ),
                            );
                          },
                        ),
                      ),
                    ],
                  );
                } else if (state is FetchLoading) {
                  return const Center(
                    child: CustomLoadingWidget(
                      loadingText: "جاري تحميل الرسائل",
                    ),
                  );
                } else if (state is FetchFailed) {
                  return EmptyWidget(
                    text: state.message,
                  );
                } else {
                  // التحقق من أن الـ box متاح وأنه يحتوي على بيانات المستخدم
                  if (_box == null) {
                    return ErrorText(
                        image: "assets/images/should_login.png",
                        text: AppLocalizations.of(context)!
                            .translate('you_should_login_first')!);
                  }
                  
                  final employeeData = _box!.get(kEmployeeDataBox);
                  if (employeeData == null) {
                    return ErrorText(
                        image: "assets/images/should_login.png",
                        text: AppLocalizations.of(context)!
                            .translate('you_should_login_first')!);
                  } else {
                    return const ErrorText(text: "حدث خطأ ما");
                  }
                }
              },
            )
          ],
        ),
      ),
    );
  }

  Future<void> getNotSeenMessages(BuildContext context) async {
    // التحقق من أن widget لا يزال mounted
    if (!mounted) return;
    
    // إعادة تهيئة الـ box إذا كان null
    if (_box == null) {
      _initializeBox();
    }
    
    // استخدام الـ box
    if (_box != null) {
      final employeeData = _box!.get(kEmployeeDataBox);
      if (employeeData != null && employeeData.memId != null) {
        await BlocProvider.of<MyMessagesCubit>(context)
            .getAllMessages(employeeData.memId.toString(), "0");
      }
    }
  }
}

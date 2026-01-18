import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../../../core/utils/constants.dart';
import '../../../../core/utils/gaps.dart';
import '../../../../core/utils/media_query_sizes.dart';
import '../../../../core/widgets/custom_error_widget.dart';
import '../../../../core/widgets/custom_loading_widget.dart';
import '../manager/cubit/about_app_cubit.dart';

class AboutAppViewBody extends StatelessWidget {
  const AboutAppViewBody({super.key});

  @override
  Widget build(BuildContext context) {
    BlocProvider.of<AboutAppCubit>(context).getAboutAppData();
    SizeConfig().init(context);
    return BlocBuilder<AboutAppCubit, AboutAppState>(
      builder: (context, state) {
        if (state is AboutAppSuccessful) {
          if (state.data == null || state.data!.isEmpty) {
            return const CustomErrorWidget();
          }
          final appData = state.data![0];
          return SingleChildScrollView(
            padding: EdgeInsets.symmetric(horizontal: 16.w, vertical: 20.h),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // App Name
                if (appData.appName != null && appData.appName!.isNotEmpty)
                  _buildSection(
                    context,
                    title: 'اسم التطبيق',
                    content: appData.appName!
                        .replaceAll( 'Meta Codecx', 'Meta Codecx')
                        .replaceAll( 'سوات جيم', 'سوات جيم'),
                    isTitle: true,
                  ),
                Gaps.vGap20,
                
                // App Version
                if (appData.appVersion != null && appData.appVersion!.isNotEmpty)
                  _buildSection(
                    context,
                    title: 'إصدار التطبيق',
                    content: appData.appVersion!,
                  ),
                Gaps.vGap20,
                
                // Description
                if (appData.description != null && appData.description!.isNotEmpty)
                  _buildSection(
                    context,
                    title: 'الوصف',
                    content: appData.description!,
                  ),
                Gaps.vGap20,
                
                // Features
                if (appData.features != null && appData.features!.isNotEmpty)
                  _buildSection(
                    context,
                    title: 'المميزات',
                    content: appData.features!,
                  ),
                Gaps.vGap20,
                
                // Contact Email
                if (appData.contactEmail != null && appData.contactEmail!.isNotEmpty)
                  _buildClickableSection(
                    context,
                    title: 'البريد الإلكتروني',
                    content: appData.contactEmail!,
                    onTap: () => _launchEmail(appData.contactEmail!),
                  ),
                Gaps.vGap20,
                
                // Contact Phone
                if (appData.contactPhone != null && appData.contactPhone!.isNotEmpty)
                  _buildClickableSection(
                    context,
                    title: 'رقم الهاتف',
                    content: appData.contactPhone!,
                    onTap: () => _launchPhone(appData.contactPhone!),
                  ),
                Gaps.vGap20,
                
                // Website
                if (appData.website != null && appData.website!.isNotEmpty)
                  _buildClickableSection(
                    context,
                    title: 'الموقع الإلكتروني',
                    content: appData.website!,
                    onTap: () => _launchUrl(appData.website!),
                  ),
                Gaps.vGap20,
                
                // Privacy Policy
                if (appData.privacyPolicy != null && appData.privacyPolicy!.isNotEmpty)
                  _buildSection(
                    context,
                    title: 'سياسة الخصوصية',
                    content: appData.privacyPolicy!,
                  ),
                Gaps.vGap20,
                
                // Terms of Service
                if (appData.termsOfService != null && appData.termsOfService!.isNotEmpty)
                  _buildSection(
                    context,
                    title: 'شروط الخدمة',
                    content: appData.termsOfService!,
                  ),
                Gaps.vGap20,
                
                // Old format: aboutApp (for backward compatibility)
                if ((appData.description == null || appData.description!.isEmpty) &&
                    (appData.aboutApp != null && appData.aboutApp!.isNotEmpty))
                  _buildSection(
                    context,
                    title: 'عن التطبيق',
                    content: appData.aboutApp!
                        .replaceAll( 'Meta Codecx', 'Meta Codecx')
                        .replaceAll( 'سوات جيم', 'سوات جيم'),
                  ),
              ],
            ),
          );
        } else if (state is AboutAppLoading) {
          return const CustomLoadingWidget();
        } else {
          return const CustomErrorWidget();
        }
      },
    );
  }

  Widget _buildSection(BuildContext context, {required String title, required String content, bool isTitle = false}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: TextStyle(
            fontSize: isTitle ? 24.sp : 18.sp,
            fontWeight: FontWeight.bold,
            color: kPrimaryColor,
          ),
          textDirection: TextDirection.rtl,
        ),
        Gaps.vGap10,
        Container(
          width: double.infinity,
          padding: EdgeInsets.all(16.w),
          decoration: BoxDecoration(
            color: const Color(0xfff6f6f6),
            borderRadius: BorderRadius.circular(12.r),
            border: Border.all(color: Colors.grey.shade200),
          ),
          child: Text(
            content,
            style: TextStyle(
              fontSize: isTitle ? 20.sp : 16.sp,
              color: kTextColor,
              height: 1.5,
            ),
            textDirection: TextDirection.rtl,
            textAlign: TextAlign.right,
          ),
        ),
      ],
    );
  }

  Widget _buildClickableSection(BuildContext context, {required String title, required String content, required VoidCallback onTap}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: TextStyle(
            fontSize: 18.sp,
            fontWeight: FontWeight.bold,
            color: kPrimaryColor,
          ),
          textDirection: TextDirection.rtl,
        ),
        Gaps.vGap10,
        InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(12.r),
          child: Container(
            width: double.infinity,
            padding: EdgeInsets.all(16.w),
            decoration: BoxDecoration(
              color: const Color(0xfff6f6f6),
              borderRadius: BorderRadius.circular(12.r),
              border: Border.all(color: kPrimaryColor.withOpacity(0.3)),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Icon(Icons.open_in_new, color: kPrimaryColor, size: 20.sp),
                Expanded(
                  child: Text(
                    content,
                    style: TextStyle(
                      fontSize: 16.sp,
                      color: kPrimaryColor,
                      fontWeight: FontWeight.w500,
                    ),
                    textDirection: TextDirection.rtl,
                    textAlign: TextAlign.right,
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Future<void> _launchEmail(String email) async {
    try {
      final Uri emailUri = Uri(
        scheme: 'mailto',
        path: email,
      );
      await launchUrl(emailUri);
    } catch (e) {
      // Handle error silently or show a message
      debugPrint('Error launching email: $e');
    }
  }

  Future<void> _launchPhone(String phone) async {
    try {
      final Uri phoneUri = Uri(
        scheme: 'tel',
        path: phone,
      );
      await launchUrl(phoneUri);
    } catch (e) {
      // Handle error silently or show a message
      debugPrint('Error launching phone: $e');
    }
  }

  Future<void> _launchUrl(String url) async {
    try {
      final Uri uri = Uri.parse(url);
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    } catch (e) {
      // Handle error silently or show a message
      debugPrint('Error launching URL: $e');
    }
  }
}

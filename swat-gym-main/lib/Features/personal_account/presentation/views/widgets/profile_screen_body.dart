import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:hive/hive.dart';
import 'package:barcode_widget/barcode_widget.dart';
import 'package:swat_gym/features/personal_account/presentation/manager/cubit/get_profile_cubit.dart';
import 'package:swat_gym/features/my_subscribtions/presentation/manager/ta3mem_cubit/my_subscribtions_cubit.dart';
import 'package:swat_gym/core/utils/gaps.dart';
import 'package:swat_gym/core/utils/hex_color.dart';
import 'package:swat_gym/core/widgets/custom_cached_network_image.dart';

import '../../../../../core/utils/constants.dart';
import '../../../../../core/utils/network/api/network_api.dart';
import '../../../../auth/login/domain/entities/employee_entity.dart';
import '../../../../../core/utils/functions/setup_service_locator.dart';

class ProfileScreenBody extends StatefulWidget {
  const ProfileScreenBody({super.key});

  @override
  State<ProfileScreenBody> createState() => _ProfileScreenBodyState();
}

class _ProfileScreenBodyState extends State<ProfileScreenBody> {
  var box = Hive.box<EmployeeEntity>(kEmployeeDataBox);

  @override
  void initState() {
    _onInit();
    super.initState();
  }

  void _onInit() async {
    final employee = box.get(kEmployeeDataBox);
    final phone = employee?.phone?.toString();
    if (phone != null && phone.isNotEmpty) {
      // تنظيف رقم الهاتف قبل البحث (مثل ما فعلنا في login)
      String cleanPhone = phone.trim().replaceAll(RegExp(r'[\s\-\(\)\+]'), '');
      print('Profile Screen: Searching for member with phone: $cleanPhone');
      await BlocProvider.of<GetProfileCubit>(context).getProfile(cleanPhone);
    } else {
      print('Profile Screen: No phone number found in employee data');
    }
  }
  
  void _loadSubscriptions(int? memberId) async {
    if (memberId != null) {
      // إنشاء cubit للاشتراكات إذا لم يكن موجوداً
      if (!context.mounted) return;
      try {
        final cubit = BlocProvider.of<MySubscribtionsCubit>(context);
        await cubit.getMySubscribtions(memberId: memberId);
      } catch (e) {
        // إذا لم يكن Cubit موجوداً، أنشئه
        print('MySubscribtionsCubit not found, creating new instance');
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 15),
      child: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        child: BlocBuilder<GetProfileCubit, GetProfileState>(
          builder: (context, state) {
            if (state is getProfileLoading) {
              return const Center(
                child: CircularProgressIndicator(),
              );
            } else if (state is GetProfileSuccessful) {
              if (state.data.data == null) {
                return const Center(
                  child: Text('لا توجد بيانات'),
                );
              }

              final employeeData = state.data.data!;
              String imgPath = employeeData.imgPath ?? employeeData.image ?? '';
              final name = employeeData.name ?? '';
              final mCode = employeeData.mCode ?? '';
              final branchName = employeeData.branchName ?? '';
              final phone = employeeData.phone ?? '';
              final memId = employeeData.memId;
              
              // جلب الاشتراكات بناءً على memberId
              int? memberIdInt;
              if (memId != null) {
                try {
                  memberIdInt = int.parse(memId);
                  _loadSubscriptions(memberIdInt);
                } catch (e) {
                  print('Error parsing memberId: $e');
                }
              }
              
              // بناء URL صورة العضو - إذا كان imgPath نسبي، أضف baseUrl
              if (imgPath.isNotEmpty && !imgPath.startsWith('http')) {
                // إذا كان المسار نسبي، أضف baseUrl
                if (imgPath.startsWith('/')) {
                  imgPath = '${NewApi.mainAppUrl}$imgPath';
                } else {
                  imgPath = '${NewApi.imageBaseUrl}/$imgPath';
                }
                print('📷 Profile Image URL built: $imgPath');
              }
              
              // بناء URL الباركود - إذا كان barcodePath نسبي، أضف baseUrl
              String barcodePath = employeeData.barcodePath ?? '';
              if (barcodePath.isNotEmpty && !barcodePath.startsWith('http')) {
                // إذا كان المسار نسبي، أضف baseUrl
                if (barcodePath.startsWith('/')) {
                  barcodePath = '${NewApi.mainAppUrl}$barcodePath';
                } else {
                  barcodePath = '${NewApi.imageBaseUrl}/$barcodePath';
                }
              }

              return Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Center(
                    child: GestureDetector(
                      onTap: () {
                        Navigator.pushNamed(context, kUpdateProfileScreenRoute);
                      },
                      child: Container(
                        // width: MediaQuery.of(context).size.width * .49,
                        height: MediaQuery.of(context).size.height * .30,
                        alignment: Alignment.center,
                        decoration: BoxDecoration(color: kPrimaryColor),
                        child: Stack(
                          alignment: Alignment.center,
                          children: [
                            Container(
                              //width: MediaQuery.of(context).size.width * .49,
                              height: MediaQuery.of(context).size.height * .006,
                              alignment: Alignment.center,
                              decoration: BoxDecoration(
                                color: HexColor("#ffee2b"),
                              ),
                            ),
                            if (imgPath.isNotEmpty)
                              Container(
                                width: MediaQuery.of(context).size.width * .49,
                                height:
                                    MediaQuery.of(context).size.height * .22,
                                alignment: Alignment.center,
                                decoration: BoxDecoration(
                                    color: HexColor("#ffee2b"),
                                    borderRadius: BorderRadius.circular(100)),
                                child: ClipRRect(
                                    borderRadius: BorderRadius.circular(100.0),
                                    child: CustomCashedNetworkImage(
                                      imageUrl: imgPath,
                                      width: MediaQuery.of(context).size.width *
                                          .48,
                                      height:
                                          MediaQuery.of(context).size.height *
                                              .212,
                                    )),
                              )
                            else
                              Container(
                                width: MediaQuery.of(context).size.width * .49,
                                height:
                                    MediaQuery.of(context).size.height * .22,
                                alignment: Alignment.center,
                                decoration: BoxDecoration(
                                    color: HexColor("#ffee2b"),
                                    borderRadius: BorderRadius.circular(100)),
                                child: Icon(
                                  Icons.person,
                                  size: MediaQuery.of(context).size.width * .3,
                                  color: Colors.grey,
                                ),
                              ),
                          ],
                        ),
                      ),

                      // Container(
                      //     width: MediaQuery.of(context).size.width * .5,
                      //     height: MediaQuery.of(context).size.height * .25,
                      //     alignment: Alignment.center,
                      //     decoration: BoxDecoration(
                      //         color: kPrimaryColor,
                      //         borderRadius: BorderRadius.circular(100)),
                      //     child: CustomCashedNetworkImage(
                      //       imageUrl: box.get(kEmployeeDataBox) != null
                      //           ? box.get(kEmployeeDataBox)!.image!
                      //           : "",
                      //       width: MediaQuery.of(context).size.width * .45,
                      //       height: MediaQuery.of(context).size.height * .2,
                      //     )),
                    ),
                  ),
                  // Row(
                  //   mainAxisAlignment: MainAxisAlignment.end,
                  //   children: [
                  //     CustomCashedNetworkImage(
                  //       width: 100,
                  //       height: 100,
                  //       imageUrl: box.get(kEmployeeDataBox) != null
                  //           ? box
                  //               .get(kEmployeeDataBox)!
                  //               .empSignature!
                  //           : "",
                  //     ),
                  //   ],
                  // ),

                  Gaps.vGap30,
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        "الإسـم  : ${name.isNotEmpty ? name : 'غير محدد'}",
                        style: TextStyle(
                            //    color: Colors.white,
                            fontSize: 13.sp,
                            fontWeight: FontWeight.w900),
                      ),
                      Gaps.vGap10,
                      Text(
                        "الكـود  : ${mCode.isNotEmpty ? mCode : 'غير محدد'}",
                        style: TextStyle(
                            //         color: Colors.white,
                            fontSize: 13.sp,
                            fontWeight: FontWeight.w900),
                      ),
                      Gaps.vGap10,
                      Text(
                        "الفرع : ${branchName.isNotEmpty ? branchName : 'غير محدد'}",
                        style: TextStyle(
                            //    color: Colors.white,
                            fontSize: 13.sp,
                            fontWeight: FontWeight.w900),
                      ),
                      Gaps.vGap10,
                      Text(
                        "الجـوال : ${phone.isNotEmpty ? phone : 'غير محدد'}",
                        style: TextStyle(
                            //    color: Colors.white,
                            fontSize: 13.sp,
                            fontWeight: FontWeight.w900),
                      ),
                    ],
                  ),

                  Gaps.vGap20,
                  
                  // عرض الباركود
                  if (mCode.isNotEmpty || barcodePath.isNotEmpty) ...[
                    Center(
                      child: Column(
                        children: [
                          Text(
                            "الباركود",
                            style: TextStyle(
                              fontSize: 16.sp,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          Gaps.vGap10,
                          Container(
                            padding: const EdgeInsets.all(20),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(12),
                              boxShadow: [
                                BoxShadow(
                                  color: Colors.grey.withOpacity(0.3),
                                  spreadRadius: 2,
                                  blurRadius: 5,
                                  offset: const Offset(0, 3),
                                ),
                              ],
                            ),
                            child: Column(
                              children: [
                                // عرض صورة الباركود من السيرفر إذا كانت موجودة
                                if (barcodePath.isNotEmpty) ...[
                                  ClipRRect(
                                    borderRadius: BorderRadius.circular(8),
                                    child: CustomCashedNetworkImage(
                                      imageUrl: barcodePath,
                                      width: MediaQuery.of(context).size.width * .75,
                                      height: MediaQuery.of(context).size.height * .15,
                                    ),
                                  ),
                                  Gaps.vGap10,
                                ],
                                // عرض الباركود الفعلي من memberCode
                                if (mCode.isNotEmpty) ...[
                                  BarcodeWidget(
                                    barcode: Barcode.code128(), // نوع الباركود Code128
                                    data: mCode, // البيانات (memberCode)
                                    width: MediaQuery.of(context).size.width * .7,
                                    height: MediaQuery.of(context).size.height * .12,
                                    color: Colors.black,
                                    backgroundColor: Colors.white,
                                    padding: const EdgeInsets.all(8),
                                  ),
                                  Gaps.vGap5,
                                  Text(
                                    mCode,
                                    style: TextStyle(
                                      fontSize: 14.sp,
                                      fontWeight: FontWeight.bold,
                                      letterSpacing: 1.5,
                                    ),
                                  ),
                                ],
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                  
                  // عرض الاشتراكات
                  Gaps.vGap20,
                  BlocProvider(
                    create: (context) => getIt<MySubscribtionsCubit>()..getMySubscribtions(memberId: memberIdInt),
                    child: BlocBuilder<MySubscribtionsCubit, MySubscribtionsState>(
                      builder: (context, subState) {
                        if (subState is FetchLoading) {
                          return const Center(
                            child: Padding(
                              padding: EdgeInsets.all(20.0),
                              child: CircularProgressIndicator(),
                            ),
                          );
                        } else if (subState is FetchSuccessful && subState.data != null && subState.data!.isNotEmpty) {
                          return Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Padding(
                                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                                child: Text(
                                  "الاشتراكات",
                                  style: TextStyle(
                                    fontSize: 18.sp,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),
                              ListView.builder(
                                shrinkWrap: true,
                                physics: const NeverScrollableScrollPhysics(),
                                itemCount: subState.data!.length,
                                itemBuilder: (context, index) {
                                  final subscription = subState.data![index];
                                  return Container(
                                    margin: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
                                    padding: const EdgeInsets.all(16),
                                    decoration: BoxDecoration(
                                      color: Colors.white,
                                      borderRadius: BorderRadius.circular(12),
                                      boxShadow: [
                                        BoxShadow(
                                          color: Colors.grey.withOpacity(0.2),
                                          spreadRadius: 1,
                                          blurRadius: 4,
                                          offset: const Offset(0, 2),
                                        ),
                                      ],
                                    ),
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          subscription.subsName ?? 'اشتراك',
                                          style: TextStyle(
                                            fontSize: 16.sp,
                                            fontWeight: FontWeight.bold,
                                          ),
                                        ),
                                        Gaps.vGap5,
                                        if (subscription.fromDateAr != null)
                                          Text(
                                            'من: ${subscription.fromDateAr}',
                                            style: TextStyle(fontSize: 14.sp),
                                          ),
                                        if (subscription.toDateAr != null)
                                          Text(
                                            'إلى: ${subscription.toDateAr}',
                                            style: TextStyle(fontSize: 14.sp),
                                          ),
                                        if (subscription.price != null)
                                          Text(
                                            'السعر: ${subscription.price}',
                                            style: TextStyle(fontSize: 14.sp),
                                          ),
                                      ],
                                    ),
                                  );
                                },
                              ),
                            ],
                          );
                        } else if (subState is FetchFailed) {
                          return Padding(
                            padding: const EdgeInsets.all(20.0),
                            child: Center(
                              child: Text(
                                subState.message ?? 'لا توجد اشتراكات',
                                style: TextStyle(fontSize: 14.sp),
                              ),
                            ),
                          );
                        }
                        return const SizedBox.shrink();
                      },
                    ),
                  ),
                ],
              );
            }

            return const SizedBox();
          },
        ),
      ),
    );
  }
}

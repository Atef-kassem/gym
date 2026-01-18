import 'package:carousel_slider/carousel_slider.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:swat_gym/core/utils/constants.dart';
import 'package:swat_gym/features/app_home/presentation/views/widgets/app_bar_home.dart';
import 'package:swat_gym/features/app_home/presentation/views/widgets/custom_button.dart';
import 'package:swat_gym/features/auth/login/domain/entities/employee_entity.dart';
import 'package:swat_gym/features/bottom_nav/presentation/manger/cubit/bottom_nav_cubit.dart';
import 'package:swat_gym/features/offers/presentation/views/widgets/offers_view_body.dart';
import 'package:swat_gym/core/utils/image_utils.dart';
import 'package:hive/hive.dart';

import '../../../../../core/utils/gaps.dart';
import '../../manger/ads_cubit/ads_cubit.dart';

class HomeViewBody extends StatelessWidget {
  const HomeViewBody({super.key});

  @override
  Widget build(BuildContext context) {
    var box = Hive.box<EmployeeEntity>(kEmployeeDataBox);
    int index = 0;
    return SingleChildScrollView(
      child: Column(
        children: [
          Gaps.vGap5,
          AppBarHome(box: box),
          const SizedBox(
            height: 16,
          ),
          BlocBuilder<AdsCubit, AdsState>(
            builder: (context, state) {
              if (state is FetchAdsLoading) {
                return const Center(
                  child: CircularProgressIndicator(),
                );
              } else if (state is FetchAdsFailed) {
                return const SizedBox();
              } else if (state is FetchAdsSuccessful) {
                // التحقق من أن البيانات موجودة وليست فارغة
                if (state.data == null || state.data!.isEmpty) {
                  return const SizedBox();
                }

                List<String> data = [];

                for (int i = 0; i < state.data!.length; i++) {
                  final ad = state.data![i];
                  final imagePath = ad.imagePath;
                  if (imagePath != null && imagePath.isNotEmpty) {
                    data.add(buildImageUrl(imagePath));
                  }
                }

                // إذا لم تكن هناك صور صالحة، لا نعرض شيء
                if (data.isEmpty) {
                  return const SizedBox();
                }

                return GestureDetector(
                  onTap: () {
                    Navigator.pushNamed(context, kAdsDetailsScreenRoute);

                    // state.data ليس null بعد التحقق في السطر 40
                    if (index < state.data!.length) {
                      BlocProvider.of<BottomNavCubit>(context)
                          .getDetails(state.data![index]);
                    }
                  },
                  child: CarouselSlider(
                    items: data.map((offer) {
                      return Builder(
                        builder: (BuildContext context) {
                          return Container(
                            decoration: BoxDecoration(
                              color: kPrimaryColor,
                              image: DecorationImage(
                                image: NetworkImage(offer),
                                fit: BoxFit.cover,
                              ),
                              borderRadius:
                                  const BorderRadius.all(Radius.circular(20)),
                            ),
                          );
                        },
                      );
                    }).toList(),
                    options: CarouselOptions(
                      // Decrease the viewport fraction to show part of the next and previous slides
                      viewportFraction: 0.84,
                      autoPlay: true,
                      height: 130.h,
                      autoPlayInterval: const Duration(seconds: 4),
                      autoPlayAnimationDuration:
                          const Duration(milliseconds: 800),
                      enlargeCenterPage:
                          true, // This will enlarge the current slide
                      onPageChanged: (val, _) {
                        index = val;
                      },
                    ),
                  ),
                );
              }
              return const SizedBox();
            },
          ),

          //slider(context),
          const SizedBox(
            height: 20,
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                CustomButton(
                  onTap: () {
                    Navigator.pushNamed(context, kOffersScreenRoute);
                  },
                  label: 'العروض',
                  image: "assets/images/Frame (4).svg",
                ),
                CustomButton(
                  onTap: () {
                    Navigator.pushNamed(context, kCaptainsScreenRoute);
                  },
                  label: 'المدربين',
                  image: "assets/images/Frame (3).svg",
                ),
                CustomButton(
                  onTap: () {
                    Navigator.pushNamed(context, kSubscribtionsScreen);
                  },
                  label: 'الإشتراكات',
                  image: "assets/images/Frame (2).svg",
                ),
                CustomButton(
                  onTap: () {
                    Navigator.pushNamed(context, kExercisesScreenRoute);
                  },
                  label: 'التمارين',
                  image: "assets/images/Frame (1).svg",
                ),
              ],
            ),
          ),
          const SizedBox(
            height: 20,
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 15.0, vertical: 5),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'مايميزنا',
                  style: TextStyle(
                    fontSize: 18,
                    color: Colors.black,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                GestureDetector(
                  onTap: () {
                    Navigator.pushNamed(context, kOffersScreenRoute);
                  },
                  child: const Text(
                    'عرض المزيد',
                    style: TextStyle(
                      color: Colors.red,
                      fontSize: 15,
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 10),
          // const TabButtonListView(paymentMethodItems: [
          //   'التمارين',
          //   'المدربين',
          //   'الإشتراكات',
          //   'العروض',
          // ]),

          const OffersViewBody(
            home: true,
          ),
          // const OfferCard(
          //   image: "assets/images/Rectangle 37.png",
          // ),
          const SizedBox(
            height: 100,
          ),
        ],
      ),
    );
  }

  Container slider(BuildContext context) {
    return Container(
      height: 150,
      width: MediaQuery.of(context).size.width,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(16),
      ),
      child: Image.asset(
        "assets/images/slider.png",
        fit: BoxFit.fill,
      ),
    );
  }
}

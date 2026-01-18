import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:swat_gym/features/bottom_nav/presentation/manger/cubit/bottom_nav_cubit.dart';
import 'package:swat_gym/features/exercises/data/models/my_messages_model/exercise.dart';
import 'package:swat_gym/features/exercises/data/models/my_messages_model/exercise_cat.dart';
import 'package:swat_gym/features/exercises/presentation/manager/exercise_cat_cubit/exercise_cat_cubit.dart';
import 'package:swat_gym/core/utils/gaps.dart';
import 'package:swat_gym/features/app_home/presentation/views/widgets/custom_tab_button.dart';
import 'package:swat_gym/features/exercises/presentation/views/widgets/exercise_card.dart';
import 'package:hive/hive.dart';
import 'package:swat_gym/core/widgets/empty_widget.dart';

import '../../../../../../core/utils/constants.dart';
import '../../../../../../core/widgets/custom_loading_widget.dart';
import '../../../../auth/login/domain/entities/employee_entity.dart';
import '../../manager/exercise_cubit/exercise_cubit.dart';

// ignore: must_be_immutable
class ExercisesViewBody extends StatefulWidget {
  const ExercisesViewBody({super.key});

  @override
  State<ExercisesViewBody> createState() => _ExercisesViewBodyState();
}

class _ExercisesViewBodyState extends State<ExercisesViewBody> {
  var box = Hive.box<EmployeeEntity>(kEmployeeDataBox);
  int activeIndex = 0;

  @override
  void initState() {
    _onInit();
    super.initState();
  }

  void _onInit() async {
    final employee = box.get(kEmployeeDataBox);
    if (employee != null && employee.memId != null) {
      // جلب التصنيفات أولاً
      await BlocProvider.of<ExerciseCatCubit>(context)
          .getAllExerciseCat(employee.memId!.toString());

      // بعد تحميل التصنيفات، استخدم التصنيف الأول تلقائياً
      // سيتم تحديث هذا في BlocBuilder عندما تكون التصنيفات جاهزة
    }
  }

  @override
  Widget build(BuildContext context) {
    //  getAllMessages(context);

    return Column(
      children: [
        Gaps.vGap10,
        SizedBox(
          height: 40,
          child: BlocBuilder<ExerciseCatCubit, ExerciseCatState>(
            builder: (context, state) {
              if (state is FetchExerciseCatSuccessful) {
                if (state.data == null || state.data!.isEmpty) {
                  return const SizedBox();
                }

                AllExercisesCatList catsList = state.data!;

                // إذا كانت التصنيفات جاهزة ولم يتم تحميل التمارين بعد، استخدم التصنيف الأول
                if (catsList.isNotEmpty && activeIndex == 0) {
                  final firstCat = catsList[0];
                  if (firstCat.catId != null && firstCat.catId!.isNotEmpty) {
                    // تحميل التمارين للتصنيف الأول تلقائياً
                    WidgetsBinding.instance.addPostFrameCallback((_) {
                      BlocProvider.of<ExerciseCubit>(context)
                          .getAllExercise(firstCat.catId!);
                    });
                  }
                }

                return ListView.builder(
                    scrollDirection: Axis.horizontal,
                    itemCount: state.data!.length,
                    itemBuilder: (context, index) {
                      final cat = catsList[index];
                      final catId = cat.catId ?? '';
                      final catName = cat.catName ?? 'غير محدد';

                      return Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 6),
                        child: GestureDetector(
                          onTap: () {
                            if (catId.isNotEmpty) {
                              activeIndex = index;
                              setState(() {});

                              BlocProvider.of<ExerciseCubit>(context)
                                  .getAllExercise(catId);
                            }
                          },
                          child: CustomTabButton(
                            selected: activeIndex == index,
                            label: catName,
                          ),
                        ),
                      );
                    });
              } else if (state is FetchExerciseCatLoading) {
                return const Center(
                  child: CircularProgressIndicator(),
                );
              } else if (state is FetchExerciseCatFailed) {
                return const SizedBox();
              } else {
                return const Center(
                  child: CircularProgressIndicator(),
                );
              }
            },
          ),
        ),
        Gaps.vGap10,
        SizedBox(
          height: 500,
          child: BlocBuilder<ExerciseCubit, ExerciseState>(
            builder: (context, state) {
              if (state is FetchSuccessful) {
                if (state.data == null || state.data!.isEmpty) {
                  return const EmptyWidget(
                    text: "لا يوجد تمارين",
                  );
                }

                AllExercisesList offersList = state.data!;

                return ListView.builder(
                  physics: const BouncingScrollPhysics(),
                  itemCount: offersList.length,
                  itemBuilder: (context, index) {
                    if (index >= offersList.length) {
                      return const SizedBox();
                    }

                    return InkWell(
                      onTap: () {
                        Navigator.pushNamed(
                            context, kExercisesDetailsScreenRoute);

                        BlocProvider.of<BottomNavCubit>(context)
                            .getDetails(offersList[index]);

                        BlocProvider.of<BottomNavCubit>(context)
                            .getList(offersList);
                      },
                      child: ExerciseCard(
                        offersList: offersList[index],
                      ),
                    );
                  },
                );
              } else if (state is FetchLoading) {
                return const Center(
                  child: CustomLoadingWidget(
                    loadingText: "جاري تحميل التمارين",
                  ),
                );
              } else if (state is FetchFailed) {
                return const EmptyWidget(
                  text: "لا يوجد تمارين",
                );
              } else {
                return const SizedBox();
              }
            },
          ),
        ),
      ],
    );
  }
}

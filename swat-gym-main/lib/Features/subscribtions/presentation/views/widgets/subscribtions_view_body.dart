import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:swat_gym/core/widgets/empty_widget.dart';
import 'package:swat_gym/features/subscribtions/data/models/my_messages_model/subscribtions.dart';
import 'package:swat_gym/features/subscribtions/presentation/manager/ta3mem_cubit/subscribtions_cubit.dart';
import 'package:swat_gym/features/subscribtions/presentation/views/widgets/all_subscribtions_list_item.dart';

import '../../../../../../core/utils/constants.dart';
import '../../../../../../core/widgets/custom_loading_widget.dart';
import '../../../../../../core/widgets/error_text.dart';
import '../../../../bottom_nav/presentation/manger/cubit/bottom_nav_cubit.dart';

// ignore: must_be_immutable
class SubscribtionsViewBody extends StatefulWidget {
  const SubscribtionsViewBody({super.key});

  @override
  State<SubscribtionsViewBody> createState() => _SubscribtionsViewBodyState();
}

class _SubscribtionsViewBodyState extends State<SubscribtionsViewBody> {
  @override
  void initState() {
    _onInit();
    super.initState();
  }

  @override
  void dispose() {
    // BlocProvider.of<MosalatCubit>(context).close();
    super.dispose();
  }

  void _onInit() async {
    await BlocProvider.of<SubscribtionsCubit>(context).getAllMosalat();
  }

  @override
  Widget build(BuildContext context) {
    //  getAllMessages(context);

    return Padding(
      padding: const EdgeInsets.only(left: 10, right: 10, top: 30),
      child: SingleChildScrollView(
        child: BlocBuilder<SubscribtionsCubit, SubscribtionsState>(
          builder: (context, state) {
            if (state is FetchSuccessful) {
              AllSubscribtionsList ta3amemList = state.data!;

              return Column(
                children: [
                  GridView.builder(
                    shrinkWrap: true,
                    gridDelegate:
                        const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 3,
                      mainAxisSpacing: 20,
                      crossAxisSpacing: 10,
                      childAspectRatio: 0.8,
                    ),
                    physics: const BouncingScrollPhysics(),
                    itemCount: state.data!.length,
                    itemBuilder: (context, index) {
                      return InkWell(
                        onTap: () {
                          Navigator.pushNamed(
                            context,
                            kSubscribtionsDetailsScreenRoute,
                          );
                          BlocProvider.of<BottomNavCubit>(context)
                              .getDetails(state.data![index]);
                        },
                        child: AllSubscribtionsListItem(
                          ta3amemList: ta3amemList,
                          itemIndex: index,
                        ),
                      );
                    },
                  ),
                ],
              );
            } else if (state is FetchLoading) {
              return const Center(
                child: CustomLoadingWidget(
                  loadingText: "جاري تحميل الإشتراكات ",
                ),
              );
            } else if (state is FetchFailed) {
              return EmptyWidget(
                text: state.message,
              );
            } else {
              return const ErrorText(text: "حدث خطأ ما");
            }
          },
        ),
      ),
    );
  }
}

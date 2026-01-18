import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:swat_gym/core/widgets/empty_widget.dart';
import 'package:swat_gym/features/my_subscribtions/data/models/my_messages_model/my_subscribtions.dart';
import 'package:swat_gym/features/my_subscribtions/presentation/manager/ta3mem_cubit/my_subscribtions_cubit.dart';
import 'package:swat_gym/features/my_subscribtions/presentation/views/widgets/my_subscribtions_list_item.dart';

import '../../../../../../core/utils/constants.dart';
import '../../../../../../core/widgets/custom_loading_widget.dart';
import '../../../../../../core/widgets/error_text.dart';
import '../../../../bottom_nav/presentation/manger/cubit/bottom_nav_cubit.dart';

// ignore: must_be_immutable
class MySubscribtionsViewBody extends StatefulWidget {
  const MySubscribtionsViewBody({super.key});

  @override
  State<MySubscribtionsViewBody> createState() =>
      _MySubscribtionsViewBodyState();
}

class _MySubscribtionsViewBodyState extends State<MySubscribtionsViewBody> {
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
    await BlocProvider.of<MySubscribtionsCubit>(context).getMySubscribtions();
  }

  @override
  Widget build(BuildContext context) {
    //  getAllMessages(context);

    return Padding(
      padding: const EdgeInsets.only(left: 10, right: 10, top: 30),
      child: SingleChildScrollView(
        child: BlocBuilder<MySubscribtionsCubit, MySubscribtionsState>(
          builder: (context, state) {
            if (state is FetchSuccessful) {
              AllSubscribtionsList ta3amemList = state.data!;

              return Column(
                children: [
                  ListView.builder(
                    shrinkWrap: true,
                    physics: const BouncingScrollPhysics(),
                    itemCount: state.data!.length,
                    itemBuilder: (context, index) {
                      return InkWell(
                        onTap: () {
                          Navigator.pushNamed(
                            context,
                            kMySubscribtionsDetailsScreenRoute,
                          );
                          BlocProvider.of<BottomNavCubit>(context)
                              .getDetails(state.data![index]);
                        },
                        child: MySubscribtionsListItem(
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

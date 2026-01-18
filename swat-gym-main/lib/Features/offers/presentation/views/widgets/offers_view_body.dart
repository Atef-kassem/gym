import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:swat_gym/features/offers/presentation/manager/news_cubit/offers_cubit.dart';
import 'package:swat_gym/features/offers/presentation/views/widgets/argyment.dart';
import 'package:hive/hive.dart';
import 'package:swat_gym/core/widgets/empty_widget.dart';

import '../../../../../../core/locale/app_localizations.dart';
import '../../../../../../core/utils/constants.dart';
import '../../../../../../core/widgets/custom_loading_widget.dart';
import '../../../../../../core/widgets/error_text.dart';
import '../../../../auth/login/domain/entities/employee_entity.dart';
import '../../../data/models/my_messages_model/offers.dart';
import 'all_offers_list_item.dart';

// ignore: must_be_immutable
class OffersViewBody extends StatefulWidget {
  final bool home;

  const OffersViewBody({super.key, this.home = false});

  @override
  State<OffersViewBody> createState() => _OffersViewBodyState();
}

class _OffersViewBodyState extends State<OffersViewBody> {
  var box = Hive.box<EmployeeEntity>(kEmployeeDataBox);

  @override
  void initState() {
    super.initState();
    // استخدام addPostFrameCallback لضمان أن context جاهز
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _onInit();
    });
  }

  void _onInit() async {
    if (!mounted) return; // التحقق من أن widget لا يزال mounted
    if (box.get(kEmployeeDataBox) != null) {
      final cubit = BlocProvider.of<OffersCubit>(context);
      await cubit.getAllOffers(box.get(kEmployeeDataBox)!.memId!.toString());
    }
  }

  @override
  Widget build(BuildContext context) {
    //  getAllMessages(context);

    return Padding(
      padding: const EdgeInsets.only(left: 10, right: 10),
      child: BlocBuilder<OffersCubit, OffersState>(
        builder: (context, state) {
          if (state is FetchSuccessful) {
            // التحقق من أن البيانات موجودة وليست فارغة
            if (state.data == null || state.data!.isEmpty) {
              return const EmptyWidget(
                text: "لا توجد عروض متاحة",
              );
            }
            
            AllOffersList offersList = state.data!;
            final itemCount = widget.home
                ? state.data!.length > 3
                    ? 3
                    : state.data!.length
                : state.data!.length;

            return ListView.builder(
              shrinkWrap: true,
              physics: const BouncingScrollPhysics(),
              itemCount: itemCount,
              itemBuilder: (context, index) {
                return InkWell(
                  onTap: () {
                    Navigator.pushNamed(
                      context,
                      kOffersDetailsScreenRoute,
                      arguments: offerDetails(
                        list: state.data,
                        index: index,
                      ),
                    ).then((result) {
                      // Do something with the result, if needed
                      BlocProvider.of<OffersCubit>(context).getAllOffers(
                          box.get(kEmployeeDataBox)!.memId!.toString());
                    });
                  },
                  child: AllOffersListItem(
                    home: widget.home,
                    offersList: offersList[index],
                    itemIndex: index,
                  ),
                );
              },
            );
          } else if (state is FetchLoading) {
            return const Center(
              child: CustomLoadingWidget(
                loadingText: "جاري تحميل العروض",
              ),
            );
          } else if (state is FetchFailed) {
            return EmptyWidget(
              text: state.message,
            );
          } else if (box.get(kEmployeeDataBox) == null) {
            return ErrorText(
                image: "assets/images/should_login.png",
                text: AppLocalizations.of(context)!
                    .translate('you_should_login_first')!);
          } else {
            return const ErrorText(text: "حدث خطأ ما");
          }
        },
      ),
    );
  }
}

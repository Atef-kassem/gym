import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_svg/svg.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:swat_gym/core/utils/constants.dart';
import 'package:swat_gym/core/utils/gaps.dart';
import 'package:swat_gym/features/auth/login/domain/entities/employee_entity.dart';
import 'package:swat_gym/features/offers/data/models/my_messages_model/offers.dart';
import 'package:swat_gym/features/offers/domain/entities/offers_entity.dart';
import 'package:swat_gym/features/offers/presentation/manager/news_cubit/offers_cubit.dart';
import 'package:swat_gym/features/offers/presentation/manager/seen_cubit/add_offers_cubit.dart';
import 'package:swat_gym/features/offers/presentation/views/widgets/argyment.dart';
import 'package:swat_gym/features/offers/presentation/views/widgets/offer_item.dart';
import 'package:swat_gym/core/utils/image_utils.dart';
import 'package:hive/hive.dart';

class OffersDetailsView extends StatefulWidget {
  final offerDetails list;
  const OffersDetailsView({
    required this.list,
    super.key,
  });

  @override
  State<OffersDetailsView> createState() => _OffersDetailsViewState();
}

class _OffersDetailsViewState extends State<OffersDetailsView> {
  late bool fav;

  @override
  void initState() {
    super.initState();
    // استخدام checkFav من العرض لتحديد حالة المفضلة
    final offer = widget.list.list![widget.list.index];
    fav = offer.checkFav == "in_fav";
  }

  @override
  Widget build(BuildContext context) {
    OffersEntity offer;
    AllOffersList liste;

    offer = widget.list.list![widget.list.index];
    liste = widget.list.list;
    var box = Hive.box<EmployeeEntity>(kEmployeeDataBox);
    
    List<OffersEntity> shuffledOffers = List.from(
        liste!.where((element) => element.offerId! != offer.offerId).toList());
    shuffledOffers.shuffle();

    return Scaffold(

        // appBar: PreferredSize(
        //   preferredSize: MediaQuery.of(context).size * .08,
        //   child: CustomSimpleAppBar(
        //     appBarTitle: "تفاصيل العرض",
        //   ),
        // ),
        body: SingleChildScrollView(
      child: BlocListener<AddOffersCubit, AddOffersState>(
        listener: (context, state) {
          if (state is AddOfferSuccessful) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(state.data!.messageResponse ?? ""),
              ),
            );
            // تحديث حالة المفضلة بناءً على الرسالة
            final message = state.data!.messageResponse ?? "";
            setState(() {
              fav = message.contains("تم إضافة") || message.contains("تم الإضافة");
            });
            // إعادة تحميل العروض لتحديث checkFav
            BlocProvider.of<OffersCubit>(context).getAllOffers(
                box.get(kEmployeeDataBox)!.memId!.toString());
          } else if (state is AddOfferFailed) {
            ScaffoldMessenger.of(context)
                .showSnackBar(SnackBar(content: Text(state.message)));
          }
        },
        child: Column(
          children: [
            Container(
              height: 250,
              decoration: BoxDecoration(
                image: DecorationImage(
                  image: NetworkImage(
                    buildImageUrl(offer.imagePath ?? offer.image),
                  ),
                  fit: BoxFit.fill,
                ),
              ),
              child: Padding(
                padding:
                    const EdgeInsets.symmetric(horizontal: 15, vertical: 20),
                child: Stack(
                  children: [
                    Align(
                      alignment: Alignment.topLeft,
                      child: Padding(
                        padding: const EdgeInsets.symmetric(vertical: 30),
                        child: GestureDetector(
                          onTap: () {
                            Navigator.pop(context);
                          },
                          child: const Icon(
                            FontAwesomeIcons.circleArrowLeft,
                            size: 30,
                            color: Colors.white,
                          ),
                        ),
                      ),
                    ),
                    Align(
                      alignment: Alignment.bottomRight,
                      child: CircleAvatar(
                        backgroundColor: Colors.white,
                        child: BlocBuilder<AddOffersCubit, AddOffersState>(
                          builder: (context, state) {
                            return state is SeenTa3memLoading
                                ? const CircularProgressIndicator()
                                : IconButton(
                                    icon: SvgPicture.asset(
                                      offer.checkFav == "in_fav" || fav == true
                                          ? "assets/images/heart_fav.svg"
                                          : "assets/images/Heart.svg",
                                      color: offer.checkFav == "in_fav" ||
                                              fav == true
                                          ? Colors.red
                                          : Colors.grey,
                                      colorFilter: offer.checkFav == "in_fav" ||
                                              fav == true
                                          ? const ColorFilter.mode(Colors.red, BlendMode.srcIn)
                                          : null,
                                    ),
                                    onPressed: () {
                                      BlocProvider.of<AddOffersCubit>(context)
                                          .addFavorit(
                                              offer.offerId.toString(),
                                              box
                                                  .get(kEmployeeDataBox)!
                                                  .memId!
                                                  .toString());
                                    },
                                  );
                          },
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(12.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        offer.offerName ?? "",
                        style: const TextStyle(
                            fontWeight: FontWeight.bold, fontSize: 16),
                      ),
                      Row(
                        children: [
                          const Icon(Icons.star,
                              color: Colors.orange, size: 18),
                          Gaps.hGap4,
                          Text(
                            offer.rate.toString(),
                          ),
                        ],
                      ),
                    ],
                  ),
                  const SizedBox(
                    height: 10,
                  ),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      const SizedBox(height: 4),
                      Text(
                        "${offer.offerValue} جـنـيـه",
                      ),
                    ],
                  ),
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 10),
              child: Container(
                height: 30,
                decoration: BoxDecoration(
                    border: Border.all(
                      color: Colors.grey[400]!,
                    ),
                    borderRadius: BorderRadius.circular(8)),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.start,
                  children: [
                    const SizedBox(
                      width: 8,
                    ),
                    SvgPicture.asset(
                      "assets/images/clock.svg",
                      height: 15,
                    ),
                    const SizedBox(
                      width: 8,
                    ),
                    Text(
                      offer.subTitle ?? "",
                      style: const TextStyle(color: Colors.black, fontSize: 12),
                    ),
                  ],
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: Text(
                offer.offerDetails ?? "",
                textAlign: TextAlign.justify,
              ),
            ),

            Gaps.vGap15,
            const Padding(
              padding: EdgeInsets.symmetric(horizontal: 12),
              child: Align(
                alignment: Alignment.topRight,
                child: Text(
                  'عروض أخرى',
                  style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: Colors.red),
                ),
              ),
            ),
            ListView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: shuffledOffers.length > 3
                  ? 3
                  : shuffledOffers.length, // Number of other offers

              itemBuilder: (context, index) {
                return InkWell(
                  onTap: () {
                    Navigator.pushReplacementNamed(
                        context, kOffersDetailsScreenRoute,
                        arguments: offerDetails(
                          list: liste,
                          index: index,
                        )).then((result) {
                      // Do something with the result, if needed
                      BlocProvider.of<OffersCubit>(context).getAllOffers(
                          box.get(kEmployeeDataBox)!.memId!.toString());
                    });
                  },
                  child: OfferItem(
                    image: buildImageUrl(shuffledOffers[index].imagePath ?? shuffledOffers[index].image),
                    title: shuffledOffers[index].offerName ?? "",
                    price: shuffledOffers[index].offerValue ?? "",
                    rate: shuffledOffers[index].rate.toString(),
                    checkFav: shuffledOffers[index].checkFav ?? "",
                  ),
                );
              },
            ),
            const SizedBox(height: 8),
            // const CustomTextButton(
            //   text: 'اشترك الآن',
            // ),
            Gaps.vGap10,
          ],
        ),
      ),
    ));
  }
}

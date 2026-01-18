import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:swat_gym/core/widgets/custom_image.dart';

import 'package:swat_gym/features/bottom_nav/presentation/manger/cubit/bottom_nav_cubit.dart';
import 'package:swat_gym/features/news/data/models/news.dart';

import '../../../../../../core/utils/constants.dart';
import '../../../../../../core/utils/gaps.dart';
import '../../../../../../core/utils/image_utils.dart';

import '../../../../../../core/widgets/custom_simple_app_bar.dart';

class NewsDetailsView extends StatelessWidget {
  const NewsDetailsView({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    News news;

    news = BlocProvider.of<BottomNavCubit>(context).details!;

    return Scaffold(
        appBar: PreferredSize(
          preferredSize: MediaQuery.of(context).size * .08,
          child: CustomSimpleAppBar(
            appBarTitle: "تفاصيل الخبر",
            backHandler: () {
              Navigator.pop(context);
            },
          ),
        ),
        body: SingleChildScrollView(
          child: Column(children: [
            Gaps.vGap10,
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Column(
                children: [
                  CachedNetworkImage(
                    imageUrl: buildImageUrl(news.mainImage),
                    height: 200,
                    fit: BoxFit.fill,
                    width: 400,
                    placeholder: (context, url) => const BlankImageWidget(),
                    errorWidget: (context, url, error) =>
                        const BlankImageWidget(),
                    imageBuilder: (context, imageProvider) => Container(
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(20),
                        image: DecorationImage(
                            image: imageProvider, fit: BoxFit.fill),
                      ),
                    ),
                  ),
                  Gaps.vGap10,
                  Text(
                    news.newsTitleAr!,
                    textAlign: TextAlign.center,
                    style: TextStyle(
                        fontSize: 20,
                        color: kPrimaryColor,
                        fontWeight: FontWeight.bold),
                  ),
                  Gaps.vGap10,
                  Gaps.vGap10,
                  Text(
                    news.detailsAr ?? "",
                    textAlign: TextAlign.justify,
                    style: TextStyle(color: Colors.grey[600], fontSize: 17),
                  )
                ],
              ),
            ),
            Gaps.vGap20,
          ]),
        ));
  }
}

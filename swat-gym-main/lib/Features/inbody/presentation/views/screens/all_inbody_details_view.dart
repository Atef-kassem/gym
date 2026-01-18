import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:swat_gym/core/widgets/custom_image.dart';

import 'package:swat_gym/features/bottom_nav/presentation/manger/cubit/bottom_nav_cubit.dart';
import 'package:swat_gym/features/inbody/data/models/all_inbody.dart';

import '../../../../../../core/utils/constants.dart';
import '../../../../../../core/utils/gaps.dart';
import 'package:widget_zoom/widget_zoom.dart';
import '../../../../../../core/widgets/custom_simple_app_bar.dart';

class AllInbodyDetailsView extends StatelessWidget {
  const AllInbodyDetailsView({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    AllInbody news;

    news = BlocProvider.of<BottomNavCubit>(context).details!;

    return Scaffold(
        appBar: PreferredSize(
          preferredSize: MediaQuery.of(context).size * .07,
          child: CustomSimpleAppBar(
            appBarTitle: "تفاصيل ",
            backHandler: () {
              Navigator.pop(context);
            },
          ),
        ),
        body: Column(
          children: [
            Text(
              news.title!,
              textAlign: TextAlign.center,
              style: TextStyle(
                  fontSize: 20,
                  color: kPrimaryColor,
                  fontWeight: FontWeight.bold),
            ),
            Gaps.vGap10,
            Text(
              news.dayDate ?? "",
              style: TextStyle(color: Colors.grey[600], fontSize: 17),
            ),
            WidgetZoom(
              heroAnimationTag: 'tag',
              zoomWidget: CachedNetworkImage(
                imageUrl: news.imagePath ?? "",
                height: MediaQuery.of(context).size.height - 200,
                fit: BoxFit.fitWidth,
                width: MediaQuery.of(context).size.width,
                placeholder: (context, url) => const BlankImageWidget(),
                errorWidget: (context, url, error) => const BlankImageWidget(),
                imageBuilder: (context, imageProvider) => Container(
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(20),
                    image:
                        DecorationImage(image: imageProvider, fit: BoxFit.fill),
                  ),
                ),
              ),
            ),
            Gaps.vGap10,
          ],
        ));
  }
}

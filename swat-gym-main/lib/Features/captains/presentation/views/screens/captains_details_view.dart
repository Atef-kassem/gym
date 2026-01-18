import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_svg/svg.dart';
import 'package:swat_gym/core/widgets/custom_image.dart';
import 'package:swat_gym/features/bottom_nav/presentation/manger/cubit/bottom_nav_cubit.dart';
import 'package:swat_gym/features/captains/domain/entities/captains_entity.dart';

import '../../../../../../core/utils/constants.dart';
import '../../../../../../core/utils/gaps.dart';
import '../../../../../../core/utils/image_utils.dart';
import '../../../../../../core/widgets/custom_simple_app_bar.dart';

class CaptainsDetailsView extends StatelessWidget {
  const CaptainsDetailsView({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    CaptainsEntity captains;

    captains = BlocProvider.of<BottomNavCubit>(context).details!;

    return SafeArea(
      child: Scaffold(
          appBar: PreferredSize(
            preferredSize: MediaQuery.of(context).size * .08,
            child: CustomSimpleAppBar(
              appBarTitle: "تفاصيل المدرب",
               backHandler: () {
              Navigator.pop(context);
            },
            ),
          ),
          body: Padding(
            padding: const EdgeInsets.only(right: 24),
            child: Column(
              //  clipBehavior: Clip.none,
              children: [
                Gaps.vGap40,
                SizedBox(
                  height: 122,
                  child: CircleAvatar(
                    radius: 61,
                    backgroundColor: Colors.black,
                    child: CircleAvatar(
                      radius: 60,
                      backgroundColor: Colors.white,
                      child: CachedNetworkImage(
                        imageUrl: buildImageUrl(captains.imagePath),
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
                      ), // Replace with the actual image
                    ),
                  ),
                ),
                SizedBox(
                  height: 60,
                  child: Padding(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 35,
                    ),
                    child: ListTile(
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(30),
                        side: const BorderSide(color: Colors.black),
                      ),
                      leading: CircleAvatar(
                        backgroundColor: Colors.white,
                        child: SvgPicture.asset(
                          "assets/images/Group.svg",
                          height: 25,
                        ),
                      ),
                      title: Align(
                        alignment: Alignment.centerRight,
                        child: Text(
                          captains.name!,
                        ),
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 8),
                const Text(
                  'مدرب أول  ',
                  style: TextStyle(
                    color: Colors.grey,
                  ),
                ),
                Gaps.vGap20,
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 24),
                  child: Align(
                    alignment: Alignment.topRight,
                    child: Text(
                      "عن المدرب",
                      style: TextStyle(
                          color: kPrimaryColor,
                          fontSize: 17,
                          fontWeight: FontWeight.w700),
                    ),
                  ),
                ),
                Gaps.vGap10,
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 24),
                  child: Text(
                    captains.about ?? "",
                    textAlign: TextAlign.center,
                    maxLines: 5,
                  ),
                ),
              ],
            ),
          )),
    );
  }
}

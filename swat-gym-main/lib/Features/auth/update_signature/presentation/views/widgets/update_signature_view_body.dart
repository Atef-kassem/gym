import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';

import '../../../../../../core/utils/assets.dart';
import '../../../../../../core/utils/constants.dart';
import '../../../../../../core/utils/media_query_sizes.dart';
import '../../../../../../core/widgets/custom_circle_clipper.dart';
import '../../../../../../core/widgets/custom_elevated_container.dart';
import '../../../../../../core/widgets/custom_image.dart';
import 'update_signature_form.dart';

class UpdateSignatureViewBody extends StatelessWidget {
  const UpdateSignatureViewBody({super.key});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: Stack(
        alignment: Alignment.topCenter,
        clipBehavior: Clip.none,
        children: [
          ClipPath(
            clipper: RoundedClipper(),
            child: Container(
              color: kPrimaryColor,
              height: SizeConfig.screenHeight! * 0.7,
            ),
          ),
          Padding(
            padding: EdgeInsets.only(
              top: SizeConfig.screenHeight! * .3,
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                CustomElevatedContainer(
                  containerChild: const Padding(
                    padding: EdgeInsets.only(top: 30),
                    child: UpdateSignatureForm(),
                  ),
                  containerHeight: SizeConfig.screenHeight! * 0.59,
                  containerWidth: SizeConfig.screenWidth! * 0.85,
                ),
              ],
            ),
          ),
          Center(
            child: Padding(
                padding: const EdgeInsets.only(top: 28.0),
                child: CachedNetworkImage(
                  height: 150,
                  width: 150,
                  color: Colors.white,
                  imageUrl:logo,
                  placeholder: (context, url) => const BlankImageWidget(),
                  errorWidget: (context, url, error) => Image.asset(
                    AssetsData.logo,
                    height: 150,
                    width: 150,
                    color: Colors.white,
                  ),
                )),
          ),
        ],
      ),
    );
  }
}

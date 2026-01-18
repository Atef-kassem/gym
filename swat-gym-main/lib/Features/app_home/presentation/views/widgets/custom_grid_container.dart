import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:swat_gym/core/utils/constants.dart';
import 'package:swat_gym/core/utils/media_query_sizes.dart';
import 'package:swat_gym/core/utils/image_utils.dart';

class CustomGridContainer extends StatelessWidget {
  const CustomGridContainer(
      {super.key,
      required this.imagePath,
      required this.orderText,
      required this.onTap});

  final String imagePath;
  final String orderText;
  final Function onTap;

  @override
  Widget build(BuildContext context) {
    SizeConfig().init(context);
    return GestureDetector(
      onTap: () {
        onTap();
      },
      child: Padding(
        padding: EdgeInsets.symmetric(horizontal: 5.w),
        child: Container(
          padding: EdgeInsets.symmetric(vertical: 4.h),
          decoration: BoxDecoration(
            color: const Color(0xffeaeaf7),
            borderRadius: BorderRadius.circular(12),
            boxShadow: const [
              BoxShadow(
                color: Colors.grey,
                blurRadius: 2.0,
                offset: Offset(0.2, 0.2),
              )
            ],
          ),
          child: Column(
            children: [
              CachedNetworkImage(
                height: SizeConfig.screenHeight! * 0.08,
                width: 65,
                errorWidget: (context, url, error) => Icon(
                  Icons.person,
                  color: kPrimaryColor,
                ),
                progressIndicatorBuilder: (context, url, progress) => Center(
                  child: CircularProgressIndicator(
                      value: progress.progress, color: kPrimaryColor),
                ),
                imageUrl: buildImageUrl(imagePath),
                // errorListener: (error) {
                //
                //   isError = true;
                // },
              ),
              // Image.asset(
              //   imagePath,
              //   height: SizeConfig.screenHeight! * 0.08,
              //   width: 65,
              // ),
              const SizedBox(
                height: 5,
              ),
              FittedBox(
                fit: BoxFit.fill,
                child: Text(orderText,
                    style: TextStyle(
                      color: const Color(0xff403f3f),
                      fontSize: 12.sp,
                      fontWeight: FontWeight.w700,
                    )),
              )
            ],
          ),
        ),
      ),
    );
  }
}

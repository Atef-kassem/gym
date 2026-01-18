import 'package:animate_do/animate_do.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../bottom_nav/presentation/manger/cubit/bottom_nav_cubit.dart';
import 'widgets/personal_account_screen_body.dart';
import '../../../../core/locale/app_localizations.dart';
import '../../../../core/widgets/custom_simple_app_bar.dart';
import 'package:flutter/material.dart';

class PersonalAccountScreen extends StatelessWidget {
  const PersonalAccountScreen({super.key});

  @override
  Widget build(BuildContext context) {
    late AppLocalizations locale;
    locale = AppLocalizations.of(context)!;
    final screenSize = MediaQuery.of(context).size;

    return FadeInUp(
      duration: const Duration(milliseconds: 300),
      child: Scaffold(
        backgroundColor: Colors.white,
        appBar: PreferredSize(
          preferredSize: screenSize * .07,
          child: CustomSimpleAppBar(
            backHandler: () {
              BlocProvider.of<BottomNavCubit>(context).updateBottomNavIndex(4);
            },
            appBarTitle: locale.translate('personal_account_view')!,
          ),
        ),
        body: const PersonalAccountScreenBody(),
      ),
    );
  }
}

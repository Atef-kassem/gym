import 'package:swat_gym/features/calender/presentation/views/widgets/basics_example.dart';
import 'package:swat_gym/core/widgets/custom_loading_widget.dart';
import 'package:swat_gym/core/widgets/error_text.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../manager/cubit/calender_table_cubit.dart';

class CalenderViewBody extends StatefulWidget {
  const CalenderViewBody({super.key});

  @override
  State<CalenderViewBody> createState() => _CalenderViewBodyState();
}

class _CalenderViewBodyState extends State<CalenderViewBody> {
  @override
  Widget build(BuildContext context) {
    BlocProvider.of<CalenderCubit>(context).getCalenderData("06", "5");

    return Column(
      children: [
        BlocBuilder<CalenderCubit, CalenderState>(
          builder: (context, state) {
            if (state is FetchLoading) {
              return const CustomLoadingWidget();
            } else if (state is FetchSuccessful) {
              // return Text(state.data![0].day5.toString());

              return TableBasicsExample(data: state.data![0]);
            } else if (state is FetchFailed) {
              return ErrorText(text: state.message);
            } else {
              return const ErrorText(text: "حدث خطأ ما");
            }
          },
        ),
      ],
    );
  }
}

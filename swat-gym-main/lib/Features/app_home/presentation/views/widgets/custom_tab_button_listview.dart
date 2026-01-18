import 'package:flutter/material.dart';
import 'package:swat_gym/features/app_home/presentation/views/widgets/custom_tab_button.dart';

class TabButtonListView extends StatefulWidget {
  const TabButtonListView({
    super.key,
    required this.paymentMethodItems,
  });
  final List<String> paymentMethodItems;

  @override
  State<TabButtonListView> createState() => _TabButtonListViewState();
}

class _TabButtonListViewState extends State<TabButtonListView> {
  int activeIndex = 0;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 40,
      width: double.infinity,
      child: ListView.builder(
          scrollDirection: Axis.horizontal,
          itemCount: widget.paymentMethodItems.length,
          itemBuilder: (context, index) {
            return Padding(
              padding: const EdgeInsets.symmetric(horizontal: 6),
              child: GestureDetector(
                onTap: () {
                  activeIndex = index;
                  setState(() {});
                },
                child: CustomTabButton(
                  selected: activeIndex == index,
                  label: widget.paymentMethodItems[index],
                ),
              ),
            );
          }),
    );
  }
}

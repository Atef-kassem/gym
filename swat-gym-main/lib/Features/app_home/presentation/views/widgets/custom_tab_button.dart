import 'package:flutter/material.dart';

class CustomTabButton extends StatelessWidget {
  const CustomTabButton(
      {super.key,
      required this.label,
      required this.selected,
      this.color = const Color.fromARGB(255, 252, 8, 8)});
  final String label;
  final bool selected;
  final Color color;
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: BoxDecoration(
        color: selected ? color : Colors.grey[200],
        borderRadius: BorderRadius.circular(20),
      ),
      child: Text(
        label,
        style: TextStyle(
          color: selected ? Colors.white : Colors.grey,
          fontWeight: selected ? FontWeight.bold : FontWeight.normal,
        ),
      ),
    );
  }
}

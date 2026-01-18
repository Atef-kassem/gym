import 'dart:convert';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_state_notifier/flutter_state_notifier.dart';
import 'package:hive/hive.dart';
import 'package:path_provider/path_provider.dart';
import 'package:swat_gym/features/auth/login/domain/entities/employee_entity.dart';
import 'package:swat_gym/features/auth/update_signature/presentation/manager/cubit/update_signature_cubit.dart';
import 'package:swat_gym/core/utils/commons.dart';
import 'package:swat_gym/core/utils/constants.dart';
import 'package:swat_gym/core/utils/functions/setup_service_locator.dart';
import 'package:swat_gym/core/widgets/custom_button.dart';
import 'package:scribble/scribble.dart';

class UpdateSignatureView extends StatefulWidget {
  const UpdateSignatureView({super.key});

  @override
  State<UpdateSignatureView> createState() => _UpdateSignatureViewState();
}

class _UpdateSignatureViewState extends State<UpdateSignatureView> {
  late ScribbleNotifier notifier;
  Future<File>? selectedFile;

  @override
  void initState() {
    notifier = ScribbleNotifier();
    super.initState();
  }

  Future<File> writeToFile(ByteData data) async {
    final buffer = data.buffer;
    Directory tempDir = await getTemporaryDirectory();
    String tempPath = tempDir.path;
    var filePath =
        '$tempPath/file_01.tmp'; // file_01.tmp is dump file, can be anything
    return File(filePath).writeAsBytes(
        buffer.asUint8List(data.offsetInBytes, data.lengthInBytes));
  }

  Future<void> writeToFile2(ByteData data, String path) {
    final buffer = data.buffer;
    return File(path).writeAsBytes(
        buffer.asUint8List(data.offsetInBytes, data.lengthInBytes));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("أضف توقيعك"),
        leading: IconButton(
          icon: const Icon(Icons.save),
          tooltip: "Save to Image",
          onPressed: () => _saveImage(context),
        ),
      ),
      body: SingleChildScrollView(
        child: SizedBox(
          height: MediaQuery.of(context).size.height / 1.2,
          child: BlocListener<UpdateSignatureCubit, UpdateSignatureState>(
            listener: (context, state) {
              if (state is UpdateSignatureSuccessful) {
                var box = Hive.box<EmployeeEntity>(kEmployeeDataBox);
                box.put(kEmployeeDataBox, state.data);
                Commons.showToast(context, message: "تم تغيير الصورة بنجاح");
                Navigator.pushReplacementNamed(context, kHomeScreen);

                // BlocProvider.of<BottomNavCubit>(context)
                //     .navigationQueue
                //     .addLast(BlocProvider.of<BottomNavCubit>(context)
                //         .bottomNavIndex);
                // BlocProvider.of<BottomNavCubit>(context)
                //     .updateBottomNavIndex(kPersonalAccountScreen);
              } else if (state is UpdateSignatureFailed) {
                Commons.showToast(context, message: state.failMessage);
              }
            },
            child: Stack(
              alignment: Alignment.bottomCenter,
              children: [
                Scribble(
                  notifier: notifier,
                  drawPen: true,
                ),
                Positioned(
                  top: 16,
                  right: 16,
                  child: Column(
                    children: [
                      _buildColorToolbar(context),
                      const Divider(
                        height: 32,
                      ),
                      _buildStrokeToolbar(context),
                    ],
                  ),
                ),
                BlocBuilder<UpdateSignatureCubit, UpdateSignatureState>(
                    builder: (context, state) {
                  return state is UpdateSignatureLoading
                      ? CircularProgressIndicator(
                          color: kPrimaryColor,
                        )
                      : CustomButton(
                          screenWidth: MediaQuery.of(context).size.width * .45,
                          buttonTapHandler: () async {
                            final image = await notifier.renderImage();

                            // Encode the bytes
                            var base64Image =
                                base64Encode(image.buffer.asUint8List());

                            // final directory = await getTemporaryDirectory();
                            // const filepath = "abc.png";
                            // File imgFile = File(image.buffer..toString());
                            // imgFile.writeAsBytes(image.buffer.asUint8List());

                            selectedFile = File(base64Image).writeAsBytes(
                              image.buffer.asUint8List(),
                            );
                            var box =
                                Hive.box<EmployeeEntity>(kEmployeeDataBox);
                            BlocProvider.of<UpdateSignatureCubit>(context)
                                .updateSignature(
                              box.get(kEmployeeDataBox) != null
                                  ? box.get(kEmployeeDataBox)!.memId!.toString()
                                  : "",
                              image.buffer.asUint8List(),
                            );
                          },
                          buttonText: "ارسال");
                })
              ],
            ),
          ),
        ),
      ),
    );
  }

  Future<void> _saveImage(context) async {
    final image = await notifier.renderImage();
    await showDialog(
      context: context,
      builder: (context) => BlocProvider(
        create: (context) => getIt<UpdateSignatureCubit>(),
        child: AlertDialog(
          title: const Text("توقيعك"),
          content: Image.memory(image.buffer.asUint8List()),
        ),
      ),
    );
  }

  Widget _buildStrokeToolbar(BuildContext context) {
    return StateNotifierBuilder<ScribbleState>(
      stateNotifier: notifier,
      builder: (context, state, _) => Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        mainAxisAlignment: MainAxisAlignment.start,
        children: [
          for (final w in notifier.widths)
            _buildStrokeButton(
              context,
              strokeWidth: w,
              state: state,
            ),
        ],
      ),
    );
  }

  Widget _buildStrokeButton(
    BuildContext context, {
    required double strokeWidth,
    required ScribbleState state,
  }) {
    final selected = state.selectedWidth == strokeWidth;
    return Padding(
      padding: const EdgeInsets.all(4),
      child: Material(
        elevation: selected ? 4 : 0,
        shape: const CircleBorder(),
        child: InkWell(
          onTap: () => notifier.setStrokeWidth(strokeWidth),
          customBorder: const CircleBorder(),
          child: AnimatedContainer(
            duration: kThemeAnimationDuration,
            width: strokeWidth * 2,
            height: strokeWidth * 2,
            decoration: BoxDecoration(
                color: state.map(
                  drawing: (s) => Color(s.selectedColor),
                  erasing: (_) => Colors.transparent,
                ),
                border: state.map(
                  drawing: (_) => null,
                  erasing: (_) => Border.all(width: 1),
                ),
                borderRadius: BorderRadius.circular(50.0)),
          ),
        ),
      ),
    );
  }

  Widget _buildColorToolbar(BuildContext context) {
    return StateNotifierBuilder<ScribbleState>(
      stateNotifier: notifier,
      builder: (context, state, _) => Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        mainAxisAlignment: MainAxisAlignment.start,
        children: [
          _buildUndoButton(context),
          const Divider(
            height: 4.0,
          ),
          _buildRedoButton(context),
          const Divider(
            height: 4.0,
          ),
          _buildClearButton(context),
          const Divider(
            height: 20.0,
          ),
          _buildPointerModeSwitcher(context,
              penMode:
                  state.allowedPointersMode == ScribblePointerMode.penOnly),
          const Divider(
            height: 20.0,
          ),
          _buildEraserButton(context, isSelected: state is Erasing),
          _buildColorButton(context, color: Colors.black, state: state),
          _buildColorButton(context, color: Colors.red, state: state),
          _buildColorButton(context, color: Colors.green, state: state),
          _buildColorButton(context, color: Colors.blue, state: state),
          _buildColorButton(context, color: Colors.yellow, state: state),
        ],
      ),
    );
  }

  Widget _buildPointerModeSwitcher(BuildContext context,
      {required bool penMode}) {
    return FloatingActionButton.small(
      onPressed: () => notifier.setAllowedPointersMode(
        penMode ? ScribblePointerMode.all : ScribblePointerMode.penOnly,
      ),
      tooltip:
          "Switch drawing mode to ${penMode ? "all pointers" : "pen only"}",
      child: AnimatedSwitcher(
        duration: kThemeAnimationDuration,
        child: !penMode
            ? const Icon(
                Icons.touch_app,
                key: ValueKey(true),
              )
            : const Icon(
                Icons.do_not_touch,
                key: ValueKey(false),
              ),
      ),
    );
  }

  Widget _buildEraserButton(BuildContext context, {required bool isSelected}) {
    return Padding(
      padding: const EdgeInsets.all(4),
      child: FloatingActionButton.small(
        tooltip: "Erase",
        backgroundColor: const Color(0xFFF7FBFF),
        elevation: isSelected ? 10 : 2,
        shape: !isSelected
            ? const CircleBorder()
            : RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8),
              ),
        onPressed: notifier.setEraser,
        child: const Icon(Icons.remove, color: Colors.blueGrey),
      ),
    );
  }

  Widget _buildColorButton(
    BuildContext context, {
    required Color color,
    required ScribbleState state,
  }) {
    final isSelected = state is Drawing && state.selectedColor == color.value;
    return Padding(
      padding: const EdgeInsets.all(4),
      child: FloatingActionButton.small(
          backgroundColor: color,
          elevation: isSelected ? 10 : 2,
          shape: !isSelected
              ? const CircleBorder()
              : RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
          child: Container(),
          onPressed: () => notifier.setColor(color)),
    );
  }

  Widget _buildUndoButton(
    BuildContext context,
  ) {
    return FloatingActionButton.small(
      tooltip: "Undo",
      onPressed: notifier.canUndo ? notifier.undo : null,
      disabledElevation: 0,
      backgroundColor: notifier.canUndo ? Colors.blueGrey : Colors.grey,
      child: const Icon(
        Icons.undo_rounded,
        color: Colors.white,
      ),
    );
  }

  Widget _buildRedoButton(
    BuildContext context,
  ) {
    return FloatingActionButton.small(
      tooltip: "Redo",
      onPressed: notifier.canRedo ? notifier.redo : null,
      disabledElevation: 0,
      backgroundColor: notifier.canRedo ? Colors.blueGrey : Colors.grey,
      child: const Icon(
        Icons.redo_rounded,
        color: Colors.white,
      ),
    );
  }

  Widget _buildClearButton(BuildContext context) {
    return FloatingActionButton.small(
      tooltip: "Clear",
      onPressed: notifier.clear,
      disabledElevation: 0,
      backgroundColor: Colors.blueGrey,
      child: const Icon(Icons.clear),
    );
  }
}

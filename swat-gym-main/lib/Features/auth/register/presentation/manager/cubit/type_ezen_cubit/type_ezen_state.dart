part of 'type_branches_cubit.dart';

abstract class BranchesState {
  const BranchesState();
  List<Object> get props => [];
}

class MyMessagesInitial extends BranchesState {}

class FetchLoading extends BranchesState {
  const FetchLoading();
}

class FetchSuccessful extends BranchesState {
  final TypeBranchesList? data;

  const FetchSuccessful(this.data);
}

class FetchFailed extends BranchesState {
  final String message;
  const FetchFailed(this.message);
}

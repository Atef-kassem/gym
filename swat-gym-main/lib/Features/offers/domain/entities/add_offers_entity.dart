import 'package:equatable/equatable.dart';

class AddOffersEntity extends Equatable {
 final String ?messageResponse;
 final int ?statusCode;


 const AddOffersEntity({
     this.messageResponse,
     this.statusCode,
  });
  
  @override

  List<Object?> get props => [messageResponse,statusCode];
}

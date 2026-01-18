import 'package:swat_gym/features/offers/domain/entities/add_offers_entity.dart';

class AddOfferModel extends AddOffersEntity {
  const AddOfferModel({
    super.messageResponse,
    super.statusCode,
  });

  factory AddOfferModel.fromJson(Map<String, dynamic> json) {
    print('=== AddOfferModel.fromJson Debug ===');
    print('json keys: ${json.keys}');
    print('json: $json');
    
    // دعم format الجديد: { code: 0, message: "...", data: {...} }
    // أو format القديم: { status: int, message: "..." }
    // أو data من الـ response: { isFavorite: true, favorite: {...} }
    int? statusValue;
    String? messageValue;
    
    // إذا كان JSON يحتوي على isFavorite، يعني أنه data من الـ response
    if (json.containsKey('isFavorite')) {
      // هذا يعني أن الـ response نجح
      statusValue = 0; // نجاح
      messageValue = json['isFavorite'] == true 
          ? "تم إضافة العرض إلى المفضلة"
          : "تم إزالة العرض من المفضلة";
      print('Found isFavorite, setting statusValue to 0');
    } else if (json.containsKey('code')) {
      statusValue = json['code'] is int
          ? json['code'] as int?
          : int.tryParse(json['code'].toString());
      messageValue = json['message'] as String?;
      print('Found code: $statusValue');
    } else if (json.containsKey('status')) {
      statusValue = json['status'] is int
          ? json['status'] as int?
          : int.tryParse(json['status'].toString());
      messageValue = json['message'] as String?;
      print('Found status: $statusValue');
    }
    
    return AddOfferModel(
      statusCode: statusValue ?? 0,
      messageResponse: messageValue,
    );
  }

  Map<String, dynamic> toJson() => {
        'status': statusCode,
        'message': messageResponse,
      };
}

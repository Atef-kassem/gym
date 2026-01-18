import '../../../domain/entities/my_subscribtions_entity.dart';

typedef AllSubscribtionsList = List<MySubscribtionsEntity>?;

class MySubscribtions extends MySubscribtionsEntity {
  const MySubscribtions({
    super.subsId,
    super.captainName,
    super.fromDateAr,
    super.haveEgraaStop,
    super.memIdFk,
    super.stopFromAr,
    super.stopToAr,
    super.price,
    super.subsName,
    super.subscriptionTypeFk,
    super.toDateAr,
    super.details,
  });

  factory MySubscribtions.fromJson(Map<String, dynamic> json) {
    // دعم البيانات الجديدة من API
    if (json.containsKey("id") || json.containsKey("subscriptionNumber")) {
      // البيانات الجديدة من API
      return MySubscribtions(
        subsId: json["id"]?.toString() ?? json["subscriptionNumber"]?.toString(),
        captainName: json["employee"]?["arabicName"]?.toString() ?? json["employee"]?["englishName"]?.toString(),
        fromDateAr: json["subscriptionStartDate"]?.toString(),
        haveEgraaStop: null,
        memIdFk: json["memberId"]?.toString(),
        stopFromAr: null,
        stopToAr: null,
        price: json["subscriptionValue"]?.toString() ?? json["paidAmount"]?.toString(),
        subsName: json["subscriptionType"]?.toString() ?? json["customerName"]?.toString(),
        subscriptionTypeFk: json["subscriptionType"]?.toString(),
        toDateAr: json["subscriptionEndDate"]?.toString(),
        details: json["status"]?.toString(),
      );
    } else {
      // البيانات القديمة من API
      return MySubscribtions(
        subsId: json["subs_id"]?.toString(),
        captainName: json["captain_name"]?.toString(),
        fromDateAr: json["from_date_ar"]?.toString(),
        haveEgraaStop: json["have_egraa_stop"]?.toString(),
        memIdFk: json["mem_id_fk"]?.toString(),
        stopFromAr: json["stop_from_ar"],
        stopToAr: json["stop_to_ar"],
        price: json["price"]?.toString(),
        subsName: json["subs_name"]?.toString(),
        subscriptionTypeFk: json["subscription_type_fk"]?.toString(),
        toDateAr: json["to_date_ar"]?.toString(),
        details: json["details"]?.toString(),
      );
    }
  }

  Map<String, dynamic> toJson() => {
        "subs_id": subsId,
        "captain_name": captainName,
        "from_date_ar": fromDateAr,
        "have_egraa_stop": haveEgraaStop,
        "mem_id_fk": memIdFk,
        "stop_from_ar": stopFromAr,
        "stop_to_ar": stopToAr,
        "price": price,
        "subs_name": subsName,
        "subscription_type_fk": subscriptionTypeFk,
        "to_date_ar": toDateAr,
        "details": details
      };
}

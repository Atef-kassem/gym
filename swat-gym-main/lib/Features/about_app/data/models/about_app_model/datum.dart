typedef AboutAppDataList = List<Datum>?;

class Datum {
  String? id;
  String? appName;
  String? appVersion;
  String? description;
  String? features;
  String? contactEmail;
  String? contactPhone;
  String? website;
  String? privacyPolicy;
  String? termsOfService;
  // Old format fields (for backward compatibility)
  String? aboutApp;
  dynamic appLogo;

  Datum({
    this.id,
    this.appName,
    this.appVersion,
    this.description,
    this.features,
    this.contactEmail,
    this.contactPhone,
    this.website,
    this.privacyPolicy,
    this.termsOfService,
    this.aboutApp,
    this.appLogo,
  });

  factory Datum.fromJson(Map<String, dynamic> json) {
    // التعامل مع format الجديد من Backend: { id, appName, appVersion, description, ... }
    // أو format القديم: { app_name, about_app, app_logo }
    
    return Datum(
      // New Backend Format
      id: json['id']?.toString(),
      appName: json['appName']?.toString() ?? json['app_name']?.toString(),
      appVersion: json['appVersion']?.toString(),
      description: json['description']?.toString(),
      features: json['features']?.toString(),
      contactEmail: json['contactEmail']?.toString(),
      contactPhone: json['contactPhone']?.toString(),
      website: json['website']?.toString(),
      privacyPolicy: json['privacyPolicy']?.toString(),
      termsOfService: json['termsOfService']?.toString(),
      // Old Backend Format (for backward compatibility)
      aboutApp: json['about_app']?.toString() ?? json['description']?.toString() ?? json['features']?.toString(),
      appLogo: json['appLogo'] ?? json['app_logo'],
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'appName': appName,
        'appVersion': appVersion,
        'description': description,
        'features': features,
        'contactEmail': contactEmail,
        'contactPhone': contactPhone,
        'website': website,
        'privacyPolicy': privacyPolicy,
        'termsOfService': termsOfService,
        'app_name': appName,
        'about_app': aboutApp,
        'app_logo': appLogo,
      };
}

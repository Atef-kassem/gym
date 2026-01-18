///Manage the status of error codes
class ErrorStatus {
  //Code of successful data
  static const int rEQUESTDATAOK = 0;

  //The request is successful
  static const int sUCCESS = 200;

  //The server access FORBIDDEN
  static const int fORBIDDEN = 403;

  static const int notFound = 404;
  static const int notToken = 401;

  //Other errors
  static const int uNKNOWNERROR = 1000;

  //network error
  static const int nETWORKERROR = 1001;

  //Server connection error
  static const int sOCKETERROR = 1002;

  //internal Server error
  static const int sERVERERROR = 1003;

  //TIMEOUT_ERROR
  static const int tIMEOUTERROR = 1004;

  //CANCEL_ERROR
  static const int cACCELERATOR = 1005;

  //PARSE_ERROR
  static const int pARSEERROR = 1006;
}

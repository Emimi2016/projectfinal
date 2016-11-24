/**
* Methods for biodata
*
* These methods will act like a security layer
* between health platform and biodata API
* Client will call these methods first and than
* inside every method there will be call to remote
* method on biodata API.
* Client should not know that there is another server
* for biodata.
* There methods will collect data from client and
* do calculation of missing fields and they will
* use this.userId to send ID of the current user
*/
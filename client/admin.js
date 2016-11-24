Meteor.loginAsAdmin = function(password, callback) {
  //create a login request with admin: true, so our loginHandler can handle this request 
  var loginRequest = {admin: true, password: password};
  console.log('password ' + password);
  console.log('loginRequest ' + loginRequest);
  console.log('callback ' + callback);
  //send the login request
  Accounts.callLoginMethod({
    methodArguments: [loginRequest],
    userCallback: callback
  });
};

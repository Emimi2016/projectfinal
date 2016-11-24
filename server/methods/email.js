Meteor.startup(function () {
  // 1. Set up stmp
  //   your_server would be something like 'smtp.gmail.com'
  //   and your_port would be a number like 25
/*
  process.env.MAIL_URL = 'smtp://' +
    encodeURIComponent('carelksmtp') + ':' +
    encodeURIComponent('BTS2K6:integ') + '@' +
    encodeURIComponent('smtp.sendgrid.net') + ':' + 587;
  */
  process.env.MAIL_URL = 'smtp://carelksmtp:cvbn1234@smtp.sendgrid.net:587';


   // 2. Format the email
  //-- Set the from address
  Accounts.emailTemplates.from = 'support@carelk.com';

  //-- Application name
  Accounts.emailTemplates.siteName = 'CareLK';

  //-- Subject line of the email.
  Accounts.emailTemplates.verifyEmail.subject = function(user) {
      console.log('verifyEmail.subject  ' + user);
    return 'Confirm Your Email Address for CareLk';
  };

  //-- Email text
  Accounts.emailTemplates.verifyEmail.text = function(user, url) {

      console.log('verifyEmail.text  ' + user + ' | ' + url);
    return 'Thank you for registering.  Please click on the following link to verify your email address: \r\n' + url;
  };
/*
  //-- Reset Subjet
  Accounts.resetPassword.subject = function(user, url) {
    return "Click this link to reset your password: /reset-password/" + myId;
  }

  //-- Reset URL
  Accounts.resetPassword.text = function(user, url) {
    return "Click this link to reset your password: /reset-password/" + myId;
  }*/
  Accounts.urls.resetPassword = function(token) {
    return Meteor.absoluteUrl('reset-password/' + token);
  };

  // 3.  Send email when account is created
  Accounts.config({
    sendVerificationEmail: true,
    forbidClientAccountCreation: true
  });

    Accounts.urls.verifyEmail = function (token) {
        return Meteor.absoluteUrl('verify-email/' + token);
    };

    Accounts.emailTemplates.enrollAccount.text = function (user, url) {
        url = url.replace('#/', '');
        return "Hello,\n"
        + "To start using the service, simply click the link below:\n\n"
        + url;
    };

    Meteor.methods({
    serverVerifyEmail: function(email, userId) {
        console.log("Email to verify:" +email + " | userId: "+userId);

        var errmsg = {
            reason: ''
        };

        try
        {
        // this needs to be done on the server.
        console.log("sendVerificationEmail: userId: "+userId);
                Accounts.sendVerificationEmail(userId, email);
        }
        catch (e) {
            errmsg.reason = e.message;
        }
       /* if (typeof callback !== 'undefined') {
        callback(errmsg.reason !== '' ? errmsg : undefined);
        }*/

            return {err:errmsg.reason, status: errmsg.reason == '' };
    }
    });
});

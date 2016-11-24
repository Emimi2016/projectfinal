// Do not forget to add the email package: $ meteor add email
// and to configure the SMTP: https://gist.github.com/LeCoupa/9879221

RESET_PASSWORD = 'resetPassword';

Template.ForgotPassword.onRendered(function(){
    console.log('Template.ForgotPassword.onRendered');
    $("#forgotPasswordForm").validate({
        rules: {
            email: {
                email: true,
                required: false,
                minlength: 3
            }
        },
        messages: {
            email: {
                required: "(Please enter an email)",
                minlength: "The mininum length for username is 3 characters"
            }
        },
        submitHandler: function(form) {
            console.log('call submitHandler');
            event.preventDefault();
            submitForgotPasswordForm(form);
        },
        errorPlacement: function(error, element) {
            console.log('errorPlacement');
            $( element )
                .closest( "form" )
                .find( "label[for='" + element.attr( "id" ) + "']" )
                .append( error );
        },
        errorElement: "span",
    });
});

function submitForgotPasswordForm(form)
{
    email = $('#forgotPasswordEmail').val().toLowerCase();
    console.log('forgotPasswordForm ' + email);

      Accounts.forgotPassword({email: email}, function(err) {
        if (err) {
          if (err.message === 'User not found [403]') {
            swal({ title: 'Some error occured',
                                    text: 'This email does not exist.',
                                    allowEscapeKey:false,
                                    closeOnCancel:false,
                                    closeOnConfirm: true,
                                    type:'error'
                                });
          } else {
            swal({ title: 'Some error occured',
                                    text: 'We are sorry but something went wrong.',
                                    allowEscapeKey:false,
                                    closeOnCancel:false,
                                    closeOnConfirm: true,
                                    type:'error'
                                });
          }
        } else {
            swal({ title: 'Email sent',
                                    text: 'Check your mailbox.',
                                    allowEscapeKey:false,
                                    closeOnCancel:false,
                                    closeOnConfirm: true,
                                    type:'info'
                                });
            Router.go('login');
        }
      });
}

// Account reset password: save the account reset password token
if (Accounts._resetPasswordToken) {
    console.log('_resetPasswordToken ' +  Accounts._resetPasswordToken);
    console.log('_resetPasswordToken 2 ' +  Session.get('resetPassword'));
 // Session.set(RESET_PASSWORD, Accounts._resetPasswordToken);
}

// Get the sesion reset password token
Template.resetpassword.helpers({
 resetPassword: function(){
  return Accounts._resetPasswordToken;
 }
});

Template.resetpassword.onRendered(function(){
      $("#resetPasswordForm").validate({
        rules: {
            resetPasswordPassword: {
                required: true,
                minlength: 8
            },
            resetPasswordPasswordConfirm: {
                required: true,
                minlength: 8,
                equalTo: '#resetPasswordPassword'
            },
        },
        messages: {
            resetPasswordPassword: {
                required: "(Please enter your password)",
                minlength: "The mininum length for password is 8 characters"
            },
            resetPasswordPasswordConfirm: {
                required: "(Please enter your password)",
                minlength: "The mininum length for password is 8 characters"
            },
        },
        submitHandler: function(form) {
            console.log('call resetPasswordForm ');
            event.preventDefault();
            submitResetPasswordForm(form);
        },
        errorPlacement: function(error, element) {
            console.log('errorPlacement');
            $( element )
                .closest( "form" )
                .find( "label[for='" + element.attr( "id" ) + "']" )
                .append( error );
        },
        errorElement: "span",
    });
});

function submitResetPasswordForm(form) {
    password = $('#resetPasswordPassword').val(),
    passwordConfirm = $('#resetPasswordPasswordConfirm').val();

    console.log('submitResetPasswordForm ' + Session.get(RESET_PASSWORD));

    Accounts.resetPassword(Session.get(RESET_PASSWORD), password, function(err) {
        if (err) {
          debugger;
            console.log('We are sorry but something went wrong.');
            swal({ title: 'Some error occured',
                                    text: 'We are sorry but something went wrong.',
                                    allowEscapeKey:false,
                                    closeOnCancel:false,
                                    closeOnConfirm: true,
                                    type:'error'
                                });
        } else {
            console.log('Your password has been changed. Welcome back!');
            swal({ title: 'Password changed',
                                    text: 'Your password has been changed. Welcome back!.',
                                    allowEscapeKey:false,
                                    closeOnCancel:false,
                                    closeOnConfirm: true,
                                    type:'info'
                                });
            Session.set(RESET_PASSWORD, null);
            Router.go('login');
        }
    });
}

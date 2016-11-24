Template.changePassword.onRendered(function(){

    $('#confidential-info').validate({
        rules: {
            oldpassword: {
                required: true,
                minlength: 8
            },
            newpassword: {
                required: true,
                minlength: 8
            },
            newpassword2: {
                required: true,
                minlength: 8,
                equalTo: '#newpassword'
            },
        },
        messages: {
            oldpassword: {
                required: "(Please enter your password)",
                minlength: "The mininum length for password is 8 characters"
            },
            newpassword: {
                required: "(Please enter your password)",
                minlength: "The mininum length for password is 8 characters"
            },
            newpassword2: {
                required: "(Please enter your password)",
                minlength: "The mininum length for password is 8 characters"
            },
        },
        submitHandler: function(form) {
            console.log('call submitHandler');
            event.preventDefault();
            submitConfidentialForm(form);
        },
    });

});

function submitConfidentialForm(form) {
    'use strict';

    var oldpassword = form['oldpassword'].value;
    var newpassword = form['newpassword'].value;

    Meteor.call('checkPassword', oldpassword, function(err, result) {
      if (result) {
          
           Accounts.changePassword(oldpassword, newpassword, function(error) {
                if (error) {
                swal({ title: 'Some error occured',
                                text: error.reason,
                                allowEscapeKey:false,
                                closeOnCancel:false,
                                closeOnConfirm: true,
                                type:'error'
                            });
            } else {
                swal({ title: 'Create succeeded',
                        text: 'Your password has been changed.',
                        allowEscapeKey:false,
                        closeOnCancel:false,
                        closeOnConfirm: true,
                        type:'info'
                    });
            }
           });
      }
      else 
      {
          swal({ title: 'Change password failed',
                        text: 'Your old password must match the current password.',
                        allowEscapeKey:false,
                        closeOnCancel:false,
                        closeOnConfirm: true,
                        type:'error'
                    });
      }
    });
}

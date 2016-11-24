Template.register.onRendered(function() {
    //console.log('Template.register.onRendered');
    // Initialize iCheck plugin
    /*   $('.i-checks').iCheck({
           checkboxClass: 'icheckbox_square-green',
           radioClass: 'iradio_square-green',
       });*/

        $('body').css('height', 'auto');

    $("#registerForm").validate({
        rules: {
            password: {
                required: true,
                minlength: 8
            },
            password2: {
                required: true,
                minlength: 8,
                equalTo: '#password'
            },
            email: {
                required: true,
                email: true,
                minlength: 3
            },
            skype: {
                required: true,
                minlength: 3
            },
            username: {
                required: true,
                url: false,
                minlength: 3
            },
            firstname: {
                required: true,
                url: false,
            },
            lastname: {
                required: true,
                url: false,
            },
            mobilenumber: {
                required: true,
                url: false
            },
            termsofuse: {
                required: true
            }
        },
        messages: {
            password: {
                required: "(Please enter your password)",
                minlength: "The mininum length for password is 8 characters"
            },
            password2: {
                required: "(Please enter your password)",
                minlength: "The mininum length for password is 8 characters"
            },
            email: {
                required: "The email is required",
                minlength: "This is custom message for min length"
            },
            username: {
                required: "The username is required",
                minlength: "This is custom message for min length"
            },
            firstname: {
                required: "The firstname is required",
            },
            lastname: {
                required: "The lastname is required",
            },
            mobilenumber: {
                required: "The mobile number is required",
            },
            termsofuse: {
                required: "(Please accept the terms of use)"
            }
        },
        cancelSubmit: function() {
        },
        submitHandler: function(form) {
            var user = {
                "email": form['email'].value,
                "skype": form['skype'].value,
                "username": form['username'].value,
                "password": form['password'].value,
                "fname": $('#firstname').val(),
                "lname": $('#lastname').val(),
                "mobile": $('#mobilenumber').val(),
                "identity": $('input[name=profile]:checked', '#registerForm').val()
            }
            Meteor.call('register', user, function(err, data) {
                if (!data || !data.status) {
                    Command: toastr["error"]("Register failed", data.err)
                    toastr.options = {
                    "closeButton": false,
                    "debug": false,
                    "newestOnTop": false,
                    "progressBar": false,
                    "positionClass": "toast-top-center",
                    "preventDuplicates": false,
                    "onclick": null,
                    "showDuration": "300",
                    "hideDuration": "1000",
                    "timeOut": "5000",
                    "extendedTimeOut": "1000",
                    "showEasing": "swing",
                    "hideEasing": "linear",
                    "showMethod": "fadeIn",
                    "hideMethod": "fadeOut"
                    }
                    console.log('register KO ' + data.err);
                }
                else {
                    console.log('register OK - status ' + data.status);
                    if (data.status) {

                        console.log('SendVerifyEmail ' + data.status);

                        Meteor.call('SendVerifyEmail', user.email, data.id, function(err1, data1) {

                            if (!data1 || !data1.status) {
                                swal({ title: 'Account Creation Successful',
                                    text: 'Your account has been created.',
                                    allowEscapeKey:false,
                                    closeOnCancel:false,
                                    closeOnConfirm: true,
                                    type:'success'
                                });
                            }
                            else {
                                console.log('checkemail ');
                                Router.go('checkemail');
                            }
                        });
                  }
                }
            });
        },
        errorPlacement: function(error, element) {
            $(element)
                .closest("form")
                .find("label[for='" + element.attr("id") + "']")
                .append(error);
        },
        errorElement: "span",
    });
});


Template.register.events({
    'click .cancel': function(event) {

        event.preventDefault();
        Router.go('login');
    }
});

/*
Template.register.events({
  'submit form': function() {
      console.log('call register');

       var user = {
             "username": "test",
                "password": "password",
                "identity": 1
        }

    Meteor.call('register', user, function(err, data) {
         if(err) {
            console.log(err);
        }
        else {
            console.log('register OK');
            Accounts.createUser({
                email: user.username,
                password: user.password
            });
        }
        });
  }
});*/

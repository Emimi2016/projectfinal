Template.login.onRendered(function(){
    
            console.log(' moment  ' +  moment());  
     // Initialize iCheck plugin
    try{
        $('.i-checks').iCheck({
            checkboxClass: 'icheckbox_square-green',
            radioClass: 'iradio_square-green'
        });
    }catch (error){

    }

    
    $("#loginForm").validate({
        rules: {
            password: {
                required: true,
                minlength: 8
            },
            username: {
                required: true,
                url: false,
                minlength: 3 
            },
            email: {
                required: false
            }
        },
        messages: {
            password: {
                required: "(Please enter your password)",
                minlength: "The mininum length for password is 8 characters"
            },
            username: {
                required: "(Please enter a username)",
                minlength: "The mininum length for username is 3 characters"
            }
        },
        submitHandler: function(form) {
            console.log('call submitHandler');
            submitLoginForm(form);
            //   form.submit();
        },
        errorPlacement: function(error, element) {
            $( element )
                .closest( "form" )
                .find( "label[for='" + element.attr( "id" ) + "']" )
                .append( error );
        },
        errorElement: "span",
    });
});

function submitLoginForm(form)
{
    console.log('call submitLoginForm');
     var user = {
                    "username": form['username'].value,
                        "password": form['password'].value,
                        "identity": 0
                };
              
    Meteor.call('loginuser', user, function(err, data) {
        if(data.status == false) {
            console.log('login KO ' + data.err);
                //$( '#form-error' ).text();
                $( '#form-error' ).html( 'Wrong login or password.' );
                $( '#form-error' ).show();
        }
        else {
                Meteor.loginWithPassword(user.username, user.password, function(error) {
                    if(error){
                        swal({ title: 'Some error occured', 
                            text: error.reason, 
                            allowEscapeKey:false, 
                            closeOnCancel:false,  
                            closeOnConfirm: true,
                            type:'error'
                          });
                    } 
                    else
                    {
                        Router.go('dashboard');   
                    }    
                });
                
        }
            $(this).css({'cursor' : 'default'});
    });
}

Template.login.events({
    'click #facebook-login': function(event) {
        if (event !== undefined)
        {
            event.preventDefault();    
        }
        
        Meteor.loginWithFacebook({}, function(err){
            if (err) {
                console.log('loginWithFacebook failed ' + err);
                throw new Meteor.Error("Facebook login failed");
            }
            else{
                Meteor.call('loginWithSocial', function() {
                    Router.go('dashboard');    
                });
            }
        });
    },
    'click #google-login': function(event) {
        if (event !== undefined)
        {
            event.preventDefault();    
        }
        Meteor.loginWithGoogle ({}, function(err){
            if (err) {
                console.log('loginWithGoogle failed ' + err);
                throw new Meteor.Error("Google login failed");
            }
            else{
                Meteor.call('loginWithSocial', function() {
                   Router.go('dashboard'); 
                });  
            }
        });
       
    },
 
});
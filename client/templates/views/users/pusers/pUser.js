Template.pUser.onCreated(function() {
    var self = this;
});

Template.pUser.onRendered(function(){

    getPatientProfile();

    //     errorPlacement: function(error, element) {
    //         $( element )
    //             .closest( "form" )
    //             .find( "label[for='" + element.attr( "id" ) + "']" )
    //             .append( error );
    //     },
    //     errorElement: "span",
    // });

Template.pUser.helpers({

});

function getPatientProfile()
{
    console.log('call getpersodata');

    Meteor.call('getProfile', function(err, data) {
        if(data.status == false) {
                //$( '#form-error' ).text();
                $( '#form-error' ).html( 'Error happened.' );
                $( '#form-error' ).show();
        }
        else {
            if (data.status)
            {
                var profile = data.profile;
                var email = profile.email;

                $('#username').val(profile.username);
                $('#firstName').val(profile.fname);
                //$('#maidenname').val(profile.maidenname);
                $('#lastName').val(profile.lname);
                //$('#jobtitle').val(profile.jobtitle);
                if (profile.gender == "M" || profile.gender == "male")
                {
                $('#male').attr('checked', 'checked');
                }
                else
                {
                $('#female').attr('checked', 'checked');
                }
                $('#mobileNumber').val(profile.mobileNumber);
                $('#homeNumber').val(profile.homeNumber);
                $('#address').val(profile.address);
                $('#city').val(profile.city);
                $('#postalCode').val(profile.postalCode);
                $('#nhsNumber').val(profile.nhsNumber);
                $('#emergencyName').val(profile.emergencyName);
                $('#emergencyNumber').val(profile.emergencyNumber);
                $('#Skype').val(profile.Skype);
                /*
                $('select#address-country option[value="'+profile.country+'"]').prop('selected', true);
                $('#address2').val(profile.address2);
                $('#address-area').val(data.province);
                $('#phone').val(profile.phone);*/
                $('#email').val(profile.email);

            }
        }
    });
}

function submitLoginForm(form)
{
    console.log('call submitLoginForm');
     var persodata = {
                    //uniquepatientid: form['uniquepatientid'].value,
                    "fname": form['firstName'].value,
                    //"maidenname": form['maidenname'] ? form['maidenname'].value : '',
                    "lname": form['lastName'] ? form['lastName'].value : '',
                    //"jobtitle": '',
                    "gender": $('input[name=gender]:radio:checked').val(),
                    "dob": form['birthday_birth[year]'].value + '-' + form['birthday_birth[month]'].value + '-' + form['birthday_birth[day]'].value,
                    "mobileNumber": form['mobileNumber'] ? form['mobileNumber'].value : '',
                    "homeNumber": form['homeNumber'] ? form['homeNumber'].value : '',
                    "address": form['address'] ? form['address'].value : '',
                    "postalCode": form['postalCode'] ? form['postalCode'].value : '',
                    "city": form['city'] ? form['city'].value : '',
                    "emergencyPerson": form['emergencyName'] ? form['emergencyName'].value : '',
                    "emergencyNumber": form['emergencyNumber'] ? form['emergencyNumber'].value : '',
                    //"fileName": form['fileName'] ? form['fileName'].value : '',
                    /*"address1": form['address1'] ? form['address1'].value : '',
                    "address2": form['address2'] ? form['address2'].value : '',
                    "province": form['address-area'] ? form['address-area'].value : '',
                    "city": form['address-city'] ? form['address-city'].value : '',
                    "postcode": form['address-zip'] ? form['address-zip'].value : '',
                    "country": form['address[country]'] ? form['address[country]'].value : '',
                    "phone": form['phone'] ? form['phone'].value : '',*/
                    "email": form['email'] ? form['email'].value : '',
                    "skype": form['skype'] ? form['skype'].value : '',
                };

    Meteor.call('createOrUpdateProviderProfile', persodata, function(err, data) {
        if(data.status == false) {

             swal({ title: 'Some error occured',
                            text: data.err,
                            allowEscapeKey:false,
                            closeOnCancel:false,
                            closeOnConfirm: true,
                            type:'error'
                          });

            if (data.err.indexOf('Token has expired')!=-1)
            {
                Router.go('login');
            }

            console.log('create persodata KO ' + data.err);
                //$( '#form-error' ).text();
                $( '#form-error' ).html( 'Error happened.' );
                $( '#form-error' ).show();
        }
        else {
            console.log('create OK - status' + data.status);
                swal({ title: 'Create succeeded',
                    text: 'Your personal data has been modified.',
                    allowEscapeKey:false,
                    closeOnCancel:false,
                    closeOnConfirm: true,
                    type:'info'
                });

        }
            $(this).css({'cursor' : 'default'});
    });
}
});

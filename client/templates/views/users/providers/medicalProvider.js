Template.medicalProvider.onRendered(function(){

    var user = Meteor.user();

    getProfile();


    /*
    $("#birthday").birthdayPicker({
					"defaultDate":  user.persodata == undefined || user.persodata.dob == undefined ? moment() : user.persodata.dob,
                    placeholder: true,
					"maxAge": 100,
					"monthFormat":"long",
					"sizeClass": "span3"
				});
    $('#datepicker').datepicker();
    $('#datapicker2').datepicker();
    $('.input-group.date').datepicker();
    $('.input-daterange').datepicker();

    $('#gender').editable({
        prepend: "not selected",
        source: [
            {value: 1, text: 'Male'},
            {value: 2, text: 'Female'}
        ],
        display: function(value, sourceData) {
            var colors = {"": "gray", 1: "green", 2: "blue"},
                elem = $.grep(sourceData, function(o){return o.value == value;});

            if(elem.length) {
                $(this).text(elem[0].text).css("color", colors[value]);
            } else {
                $(this).empty();
            }
        }
    });*/
/*
    $('#btn-identity').on('click', function () {
    $('#identity').trigger('click');
    });*/
    /*
    var inputs = document.querySelectorAll( '.inputfile' );
	Array.prototype.forEach.call( inputs, function( input )
	{
		var label	 = input.nextElementSibling,
			labelVal = label.innerHTML;
		input.addEventListener( 'change', function( e )
		{
			var fileName = '';
			if( this.files && this.files.length > 1 )
				fileName = ( this.getAttribute( 'data-multiple-caption' ) || '' ).replace( '{count}', this.files.length );
			else
				fileName = e.target.value.split( '\\' ).pop();

			if( fileName )
                $('#fileName').val(fileName);
				//label.querySelector( 'span' ).innerHTML = fileName;
			else
				label.innerHTML = labelVal;
		});

		// Firefox bug fix
		input.addEventListener( 'focus', function(){ input.classList.add( 'has-focus' ); });
		input.addEventListener( 'blur', function(){ input.classList.remove( 'has-focus' ); });
	});*/


    jQuery.validator.addMethod("notEqualTo", function(value, element, param) {
    return this.optional(element) || value != param;
    }, "Please specify a different (non-default) value");

    $("#perso-provider").validate({
      rules: {
           "birthday_birth[year]": {
               required: true,
               notEqualTo: "0"
           },
           "birthday_birth[month]": {
               notEqualTo: "0"
           },
           "birthday_birth[day]": {
               notEqualTo: "0"
           }
       }, /*
        messages: {
            "birthday_birth[month]": {
                notEqual: "Please enter a valid month."
            },
            "birthday_birth[year]": {
                notEqual: "Please enter a valid year."
            },
            "birthday_birth[day]": {
                notEqual: "Please enter a valid day."
            }
        },*/
        submitHandler: function(form) {
            console.log('call submitHandler');
            submitLoginForm(form);
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

Template.medicalProvider.helpers({
  user: function() {
     var user = Meteor.user();
     return user;
  }
});

function getProfile()
{
    var user = Meteor.user();


    if (user.persodata != undefined)
    {
        return;
    }


    Meteor.call('getProfile', user, function(err, data) {
        if(data.status == false) {
                //$( '#form-error' ).text();
                $( '#form-error' ).html( 'Error happened.' );
                $( '#form-error' ).show();
        }
        else {
            if (data.status)
            {
                var pUser = Meteor.user();

                $('#name').val(pUser.persodata.fname);
                $('#surname').val(pUser.persodata.lname);
                $('#maidenname').val(pUser.persodata.maidenname);
                $('#jobtitle').val(pUser.persodata.jobtitle);
                if (pUser.persodata.gender == "M")
                {
                $('#male').attr('checked', 'checked');
                }
                else
                {
                $('#female').attr('checked', 'checked');
                }
                if (pUser.persodata.dob.length > 0)
                {
                    var dateOfBirth = pUser.persodata.dob.split("-");
                     $('select.birthMonth option[value="'+ parseInt(dateOfBirth[1]) +'"]').prop('selected', true);
                     $('select.birthDate option[value="'+ parseInt(dateOfBirth[2]) +'"]').prop('selected', true);
                     $('select.birthYear option[value="'+ parseInt(dateOfBirth[0]) +'"]').prop('selected', true);
                }
                $('select#address-country option[value="'+pUser.persodata.country+'"]').prop('selected', true);

                if (pUser.persodata.province == 'Beijing')
                {
                    $('select#address-area option[value="BJ"]').prop('selected', true);
                }
                else if (pUser.persodata.province == 'Shanghai')
                {
                    $('select#address-area option[value="SH"]').prop('selected', true);
                }
                else if (pUser.persodata.province == 'Guangdong')
                {
                    $('select#address-area option[value="GD"]').prop('selected', true);
                }
                else if (pUser.persodata.province == 'Tianjin')
                {
                    $('select#address-area option[value="TJ"]').prop('selected', true);
                }
                else if (pUser.persodata.province == 'Hebei')
                {
                    $('select#address-area option[value="HE"]').prop('selected', true);
                }
                else if (pUser.persodata.province == 'Shanxi')
                {
                    $('select#address-area option[value="SX"]').prop('selected', true);
                }
                else if (pUser.persodata.province == 'Inner Mongolia')
                {
                    $('select#address-area option[value="NM"]').prop('selected', true);
                }
                else if (pUser.persodata.province == 'Liaoning')
                {
                    $('select#address-area option[value="LN"]').prop('selected', true);
                }
                else if (pUser.persodata.province == 'Jilin')
                {
                    $('select#address-area option[value="JL"]').prop('selected', true);
                }
                else if (pUser.persodata.province == 'Heilongjiang')
                {
                    $('select#address-area option[value="HL"]').prop('selected', true);
                }
                else if (pUser.persodata.province == 'Jiangsu')
                {
                    $('select#address-area option[value="JS"]').prop('selected', true);
                }
                else if (pUser.persodata.province == 'Zhejiang')
                {
                    $('select#address-area option[value="ZJ"]').prop('selected', true);
                }
                else if (pUser.persodata.province == 'Anhui')
                {
                    $('select#address-area option[value="AH"]').prop('selected', true);
                }
                else if (pUser.persodata.province == 'Fujian')
                {
                    $('select#address-area option[value="FJ"]').prop('selected', true);
                }
                else if (pUser.persodata.province == 'Jiangxi')
                {
                    $('select#address-area option[value="JX"]').prop('selected', true);
                }
                else if (pUser.persodata.province == 'Shandong')
                {
                    $('select#address-area option[value="SD"]').prop('selected', true);
                }
                else if (pUser.persodata.province == 'Henan')
                {
                    $('select#address-area option[value="HA"]').prop('selected', true);
                }
                else if (pUser.persodata.province == 'Hubei')
                {
                    $('select#address-area option[value="HB"]').prop('selected', true);
                }
                else if (pUser.persodata.province == 'Hunan')
                {
                    $('select#address-area option[value="HN"]').prop('selected', true);
                }
                else if (pUser.persodata.province == 'Guangxi')
                {
                    $('select#address-area option[value="GX"]').prop('selected', true);
                }
                else if (pUser.persodata.province == 'Hainan')
                {
                    $('select#address-area option[value="HI"]').prop('selected', true);
                }
                else if (pUser.persodata.province == 'Chongqing')
                {
                    $('select#address-area option[value="CQ"]').prop('selected', true);
                }
                else if (pUser.persodata.province == 'Sichuan')
                {
                    $('select#address-area option[value="SC"]').prop('selected', true);
                }
                else if (pUser.persodata.province == 'Guizhou')
                {
                    $('select#address-area option[value="GZ"]').prop('selected', true);
                }
                else if (pUser.persodata.province == 'Yunnan')
                {
                    $('select#address-area option[value="YN"]').prop('selected', true);
                }
                else if (pUser.persodata.province == 'Tibet')
                {
                    $('select#address-area option[value="XZ"]').prop('selected', true);
                }
                else if (pUser.persodata.province == 'Shaanxi')
                {
                    $('select#address-area option[value="SN"]').prop('selected', true);
                }
                else if (pUser.persodata.province == 'Gansu')
                {
                    $('select#address-area option[value="GS"]').prop('selected', true);
                }
                else if (pUser.persodata.province == 'Qinghai')
                {
                    $('select#address-area option[value="QH"]').prop('selected', true);
                }
                else if (pUser.persodata.province == 'Ningxia Hui')
                {
                    $('select#address-area option[value="NX"]').prop('selected', true);
                }
                else if (pUser.persodata.province == 'Xinjiang Uyghur')
                {
                    $('select#address-area option[value="XJ"]').prop('selected', true);
                }

                $('#address1').val(pUser.persodata.address);
                $('#address-city').val(pUser.persodata.city);
                $('#province').val(pUser.persodata.province);
                $('#address-zip').val(pUser.persodata.postcode);
                $('#email').val(pUser.persodata.email);
                $('#phone').val(pUser.persodata.phone);
                $('#scat').val(pUser.persodata.scat);
                $('#subscat').val(pUser.persodata.subscat);
                $('#stype').val(pUser.persodata.stype);
                console.log('lname '+ pUser.persodata.lname);
                console.log('fname ' + pUser.persodata.fname);
                console.log('address ' + pUser.persodata.address);
                console.log($('#address1').val());
                $('#address1').attr("value", pUser.persodata.address);

    $('#perso-provider').addressfield({
    json: '/addressfield.min.json',
    fields: {
        country: '#address-country',
        locality: '#address-locality-fields',
        localityname: '#address-city',
      //  thoroughfare: '#address1',
      //  premise: '#address2',
        administrativearea: '#address-area',
        postalcode: '#address-zip'
    },
    });
            }
        }
            $(this).css({'cursor' : 'default'});
    });
}


function submitLoginForm(form)
{
    console.log('call submitLoginForm');

    var user = Meteor.user();

    console.log('country ' + form['address[country]'].value);

     var persodata = {
                    id: user.persodata.id,
                    identity: user.persodata.identity,
                    lastlogin: user.persodata.lastlogin,
                    "fname": form['name'].value,
                        "maidenname": form['maidenname'].value,
                        "lname": form['surname'].value,
                        "jobtitle": form['jobtitle'].value,
                        "gender": form['gender'].value,
                        "dob": form['birthday_birth[year]'].value + '-' + form['birthday_birth[month]'].value + '-' + form['birthday_birth[day]'].value,
                        "fileName": form['fileName'].value,
                        "address": form['address1'].value,
                        "province": form['address-area'].value,
                        "city": form['address-city'].value,
                        "postcode": form['address-zip'].value,
                        "country": form['address[country]'].value,
                        "phone": form['phone'].value,
                        "email": form['email'].value,
                        "scat": user.persodata.scat != undefined ? user.persodata.scat : '',
                        "subscat": user.persodata.subscat != undefined ? user.persodata.subscat : '',
                        "stype": user.persodata.stype != undefined ? user.persodata.stype : ''
                };

    persodata.province = persodata.province != undefined && persodata.province != '' ? persodata.province : persodata.city;

    user.persodata = persodata;

    Meteor.call('createOrUpdateProviderProfile', user, function(err, data) {
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
            console.log('create OK - status' + data.statusCode);
            if (data.statusCode == 200 || data.statusCode == 201)
            {
                swal({ title: 'Create succeeded',
                    text: 'Your profile has been modified',
                    allowEscapeKey:false,
                    closeOnCancel:false,
                    closeOnConfirm: true,
                    type:'info'
                });
            }
        }
            $(this).css({'cursor' : 'default'});
    });
}

Template.profile.onRendered(function(){

    // common controls intialization
    $('#perso-provider').addressfield({
    json: '/addressfield.min.json',
    fields: {
        country: '#address-country',
        locality: '#address-locality-fields',
        localityname: '#address-city',
        administrativearea: '#address-area',
        postalcode: '#address-zip'
    },
    });
    
    $('#datepicker').datepicker();
    $('#datapicker2').datepicker();
    $('.input-group.date').datepicker();
    $('.input-daterange').datepicker();
    
    // Ask user geo location authorization
    if(navigator.geolocation) {
       navigator.geolocation.getCurrentPosition(affichePosition,erreurPosition);
    } 
    
    var user = Meteor.user();
    
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
    });

    $('#btn-identity').on('click', function () {
    $('#identity').trigger('click');
    });
    
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
	});
    
    jQuery.validator.addMethod("notEqualTo", function(value, element, param) {
    return this.optional(element) || value != param;
    }, "Please specify a different (non-default) value");
    
});

Template.profile.helpers({
  user: function() {
     var user = Meteor.user();
     return user;
  }
});



// Fonction de callback en cas de succès
function affichePosition(position) {

    var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

    var mapOptions1 = {
        center:latlng,
        navigationControlOptions: {style: google.maps.NavigationControlStyle.SMALL},
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        zoom: 15
    };
    
    // Get all html elements for map
    var mapElement1 = document.getElementById('map1');

    // Create the Google Map using elements
    var map1 = new google.maps.Map(mapElement1, mapOptions1);

    // Ajout d'un marqueur à la position trouvée
    var marker = new google.maps.Marker({
        position: latlng,
        map: map1,
        title:"You are here"
    });

}



// Fonction de callback en cas d’erreur
function erreurPosition(error) {
}

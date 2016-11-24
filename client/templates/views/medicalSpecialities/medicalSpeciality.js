Template.speciality.onCreated(function() {
	this.subscribe('medicalSpeciality');
	this.subscribe('medicalSubSpeciality');
});

Template.speciality.onRendered(function() {
    
    // Initialize dataTables plugin
    $('#medicalSpecialities').dataTable({
        iDisplayLength: 25
    });

});

Template.speciality.helpers({
	specialityName:function() {
		return Router.go('specialityName');
	},
	subSpeciality:function(){
		return Product.find();
	},
	isCheckingOut:function(){
		console.log('isCheckingOut : ');
		return Session.equals('isCheckingOut', true);
	}
});
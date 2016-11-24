Template.verified.onRendered(function() {
    console.log('Template.verified.onRendered');
    
    
    $("#verifiedForm").validate({
        submitHandler: function(form) {
            event.preventDefault();
            Router.go('login');
        }
    });
});
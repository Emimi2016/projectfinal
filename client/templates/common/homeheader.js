Template.homeheader.onRendered(function() {

    $(".scroll").click(function(event) {
        event.preventDefault();
        $('html,body').animate({
            scrollTop: $(this.hash).offset().top
        }, 1000);
    });

    $().UItoTop({
        easingType: 'easeOutQuart'
    });
});

Template.homeheader.helpers({
    'learnMore': function() {
        if (Router.current().route.getName() === 'learnMore') {
            return true;
        } else {
            return false;
        }
    }
});

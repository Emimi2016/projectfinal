/*
Template.registerHelper('ispUser', (user) => {
    if (user != undefined && user.persodata != undefined) {
        var persodata = user.persodata;
        console.log('call ispUser ' + persodata.identity);
        return user.persodata.identity == 1;
    }

    return true;
});
*/
Template.registerHelper('isPatient', function() {
    var user = Meteor.user();
    if (user!== null && user !== undefined)
    {
        if (user.persodata != undefined) {
            return user.persodata.identity == 1;   
        }    
    }
    else return false;
});

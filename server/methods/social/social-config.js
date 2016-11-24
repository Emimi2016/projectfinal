
Meteor.startup(function () {

 ServiceConfiguration.configurations.remove({
    service: 'facebook'
});
 /* CareLk on AZURE */
/*
ServiceConfiguration.configurations.insert({
    service: 'facebook',
    appId: '813797702082221',
    secret: '8952106707decd31306c7f6b1640f6fe'
});*/

/* CareLk Dev on Azure */ 

ServiceConfiguration.configurations.insert({
    service: 'facebook',
    appId: '816897561772235',
    secret: 'b2a7f0632cd7131add2e3d3876af374a'
});

ServiceConfiguration.configurations.remove({
  service: 'google'
});
 
ServiceConfiguration.configurations.insert({
  service: 'google',
  clientId: '28290429215-ar000qbnjpb8p7tth7nv3u6r55sagb7b.apps.googleusercontent.com',
  secret: 'u2ztgVPQh-lz2tGfpfS2a7YZ',
  
});

});


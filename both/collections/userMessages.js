// Meteor.startup(function(){
 UserMessages = new Mongo.Collection("usermessages");


 UserMessages.before.insert(function (doc){
  doc.createAt = Date.now();
  doc.rating = 0;
 });

 UserMessages.helpers({
  from:function(){
   return Meteor.userId();
  }
 });
// });


/*
var attachmentStore = new FS.Store.GridFS("attachments");

AttachmentStore = new FS.Collection("attachments", {
 stores: [attachmentStore]
});

AttachmentStore.deny({
 insert: function(){
 return false;
 },
 update: function(){
 return false;
 },
 remove: function(){
 return false;
 },
 download: function(){
 return false;
 }
 });

AttachmentStore.allow({
 insert: function(){
 return true;
 },
 update: function(){
 return true;
 },
 remove: function(){
 return true;
 },
 download: function(){
 return true;
 }
});*/

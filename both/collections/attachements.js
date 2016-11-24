attachements = new FS.Collection("attachements", {
  stores: [new FS.Store.GridFS("attachements")]
});

attachements.allow({
  insert: function(userId, doc){
    return true;
  },
  update: function(userId, doc, fieldNames, modifier) {
    return true;
  },
  download: function(){
    return true;
  },
  fetch: null
})

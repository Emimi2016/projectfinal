 Labels = new Mongo.Collection("labels");

Labels.allow({
    insert: function (userId,doc) {
      /* user and doc checks ,
      return true to allow insert */
      return true; 
    },
     update: function(userId, doc){
    return true;
  },
  remove: function (userId, docs){
    return true
  }
  });

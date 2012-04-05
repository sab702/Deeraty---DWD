// export Schemas to web.js
module.exports.configureSchema = function(Schema, mongoose) {
    
    // Comment - is an embedded document for BlogPost
    Comments = new Schema({
      name      : String
    , text      : String
    , date      : { type: Date, default: Date.now }
    });
    
    // Idea - 
    var Idea = new Schema({
      idea     : String
    , good     : String
    , type     : String
    , name     : String
    , email    : String
    , urlslug  : String
    , date      : { type: Date, default: Date.now }
    , comments  : [Comments]
    , author      : {
        name : String
        , email  : String
      }
    });


    // add schemas to Mongoose -- when have schemas defined, can turn them into models
    mongoose.model('Idea', Idea);
    mongoose.model('Comment', Comments);
};


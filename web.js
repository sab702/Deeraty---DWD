var express = require('express');
var ejs = require('ejs');

var app = express.createServer(express.logger());

var mongoose = require('mongoose'); // include Mongoose MongoDB library
var schema = mongoose.Schema; 

/************ DATABASE CONFIGURATION **********/
app.db = mongoose.connect(process.env.MONGOLAB_URI); //connect to the mongolabs database - local server uses .env file

// Include models.js - this file includes the database schema and defines the models used
require('./models').configureSchema(schema, mongoose);

// Define your DB Model variables
var Idea = mongoose.model('Idea');
/************* END DATABASE CONFIGURATION *********/


/*********** SERVER CONFIGURATION *****************/
app.configure(function() {
    
    /*********************************************************************************
        Configure the template engine
        We will use EJS (Embedded JavaScript) https://github.com/visionmedia/ejs
        
        Using templates keeps your logic and code separate from your HTML.
        We will render the html templates as needed by passing in the necessary data.
    *********************************************************************************/

    app.set('view engine','ejs');  // use the EJS node module
    app.set('views',__dirname+ '/views'); // use /views as template directory
    app.set('view options',{layout:true}); // use /views/layout.html to manage your main header/footer wrapping template
    app.register('html',require('ejs')); //use .html files in /views

    /******************************************************************
        The /static folder will hold all css, js and image assets.
        These files are static meaning they will not be used by
        NodeJS directly. 
        
        In your html template you will reference these assets
        as yourdomain.heroku.com/img/cats.gif or yourdomain.heroku.com/js/script.js
    ******************************************************************/
    app.use(express.static(__dirname + '/static'));
    
    //parse any http form post
    app.use(express.bodyParser());
    
    /**** Turn on some debugging tools ****/
    app.use(express.logger());
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

});
/*********** END SERVER CONFIGURATION *****************/
function convertToSlug(Text)
        {
            return Text
                .toLowerCase()
                .replace(/[^\w ]+/g,'')
                .replace(/ +/g,'-')
                ;
        }

Types=['beautify', 'improvement', 'infrastructure', 'greenery'];

app.get('/', function(request, response) {
  response.render('intro.html');
});


app.get('/about', function(request, response) {
 response.render('about.html');
});


app.get('/post_idea', function(request, response) {

// build the query
    var query = Idea.find({});
    query.sort('date',-1); //sort by date in descending order
    
    // run the query and display blog_main.html template if successful
    query.exec({}, function(err, allIdeas){
    
    var templateData = { 
        idea : allIdeas,
        pageTitle : 'Deeraty',
        //(if wanted to reference these images in code, would put templateData.images)images: personalImages,
    };

 response.render('post_idea.html', templateData);

 });
});


app.post('/post_idea', function(request, response) {
 
  console.log("Inside app.post('/')");
  console.log("form received and includes")
  console.log(request.body);  //this prints out to the console all the form info, but not writing it to Mongo yet. 
    
  newSlug = convertToSlug(request.body.type+request.body.name);  
  
    var IdeaData = { //making a new object of PersonalAdInfo -- we're just collecting all the data from the form into one chunk that we can then stick into the object, which is the model (which is defined in models.js. The schema is the combination of all the models).
   idea : request.body.idea,
   good : request.body.good,
   type : request.body.type,
   name : request.body.name,
   email : request.body.email,
   urlslug : newSlug,
 };
 
  var myIdea = new Idea(IdeaData); //creating a new instance of the Personal ad, using the data from the form and the model.
   myIdea.save();
   response.redirect('/my_idea/' + IdeaData.urlslug);

});

app.get('/my_idea/:urlslug', function(request, response) {
    
	//get a single idea using the requested urlslug
    Idea.findOne({urlslug : request.params.urlslug}, function(err, idea){
		
		var templateData = { 
			idea : idea,
			pageTitle : 'Deeraty',
			//(if wanted to reference these images in code, would put templateData.images)images: personalImages,
		};
		console.log(templateData);
	
		response.render('my_idea.html', templateData);

	}); //end of .findOne

});

app.get('/my_idea', function(request, response) {
    
	//get a single idea using the requested urlslug
    Idea.findOne({urlslug : request.params.urlslug}, function(err, idea){
		
		var templateData = { 
			idea : idea,
			pageTitle : 'Deeraty',
			//(if wanted to reference these images in code, would put templateData.images)images: personalImages,
		};
		console.log(templateData);
	
		response.render('my_idea.html', templateData);

	}); //end of .findOne

});

app.get('/all_ideas', function(request, response) {

 // build the query
    var query = Idea.find({});
    query.sort('date',-1); //sort by date in descending order
    
    // run the query and display blog_main.html template if successful
    query.exec({}, function(err, allIdeas){
    
    var templateData = { 
        idea : allIdeas,
        pageTitle : 'Afkarna',
        //(if wanted to reference these images in code, would put templateData.images)images: personalImages,
    };

    response.render("all_ideas.html",templateData);
 }); // end of find all

});

app.get('/data/all', function(request, response) {
    
    // define the fields you want to include in your json data
    includeFields = ['idea','good', 'type' ,'urlslug','date', 'name', 'email' ]

    // query for all blog
    queryConditions = {}; //empty conditions - return everything
    var query = Idea.find( queryConditions, includeFields); //Model, or name of Schema

    query.sort('date',-1); //sort by most recent
    query.exec(function (err, allIdeas) {

        // render the card_form template with the data above
        jsonData = {
          'status' : 'OK',
          'ideas' : allIdeas
        }

        response.json(jsonData);
    });
});

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
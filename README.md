#Deeraty#

This is the code for [deeraty.herokuapp.com](deeraty.herokuapp.com), which is very much a work-in-progress.
The site allows users to submit suggested changes to their neighborhoods by toggling them to a map. I use the Google Maps API for this.
(And for now, haven't yet figure out the user-editable markers.)

Also, for more information on the [Google Maps API go here] (https://developers.google.com/maps/documentation/javascript/tutorial). Maybe you'll have better luck than I did!

This app is written in [NodeJS](http://nodejs.org/) (a form of JavaScript), uses MongoDB for databases and is launched on Heroku.

The dependencies that this code uses are in the package.json file.

## Get the code

###Download Zip file

In terminal run the following commands in this directory to create the Git repository

	git init
	git add .
	git commit -m "init commit"
	.gitignore

Create .gitignore file. Place the following text into the file and save.

	node_modules
	.env

###Install Node Module Dependencies
Install all the Node dependencies listed in package.json run the following command in Terminal

	npm install

###Deploy to Heroku
To deploy to Heroku and use the Heroku Add-on services we need to have an App created. Follow the instructions [here] (http://devcenter.heroku.com/articles/node-js)

Install Heroku toolbelt if you do not already have it installed.
Create a new App on Heroku with the following command

	heroku create --stack cedar
	
This creates a new App on Heroku and adds a remote path to your Git repository.

##Add and configure MongoLabs
###Add the MongoLabs add-ons

To add MongoLabs as your MongoDB provider run the following command in terminal. This will add the free starter plan MongoLabs offers to Heroku users. Be sure you have [verified your Heroku account] (http://www.heroku.com/verify)

	heroku addons:add mongolab:starter


Next, we need to get the username, password and database URI that MongoLabs has supplied us. Heroku keeps this in the a configuration file. Run the following,

	heroku config | grep MONGOLAB_URI

This will return your MongoLabs connection string

	MONGOLAB_URI => mongodb://username:password@host:port/database
	
###Create environment configuration file

We need to create a new file name .env this will hold the MongoLabs information. This will allow you to use the Environment variables in your code, this is good for keeping your username and password out of your code.

Copy the string from the previous Terminal command, copy all text after => . It should look similar to this,

	mongodb://username:password@host:port/database
	
In your .env file, create a variable for MONGOLAB_URI= append it with the string you copied

MONGOLAB_URI=mongodb://username:password@host:port/database
Save the file.

You can access environment variables in your NodeJS code, for example in web.js as follows,

	process.env.MONGOLAB_URI // this is the same as manually entering 'mongodb://username:password@host:port/database'

###Mongoose - MongoDB node module
I use Mongoose library to connect to the database. A file, called models.js, includes the data definitions or 'schema' for my database. I define what data I'll be saving in my Mongo collection. [See the Mongoose web site for more information.](http://mongoosejs.com/)
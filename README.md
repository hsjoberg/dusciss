Dusciss
=======
A simple image board created in NodeJS using Express and Mongoose.


Installation
============

**MongoDB**

You need a MongoDB server for Dusciss to work.
Download [MongoDB](http://www.mongodb.org/downloads) for your os, follow the [installation instructions](http://docs.mongodb.org/manual/installation/) on their site.

**Modules:**

Dusciss is using [ExpressJS](http://expressjs.com) and [Mongoose](http://mongoosejs.com/).
Mongoose might be tricky to install because it's using the [MongoDB native module](https://github.com/mongodb/node-mongodb-native), which in turn is using [node-gyp](https://github.com/TooTallNate/node-gyp), which requires Python < 3.0 to be installed.
MongoDB native module is using depencies which require C++ compiler. On Windows, you will need a VC2011/VC2012 compiler, *but* Mongoose will work perfectly anyway.


Just install the modules as usual.
```
npm install -d
```
...inside the project folder.


To properly install mongoose/mongodb on Windows, run *npm install -d* using the VS Developer Command Prompt, but as stated above, it is not mandatory.



**Node**

It is programmed for Node version 0.8.22, but there shouldn't be any problems running on newer versions.

To start the app, run
```
node app
```
...inside the root folder of the project.

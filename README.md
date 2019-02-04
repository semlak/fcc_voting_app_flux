# A Simple Voting App

## Very basic overview
I created this app to fulfill requirements for the freecodecamp.com coding curriculum, and I added some of my own requirements.
It is the voting app, an app that one can create and vote on polls, described at [https://www.freecodecamp.com/challenges/build-a-voting-app](https://www.freecodecamp.com/challenges/build-a-voting-app).

The basics are this: This web app allows users to create polls, vote on them, share them, etc. It uses React.js + Flux Architecture.

Slightly more info:
* You can create a poll (if logged in).
* You can add an answer option to an existing poll (if logged in).
* You can vote on a poll whether or not you are logged in (you can only vote for a poll once).
* You can delete a poll that you created.
* You can view all polls created (that haven't since been deleted).
* You can filter the polls to see ones created by a specific user.
* You can share a poll (currently done by providing a URL to the poll. There is not a "Share on Facebook/Twitter" feature yet)
* The application uses React.js (a JavaScript framework) with a Flux architecture for the front-end, and node.js/Express 4 server with a Mongo database on the back-end.
* For authentication, the application uses the Passport.js module for node.js. I haven't currently implemented OAuth strategy support, only username/password strategy.

## Demo
You can view and interact with a running example on Heroku: [https://fcc-voting-app-flux.Herokuapp.com/](https://fcc-voting-app-flux.Herokuapp.com/)

**Please do not provide any sensitive data.** The security of the app is untested.
On this deployment, you can:
* Create your own user account on the app.
  * Password must be at least 8 characters long (this is not meant to be very secure)
* Create polls (while logged in).
* Add answer options to existing polls (while logged in).
* Vote on any poll (whether or not your are logged in).
* Possibly other things, such as updating your profile's username or password, deleting your own polls.

Please Note:
* This deployment via Heroku uses Heroku's SSL connection, but the app itself is not currently configured to do so on its own (when running on your own server). It is unclear to me how secure your data is in Heroku. The app itself likely has flaws that could be exposed whether or not the connection is encrypted.
* Your username does not need to be an email address, and your password has minimal requirements (described above).
* Only a hash of your password will be stored on the server (this is handled by the Passport.js module), but it is still possible that your data would be exposed, and your un-hashed password is sent from the client to the server.
* Your user data, any polls you create, votes you make, etc, are stored on the server database (mongodb).
* **When you vote, your IP address is stored, even if you don't create an account.** If this concerns you, please do not vote.
    Your IP address is used to prevent the same user from voting for the same poll multiple times (a functional requirement for the application) while still allowing users to vote without creating an account.



## Setting up the Project on your own
First you'll need [Node.js](https://nodejs.org) and the package manager
that comes with it ([npm](https://www.npmjs.com/)).

You'll also need mongodb installed and running.

Once you've got that working, head to the command line to set up the project.

### Clone the repository

```
git clone https://github.com/semlak/fcc_voting_app_flux
cd fcc_voting_app_flux
npm install
# that installs the required modules and also builds the app. It also builds the application (through the postInstall script).
# to run, make sure you have an instance of mongodb running, then start the application server
npm start

```

Now open up [http://localhost:8080](http://localhost:8080), or whatever port and location you have configured for, and the app should load up, indicating that no polls exist yet (the homepage of the app lists all polls, or when no polls exist, displays a message indicating such).

You should be able to create a new account
* The first account you create in the app is automatically an 'admin' account. Right now, the 'admin' account can vote unlimited times for a poll and delete any poll, update any user's profile data, and possibly other things.
  * Other app management features would be added, presumably, if I were to continue development.
* I still haven't added OAuth support, but you can just provide simple username and password.
* The Heroku deployment uses Heroku's SSL certificate (Heroku describes this a bit on their web site).
* The full security of the app has not been tested, and so it is not ready for deployment in any non-testing setting.


After editing any of the React application components, you need to run the build script (which runs webpack)
```
npm run build
```
I don't currently have things configured correctly to watch for updates.




## Running tests
tests can be run (using "jest") with the following command:
```
npm test
```
(for some reason, running the tests just by typing `jest` will run the tests but has some problems)

The tests I have created barely test any of the features and are fairly insufficient. I've only created a few, and they basically only test a few components and don't address overall functional requirements of the application or how well it is integrated.


## Issues:
There are many things that don't really work right, such as some of the npm scripts
It also is possible that my packages.json file has requirements that aren't actually used. Things like that.

I have no idea if my license info is correct. It is listed in LICENSE.md

I still have some components setting their own states too much. Also, I would like to create Containers for the components, and put all the state setting in the container. I don't think I understood that concept very well when I created the app.

Several of my problems for components are the result of trying to display error messages when failing to login, register, update user or poll information. I haven't figured the best way to get this information from the ajax call result to the stores to the component renderings.

I still have lots of imperative-type code that updates UI components.

Right now, when updating user information, there are buttons next to each field to update that field. However, hitting one of those buttons seems like it submits that data from all of the fields (but it does not, as I intended). Because the form then makes all of the fields green (validationState = "success"), it makes it seem like all of the updates are submitted. So basically, the form functions properly but the feedback it provides gives the user the wrong impression. Also, the feedback message just says account saved, not which field was updated.

Tests need a lot of work. There are hardly any.

## Components

### React.js + Flux
React.js and the Flux architecture were created by Facebook. An overview of Flux is at [https://facebook.github.io/flux/docs/overview.html](https://facebook.github.io/flux/docs/overview.html). I initially tried building this app using React components by themselves without a Flux architecture, but it started getting complicated. Using a Flux architecture seems to allow for easily handling of React components. There are several libraries that provide a Flux architecture, such as [http://redux.js.org/](Redux), which look really good. However, I thought I might learn a lot about the architecture by building my app without them.  I do use a Facebook's flux library for its dispatcher (simply called flux, at [https://www.npmjs.com/package/flux](https://www.npmjs.com/package/flux, which has some helpful documentation). I have my ActionCreators, Stores, Constants, and React Components, which are modeled after the Facebook examples ([https://github.com/facebook/flux/tree/master/examples](https://github.com/facebook/flux/tree/master/examples)), such as the flux-todomvc. However, I didn't really fully understand the architecture so there are probably some issues with my implementation. I don't currently use Containers to hold my components, which are described in thier flux-utils section of their documentation.  I had trouble finding good examples of React applications interacting with a server, but found some suggestions to put that functionality into separate modules, or Utils, so I have a Utils such as UserWebAPIUtils that are called from UserActionCreators, and PollWebAPIUtils that are called from PollActionCreators. Anyway, I think that my organization still has a lot of cleanup needed.

I tried to model my application communication based on the diagram Facebook provides in their flux documentation ([https://github.com/facebook/flux](https://github.com/facebook/flux)):

<img src="./docs/img/flux-diagram-white-background.png" style="width: 100%;" />




### react-router
When I created this app, I didn't find a good boilerplate structure for react/flux. After completing the the react-router-tutorial ([https://github.com/reactjs/react-router-tutorial](https://github.com/reactjs/react-router-tutorial)), I decided to use what I created with the react-router-tutorial as a base (it does not include flux, though). The tutorial got me going with a single-page web-app with a few dummy react components, and I replaced the dummy components with my app's components as I developed them. Since this did not provide any of the flux architecture, I grabbed that from Facebook's examples as I developed my components.

### react-bootstrap
I use react-bootstrap ([https://react-bootstrap.github.io/](https://react-bootstrap.github.io/)) rather than jQuery and bootstrap-javascript ([https://getbootstrap.com/2.0.4/javascript.html](https://getbootstrap.com/2.0.4/javascript.html)). react-bootstrap still uses the regular bootstrap CSS file, but react-bootstrap provides you with almost all of the regular bootstrap elements as react components instead of HTML with a bunch of defined components, and it does not depend on jQuery, as bootstrap-javascript does.

### jQuery
I'm not using jQuery. I have nothing against jQuery, but I found it difficult to use when combined with React.js, and I found several forums and blogs suggesting to avoid combining them. A core issue is that React.js keeps its own virtual DOM and decides when to update the actual DOM based on its virtual DOM. However, jQuery frequently makes changes to the DOM that React doesn't know about, and so this interaction can cause issues. Since I stopped using jQuery for DOM manipulation for this project, I decided to not use it for AJAX calls (my other common use for jQuery), so I re-wrote my AJAX calls using XMLHTTPRequest() (part of standard JavaScript).

### Authentication
For user authentication, I use Passport.js ([http://passportjs.org/](http://passportjs.org/)) and a local username/password strategy. I would like to add OAuth (Passport provides an OAuth strategy)


### recharts
For charts that display the current outcome of a poll, I used Recharts ([http://recharts.org/](http://recharts.org/)), which provides basic charts as React components. It seems like an interesting library that I haven't explored much.


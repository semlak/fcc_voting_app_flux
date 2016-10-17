# Very basic overview
I created this app to forfill requirements for the freecodecamp.com coding curriculum. I added a some of my own requirements.
It is the voting app, an app that one can create and vote on polls, described at [https://www.freecodecamp.com/challenges/build-a-voting-app](https://www.freecodecamp.com/challenges/build-a-voting-app).

The basics are this: This web app allows users to create polls, vote on them, share them, etc.

Slightly more info:
* You must log in to create a poll (meaning, you would have to create an account).
* You must log in to add an answer option to an existing poll (you do not have to be the original creator of the poll).
* You can vote on a poll whether or not you are logged in. You can only vote for a poll once.
* You can delete a poll that you created.
* You can view all polls created (that haven't since been deleted).
* You can view all polls created by a specific user.
* You can share a poll (currently done by providing a URL to the poll. There is not a "Share on Facebook/Twitter" feature yet)
* The application uses the React.js JavaScript framework with a flux architecture for the front-end, and node.js/Express 4 with a Mongo database on the back-end.
* The application uses the Passport.js module for authentication.

# Demo
You can view and interact with a running example on heroku: [https://fcc-voting-app-flux.herokuapp.com/](https://fcc-voting-app-flux.herokuapp.com/)
**please do not provide any sensitive data.** The security of the app is untested.
On this deployment, you can:
* Create your own user account on the app.
	* Password requirements (don't use a password that you use at other sites; there are likely to be some security flaws in this app):
		* Must be at least 1 character long. Some characters could present problems parsing.
* Create polls while signed in.
* Add answer options to existing polls while signed in.
* Vote on any poll (whether or not your are signed in).
* Possibly other things, such as updating your profile's username or password, delete your own polls.

Please Note:
* This deployment via heroku uses heroku's ssl connection, by my app is not currently configured to do so. It is unclear to me how secure your data is in Heroku.
* Your username does not need to be an email address, and your password has minimal requirements (described above).
* Only a hash of your password will be stored on the server (this is handled by the Passport.js module), but it is still possible that your data would be exposed, and your un-hashed password is sent from the client to the server.
* Your user data, any polls you create, votes you make, etc, are stored on the server database (mongodb).
* **When you vote, your IP address is stored, even if you don't create an account.** If this concerns you, please do not vote.
		Your IP address is used to prevent the same user from voting for the same poll multiple times (a functional requirement for the application) while still allowing users to vote without creating an account.




# Setting up the Project
First you'll need [Node.js](https://nodejs.org) and the package manager
that comes with it: [npm](https://www.npmjs.com/).

You'll also need mongodb installed and running.

Once you've got that working, head to the command line to set up the project.

## Clone the repository

```
git clone https://github.com/semlak/fcc_voting_app_flux
cd fcc_voting_app_flux
npm install
webpack
#make sure you have an instance of mongodb running
node server.js

#While developing, I typically invoke with "webpack && node server.js".
#I don't currently have things configured correctly to watch for updates.

```

Now open up [http://localhost:8080](http://localhost:8080), or whatever port and location you have configured for, and the app should load up, indicating that no polls exist yet (the homepage of the app lists all polls, or when no polls exist, displays a message indicating such).

You should be able to create a new account
* The first account you create in the app is automatically an 'admin' account. Right now, the admin accout can vote unlimited times for a poll and delete any poll, update any user's profile data, and possibly other things.
	* Other app management features would be added, presumably, if I were to continue development.
* I still haven't added Auth0 support, but you can just provide simple username and password.
* Please note that username/password info is not encrypted (not SSL). The heroku deployment uses heroku's SSL certificate (heroku describes this a bit on their web site).
* The server only stores hashes of passwords, but it is still not safe due to the lack of SSL (even with SSL added, a review of code for security flaws would be necessary).
* Obviously, this app is not ready for deployment in any non-testing setting.




# Running tests
tests can be run (using "jest") with the following command:
```
npm test
```
(for some reason, running the tests just by typing `jest` will run the tests but has some problems)

The tests I have created barely test any of the features and are faily insufficient. I've only created a few, and they basically only test a few components and don't address overall functional requirements of the application or how well it is integrated.


# Notes:
There are many notes that I need to add here.

I had trouble finding a good boilerplate structure for react/flux. After completing the the react-router-tutorial ([https://github.com/reactjs/react-router-tutorial](https://github.com/reactjs/react-router-tutorial)), I decided to use that as a base (it does not include flux, though). The tutorial got me going with a single-page web-app with a few dummy react components, and I replaced the dummy components with my app's components as I developed them. Since this did not provide any of the flux architecture, I grabbed that from facebook's examples.

I use react-bootstrap ([https://react-bootstrap.github.io/](https://react-bootstrap.github.io/)) rather than regular bootstrap. react-bootstrap uses the regular bootstrap css file, but react-bootstrap provides you with almost all of the regular bootstrap elements as react components instead of html with a bunch of defined classes.

For user authentication, I use Passport.js ([http://passportjs.org/](http://passportjs.org/)).

For charts that display the current outcome of a poll, I used Recharts ([http://recharts.org/](http://recharts.org/)).

There are many things that don't really work right, such as most of the npm scripts
It also is possible that my packages.json file has requirements that aren't actually used. Things like that.

I have no idea if my license info is current. It is listed in LICENSE.md

I haven't set up heroku deployment yet.


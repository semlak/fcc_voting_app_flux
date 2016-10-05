# Very basic overview
I created this app to forfill requirements for the freecodecamp.com coding curriculum. I added a some of my own requirements.
It is the voting app (really, a polling app) described at [https://www.freecodecamp.com/challenges/build-a-voting-app](https://www.freecodecamp.com/challenges/build-a-voting-app).

The basics are this: The web app allows users to create polls, vote on them, share them, etc.

Slightly more info:
* You must log in to create a poll (meaning, you would have to create an account).
* You must log in to add an answer option to an existing poll (you do not have to be the original creator of the poll).
* You can vote on a poll whether or not you are logged in. You can only vote for a poll once.
* You can delete a poll that you created.


# Setting up the Project (my voting app)

First you'll need [Node.js](https://nodejs.org) and the package manager
that comes with it: [npm](https://www.npmjs.com/).

You'll also need mongodb installed and running.

Once you've got that working, head to the command line to set the project.

## Clone the repository

```
git clone https://github.com/semlak/fcc_voting_app_flux
cd fcc_voting_app_flux
npm install
webpack
#make sure you have an instance of mongodb running
node server.js

```

Now open up [http://localhost:8080](http://localhost:8080)

You should be able to create a new account
* The first account you create in the app is an 'admin' account. Right now, the admin accout can vote unlimited times for a poll and delete any poll. Other app management features would be added, presumably, if I were to continue development.
* I still haven't added Auth0 support, but you can just provide simple username and password
* Please note that username/password info is not encrypted (not SSL).
* The server only stores hashes of passwords, but it is still not safe due to the lack of SSL (even with SSL added, a review of code for security flaws would be necessary).
* Obviously, this app is not ready for deployment in any non-testing setting.


There are many notes that I need to add here.

I started this project using the react-router-tutorial ([https://github.com/reactjs/react-router-tutorial](https://github.com/reactjs/react-router-tutorial)). That got me going with a few dummy react components, and I replaced them with my app's components as I developed them.

I use react-bootstrap ([https://react-bootstrap.github.io/](https://react-bootstrap.github.io/)), rather than regular bootstrap. react-bootstrap uses regular bootstrap css file, but you build almost all components that would just be regular html elements with bootstrap classes as react components instead.

For user authentication, I use Passport.js ([http://passportjs.org/](http://passportjs.org/)).

For charts that display the current outcome of a poll, I used Recharts ([http://recharts.org/](http://recharts.org/)).

There are many things that don't really work right, such as most of the npm scripts
It also is possible that my packages.json file has requirements that aren't actually used. Things like that.

I have no idea if my license info is current. It is listed in LICENSE.md

I haven't set up heroku deployment yet.


This project is for a website that users can use to share campgrounds and reviews of their experiences

The project makes use of HTML, CSS, Bootstrap5, JavaScript, Node.js, MongoDB, and Mongoose.
More technologies will likely be used as the project progresses.

To install and host a local version of the website:
1 Clone this repo
2 Install MongoDB Community Server: 
  - For macOS users: https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x/
  - For Windows users: https://www.mongodb.com/try/download/community
3 Install npm & node (use nvm or nvm-windows)
  - nvm for Linux/macOS users:        https://github.com/nvm-sh/nvm#installing-and-updating (installation)
                                      https://github.com/nvm-sh/nvm#usage                   (usage)
  - nvm-windows for Windows users:    https://github.com/coreybutler/nvm-windows/releases   (installation)
                                      https://github.com/coreybutler/nvm-windows            (usage)
  - node for all users:               https://docs.npmjs.com/downloading-and-installing-node-js-and-npm
4 Run 'npm install' in the root directory of the repo
    - This installs all of the dependencies to run the server
    - See package.json in this repo for a list of modules that will be installed
5 Run 'node app.js' in the root directory to serve the site locally
6 Open your web browser to localhost:3000/campgrounds to view current state of the website

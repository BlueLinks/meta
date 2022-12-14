# Meta

MERN stack web application used to keep track of the 'Meta' (Things my friend and I mildly enjoy).\
[How to Use MERN Stack: A Complete Guide](https://www.mongodb.com/languages/mern-stack-tutorial) used as a basis for the project.

## Build Instructions

-   Navigate to both the client and server directories and execute `npm install` to install all required packages.
-   Follow the guide at [Get Started with Atlas](https://www.mongodb.com/docs/atlas/getting-started/) to create an Atlas account and deploy a database cluster.
-   Once the cluster has been deployed, find your connection string and assign it to the _ATLAS_URI_ variable inside [./server/config.env](server/config.env)
-   From client directory, run `npm start`
-   Open a new terminal window and from the server directory run `node server.js`
-   Web Server should now be running at http://localhost:3000/

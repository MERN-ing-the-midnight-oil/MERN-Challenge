const express = require("express");
const path = require("path");
const db = require("./config/connection");
const routes = require("./routes");

//auth.js: Update the auth middleware function to work with the GraphQL API.
//maybe that means the following?
const { ApolloServer } = require("@apollo/server");
//connect the apollo server to express through middleware (apollo could be separate if needed, but we are using it with express in this class)
const { expressMiddleware } = require("@apollo/server/express4");

//required for disconnecting apollo server
const {
	ApolloServerPluginDrainHttpServer,
} = require("@apollo/server/plugin/drainHttpServer");

//appolo needs direct access to the http library (a standard node library that express is built on). Express is set up to handle http requests, its a wrapper. We need to break it out for apollo here .
const http = require("http");

//our apollo configuration- sets up entities - typDefs are whats offered to the client, resolvers are the handlers
const { typeDefs, resolvers } = require("./schemas");

// Prepare the MongoDB connection
const db = require("./config/connection");

const app = express();
const PORT = process.env.PORT || 3001;

//create a new apollo server
const server = new ApolloServer({
	typeDefs, //entities offered
	resolvers,
	plugins: [ApolloServerPluginDrainHttpServer({ httpServer })], //helps apollo shut down
});

//still need to tell express to handle url and json
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Create a new instance of an Apollo server with the GraphQL schema, apollo server will handle one of the routes
const startApolloServer = async (typeDefs, resolvers) => {
	await server.start(); //start up the apollo server

	// 	// set up the route to handle graphql requests
	//  //hey appolo, handle requests to the graphql route and consider auth tokens
	app.use(
		"/graphql", //hey express use server named server to handle graphql requests
		expressMiddleware(server, {
			// 			//the apollo server will handle requests to the graphql route
			context: async ({ req }) => ({ token: req.headers.token }),
		})
	);

	db.once("open", () => {
		// 		//now lets open up the database
		// 		// start the web server
		httpServer.listen(PORT, () => {
			// 			//now listening for requests for database
			console.log(`API server running on port ${PORT}!`);
			console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
		});
	});
};

// // Call the async function to start everything up
startApolloServer();

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "../client/build")));
}

app.use(routes);

db.once("open", () => {
	app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});

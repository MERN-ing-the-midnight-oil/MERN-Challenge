const typeDefs = `graphql`;
//define entities that the cleint can get from the database
//clearly defines what clients can query from each type
//typeDefs are visible in the Fields part of the sandbox, where queries are tested

type User {
    _id:ID
    username:String
    email:Sting
    bookCount:Int
//(savedbooks will be an array of the Book type.)
    savedBooks:Array
}
type Book {
//(Not the _id, but the book's id value returned from Google's Book API.)
    bookId:Int
//(An array of strings, as there may be more than one author.)
    authors:Array
    description:String
    title:String
    image:String //can a image URL be a string?
    link:String //can a URL be a string?
}
type Auth {
    token:String//probably a string?
//(user References the User type.)
    user: User //can we do this? like a foreign key?
}
module.exports = typeDefs;
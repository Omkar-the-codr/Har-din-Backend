const pool = require("../config/db.js");
const { bookInputSchema } = require("../validators/bookValidator.js");

const resolvers = {
  Query: {
    books: async()=>{
        const [rows] = await pool.query("Select * from books");
        return rows;
    },
    book: async(_, {id})=>{
        const [rows] = await pool.query("Select * from books where id = ?", [id]);
    }
  },
  Mutation: {
    createBook: async (_, {input}) => {
        const {error} = bookInputSchema.validate(input);

        if(error){
            throw new Error(error.message);
        }
        const {title, author} = input;
        const [result] = await pool.query("Insert into books (title, author) values (?,?)", [title, author]);
        return {
            id: result.insertId,
            title,
            author
        };
    },
    updateBook: async (_, {id, title, author})=>{
        const [result]  = await pool.query("Update books Set title=?, author=? where id =?",[title, author, id]);
        if(result.affectedRows===0) {
            throw new Error("Book with ID not found");
        }
        const [rows] = await pool.query("Select * from books where id =?",[id]);
        return rows[0];
    },
    delete: async(_,{id})=>{
        await pool.query("Delete from users where id =?",[id]);
        return "Usesr deleted successfully";
    }
  },
};

module.exports = resolvers;

const pool = require("../config/db.js");

const resolvers = {
    Query: {
        users: async()=>{
            const [rows] = await pool.query("Select * from users");
            return rows;
        },
        user: async(_, {id})=>{
            const [rows] = await pool.query("Select * from users where id = ?", [id]);
        },
    },
    Mutation: {
        createUser: async (_, {name, email, age})=>{
            const [result] = await pool.query("Insert into users (name, email, age) values (?, ?, ?)", [name, email, age]);
            return {id: result.insertId, name, email, age};
        },

        updateUser: async (_, {id, name, email, age})=>{
            await pool.query(
                "Update users Set name=?, email=?, age=? where id =?",[name, email, age, id]
            );
        },

        deleteUser: async(_, {id})=>{
            await pool.query("Delete from users Where id = ?", [id]);
            return "User deleted successfully";
        },
    },
};

module.exports = resolvers;
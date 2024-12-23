const db = require("../config/database");

class Product {
    static async getAll(){
        const [rows] = await db.query('SELECT * FROM products');
        return rows;
    }

    static async create(data){
        const result = await db.query("INSERT INTO products (name,price, description,image) VALUE (?,?,?,?)",[data.name, data.price,data.description,""]);
        return result;
    }
}


module.exports = Product;
const Product = require("../models/productModel");

exports.getListProduct = async (req, res) => {
    try {
        // Fetch products from the database
        const products = await Product.getAll();  // Ensure this gets all products with updated price
        console.log(products); // This should print the fetched products including price
        const title = "List product";
        res.render('index/index', { products, title });  // Pass data to the template
    } catch (err) {
        console.error("Error fetching products:", err);
        res.status(500).send("Error fetching products");
    }
};

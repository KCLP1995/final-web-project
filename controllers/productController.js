const Product = require("../models/productModel");

exports.getAllProducts = async (req,res) => {
    try{
        const products = await Product.getAll();
        title = "List product"
        res.render('index',{products,title});
    
    }catch(err){
        res.status(500).send("Error fetching products");
    }
};

exports.renderCreateForm = (req,res)=>{
    title = "New Product"
    res.render('create',{title});
};

exports.createProduct = async(req,res)=>{
    try{
        await Product.create(req.body);
        res.redirect("/product");
    }catch(err){
       
        console.error(err.stack);
        res.status(500).send("error creating product");
    }
}
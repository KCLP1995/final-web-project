const Product = require("../models/productModel");

exports.getAllProducts = async (req,res) => {
    try{
        const products = await Product.getAll();
        title = "List product"
        res.render('product/index',{products,title});
    
    }catch(err){
        res.status(500).send("Error fetching products");
    }
};

exports.renderCreateForm = (req,res)=>{
    title = "New Product"
    res.render('product/create',{title});
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

exports.getProductById = async (req,res) => {
    try {
        const product = await Product.getById(req.params.id);
        title = "Show product";
        if (product) {
          res.render('product/show', { product,title });
        } else {
          res.status(404).send('Product not found');
        }
      } catch (err) {
        res.status(500).send('Error fetching product');
      }
};

exports.renderEditForm = async (req, res) => {
    try {
      const product = await Product.getById(req.params.id);
      title = "Edit Product";
      if (product) {
        res.render('product/edit', { product,title });
      } else {
        res.status(404).send('Product not found');
      }
    } catch (err) {
      res.status(500).send('Error fetching product');
    }
};

// Update product
exports.updateProduct = async (req, res) => {
    try {
      await Product.update(req.params.id, req.body);
      res.redirect('/product');
    } catch (err) {
    console.log(err.stack);
      res.status(500).send('Error updating product');
    }
  };
  
  // Delete product
  exports.deleteProduct = async (req, res) => {
    try {
      await Product.delete(req.params.id);
      res.redirect('/product');
    } catch (err) {
      res.status(500).send('Error deleting product');
    }
  };
const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const Category = require("../models/category");

// Insert an product into database route
router.post("/addProduct", (req, res) => {
    const product = new Product({
        productName: req.body.productName
    });
    
    product.save(err => {
        if (err) {
            res.json({
                message: err.message, type: 'danger'
            })
        } else {
            req.session.message = {
                type: "success",
                message: "Product added successfully!"
            }
            
            res.redirect("/");
        }
    })
    
});

// Insert an Category into database route
router.post("/addCategory", (req, res) => {
    const category = new Category({
        categoryName: req.body.categoryName
    });

    category.save(err => {
        if (err) {
            res.json({
                message: err.message, type: 'danger'
            });
        } else {
            req.session.message = {
                type: "success",
                message: "Category added successfully!"
            }

            res.redirect("/categories");
        }
    });
});




// Get All The products route
router.get("/", (req, res) => {
    Product.find().exec((err, products) => {
        if (err) {
            res.json({ message: err.message });
        } else {
            res.render("index", {
                title: "Home Page",
                products: products
            });
        }

    });
});

// Get All the Categories
router.get("/categories", (req, res) => {
    Category.find().exec((err, categories) => {
        if (err) {
            res.json({ message: err.message });
        } else {
            res.render("categories", {
                title: "Categories Page",
                categories: categories
            });
        }
    });
});


router.get("/addCategory", (req, res) => {
    res.render("add_category", { title: "Add Category" });
});


router.get("/addProduct", (req, res) => {
    res.render("add_products", { title: "Add Products" });
});

// Edit a Product Route
router.get("/edit/:id", (req, res) => {
    let id = req.params.id;
    Product.findById(id, (err, product) => {
        if (err) {
            res.redirect("/");
        } else {
            if (product == null) {
                res.redirect("/");
            } else {
                res.render("edit_product", {
                    title: "Edit Product",
                    product: product
                });
            }

        }

    });
});

// Update product route
router.post("/updateProduct/:id", (req, res) => {
    let id = req.params.id;

    Product.updateOne({ _id: id }, {
        productName: req.body.productName
    }, (err, result) => {
        if (err) {
            res.json({
                message: err.message, type: 'danger'
            });
        } else {
            req.session.message = {
                type: "success",
                message: "Product updated successfully!"
            };

            res.redirect("/");
        }
    })
});


// Delete product route
router.get("/delete/:id", (req, res) => {
    let id = req.params.id;

    Product.deleteOne({ _id: id }, (err, result) => {
        if (err) {
            res.json({ message: err.message });
        } else {
            req.session.message = {
                type: "info",
                message: "User deleted successfully!"
            }

            res.redirect("/");
        }
    });
});




module.exports = router;
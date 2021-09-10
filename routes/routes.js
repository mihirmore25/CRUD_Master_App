const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const Category = require("../models/category");

// Get All The products route
router.get("/products", async (req, res) => {
    await Product.find().populate(
        {
            path: "category"
        }
    ).exec((err, products) => {
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


// Get the add product route
router.get("/addProduct", (req, res) => {
    res.render("add_products", { title: "Add Products" });
});


// Insert an product into database route
router.post("/addProduct", async (req, res) => {
    const category = new Category({
        categoryName: req.body.categoryName
    });

    return category.save()
        .then(category => {
            console.log(category);

            const categoryId = category._id;

            const product = new Product({
                productName: req.body.productName,
                category: categoryId
            });

            product.save();

            // return product;

            res.redirect("/products");
        });
});


// In This "home" route we will find all the products with 
// their categories specifed for them.
router.get("/home", async (req, res) => {
    await Product.find().populate(
        {
            path: "category"
        }
    ).exec((err, products) => {
        if (err) {
            res.json({ message: err.message });
        } else {
            res.render("home", {
                title: "All The Products with Categories",
                products: products
            });
        }

    });
});




// Edit a Product Route
router.get("/products/:id/edit", (req, res) => {
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

            res.redirect("/products");
        }
    })
});


// Delete product route
router.get("/products/:id/delete", (req, res) => {
    let id = req.params.id;

    Product.deleteOne({ _id: id }, (err, result) => {
        if (err) {
            res.json({ message: err.message });
        } else {
            req.session.message = {
                type: "info",
                message: "User deleted successfully!"
            }

            res.redirect("/products");
        }
    });
});


// Adding pagination to the products route
router.get('/products/:page', function (req, res, next) {
    var perPage = 9
    var page = req.params.page || 1

    Product
        .find()
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .populate("category")
        .exec(function (err, products) {
            Product.countDocuments().exec(function (err, count) {
                if (err) return next(err)
                res.render("home", {
                    title: "All The Products with Pagination",
                    products: products,
                });
            });
        });
});


module.exports = router;
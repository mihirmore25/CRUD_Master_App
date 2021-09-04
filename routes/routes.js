const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const Category = require("../models/category");

// Get All The products route
router.get("/products", async (req, res) => {
    await Product.find().populate(
        {
            path: "categories"
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

            res.redirect("/products");
        }
    });
    
});



router.get("/products/:id/addCategory", (req, res) => {
    let id = req.params.id;

    Product.findById(id).exec((err, product) => {
        if (err) {
            res.json({ message: err.message });
        } else {
            res.render("add_category", {
                title: "Add Category",
                product: product
            });
        }
    });
    
});

// Product.findById(id, (err, product) => {
//     if (err) {
//         res.redirect("/");
//     } else {
//         if (product == null) {
//             res.redirect("/");
//         } else {
//             res.render("add_category", {
//                 title: "Add Category",
//                 product: product
//             });
//         }

//     }

// });


// Route for creating a new Category and updating Product "category" field with it
router.post("/products/:id/addCategory", (req, res) => {

    const category = {
        categoryName: req.body.categoryName
    };

    Category.create(category)
        .then((category) => {
            return Product.updateOne({ _id: req.params.id }, { $push: { categories: category._id } }, { new: true });
        })
        .then(products => {
            // res.render("home", { title: "All The Products with Categories", products: products });
            res.redirect("/home");
        })
        .catch(err => {
            res.json(err);
        });  
});


router.get("/home", async (req, res) => {
    await await Product.find().populate(
        {
            path: "categories"
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
})




// Insert an Category into database route
// router.post("/addCategory", (req, res) => {
//     const category = new Category({
//         categoryName: req.body.categoryName
//     });

//     category.save(err => {
//         if (err) {
//             res.json({
//                 message: err.message, type: 'danger'
//             });
//         } else {
//             req.session.message = {
//                 type: "success",
//                 message: "Category added successfully!"
//             }
            
//             res.redirect("/categories");
//         }
//     });
// });









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




module.exports = router;
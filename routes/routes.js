const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const Category = require("../models/category");

// Get All The products route
router.get("/products", async (req, res) => {
    await Product.find().exec((err, products) => {
        if (err) {
            res.json({ message: err.message });
        } else {
            res.render("productsIndex", {
                title: "Products Page",
                products: products
            });
        }

    });
});

// Get All The categories route
router.get("/categories", async (req, res) => {
    await Category.find().exec((err, categories) => {
        if (err) {
            res.json({ message: err.message });
        } else {
            res.render("categoriesIndex", {
                title: "Categories Page",
                categories: categories
            });
        }

    });
});


// Get the category route
router.get("/addCategory", (req, res) => {
    res.render("add_category", { title: "Add Category" })
});

// Insert an category into database route
router.post("/addCategory", async (req, res) => {
    const category = new Category({
        categoryName: req.body.categoryName
    });

    return category.save()
        .then(category => {
            console.log(category);
            res.redirect("/categories");
        });
});


// Get the add product route
router.get("/categories/:id/addProduct", (req, res) => {
    let id = req.params.id;

    Category.findById(id).exec((err, category) => {
        if (err) {
            res.json({ message: err.message });
        } else {
            res.render("add_products", { title: "Add Product", category: category })
        }
    });
});


// Insert an product into database route
router.post("/categories/:id/addProduct", async (req, res) => {
    let id = req.params.id;

    await Category.findById(id).exec((err, category) => {
        if (err) {
            res.json({ message: err.message });
        }

        console.log(category);
        const product = new Product({
            productName: req.body.productName,
            category: category._id
        });

        product.save();

        res.redirect("/home");
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

// Update a product route
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
                message: "Product deleted successfully!"
            }

            res.redirect("/products");
        }
    });
});


// Edit a Category Route
router.get("/categories/:id/edit", (req, res) => {
    let id = req.params.id;
    Category.findById(id, (err, category) => {
        if (err) {
            res.redirect("/");
        } else {
            if (category == null) {
                res.redirect("/");
            } else {
                res.render("edit_category", {
                    title: "Edit Category",
                    category: category
                });
            }

        }

    });
});

// Update a Category route
router.post("/updateCategory/:id", (req, res) => {
    let id = req.params.id;

    Category.updateOne({ _id: id }, {
        categoryName: req.body.categoryName
    }, (err, result) => {
        if (err) {
            res.json({
                message: err.message, type: 'danger'
            });
        } else {
            req.session.message = {
                type: "success",
                message: "Category updated successfully!"
            };

            res.redirect("/categories");
        }
    })
});





// Delete category route
router.get("/categories/:id/delete", (req, res) => {
    let id = req.params.id;

    Category.deleteOne({ _id: id }, (err, result) => {
        if (err) {
            res.json({ message: err.message });
        } else {
            req.session.message = {
                type: "info",
                message: "Category deleted successfully!"
            }

            res.redirect("/categories");
        }
    });
});



// Adding pagination to the home route 
// where all the products and categories will be
router.get('/home/:page', function (req, res, next) {
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
                    title: "All The Products with Pagination On Home Page",
                    products: products,
                });
            });
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
        .exec(function (err, products) {
            Product.countDocuments().exec(function (err, count) {
                if (err) return next(err)
                res.render("productsIndex", {
                    title: "All The Products with Pagination",
                    products: products,
                });
            });
        });
});


// Adding pagination to the categories route
router.get('/categories/:page', function (req, res, next) {
    var perPage = 9
    var page = req.params.page || 1

    Category
        .find()
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function (err, categories) {
            Category.countDocuments().exec(function (err, count) {
                if (err) return next(err)
                res.render("categoriesIndex", {
                    title: "All The Categories with Pagination",
                    categories: categories,
                });
            });
        });
});


module.exports = router;
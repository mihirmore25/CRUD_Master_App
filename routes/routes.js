const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const Category = require("../models/category");

// Get All The products route
router.get("/products", async (req, res) => {
    try {
        const products = await Product.find({});
        if (products !== null) {
            res.render("productsIndex", {
                title: "Products Page",
                products: products
            });
        }
    } catch (error) {
        res.json({ error });
    }
});


// Get All The categories route
router.get("/categories", async (req, res) => {
    try {
        const categories = await Category.find({});

        if (categories !== null) {
            res.render("categoriesIndex", {
                title: "Categories Page",
                categories: categories
            });
        }
    } catch (error) {
        res.json({ error });
    }
});



// Get the category route
router.get("/addCategory", (req, res) => {
    res.render("add_category", { title: "Add Category" })
});

// Insert an category into database route
router.post("/addCategory", async (req, res) => {
    try {
        const newCategory = new Category({
            categoryName: req.body.categoryName
        });
        const category = await newCategory.save();
        // console.log(category);
        res.redirect("/categories");
    } catch (error) {
        res.json({ error });
    }
});


// Get the add product route
router.get("/categories/:id/addProduct", async (req, res) => {
    try {
        let id = req.params.id;
        const category = await Category.findById(id);
        res.render("add_products", { title: "Add Product", category: category });
    } catch (error) {
        res.json({ error });
    }
});


// Insert an product into database route
router.post("/categories/:id/addProduct", async (req, res) => {
    try {
        let id = req.params.id;

        const category = await Category.findById(id);
        // console.log(category);

        const product = new Product({
            productName: req.body.productName,
            category: category._id
        });

        await product.save();
        res.redirect("/home");

    } catch (error) {
        res.json({ error });
    }
});


// In This "home" route we will find all the products with 
// their categories specifed for them.
router.get("/home", async (req, res) => {
    try {
        const products = await Product.find().populate(
            {
                path: "category"
            }
        );
        res.render("home", {
            title: "All The Products with Categories",
            products: products
        });
    } catch (error) {
        res.json({ error });
    }
});




// Edit a Product Route
router.get("/products/:id/edit", async (req, res) => {
    try {
        let id = req.params.id;
        const product = await Product.findById(id);

        if (product === null) {
            res.redirect("/");
        } else {
            res.render("edit_product", {
                title: "Edit Product",
                product: product
            });
        }

    } catch (error) {
        res.json({ error });
    }
});

// Update a product route
router.post("/updateProduct/:id", async (req, res) => {
    try {
        let id = req.params.id;

        const result = await Product.updateOne({ _id: id }, {
            $set: { productName: req.body.productName }
        });

        req.session.message = {
            type: "success",
            message: "Product updated successfully!"
        };
        res.redirect("/products");

    } catch (error) {
        res.json({ error });
    }
});


// Delete product route
router.get("/products/:id/delete", async (req, res) => {

    try {
        let id = req.params.id;

        const result = await Product.deleteOne({ _id: id });
        req.session.message = {
            type: "info",
            message: "Product deleted successfully!"
        }

        res.redirect("/products");
    }
    catch (error) {
        res.json({ error });
    }
});


// Edit a Category Route
router.get("/categories/:id/edit", async (req, res) => {
    try {
        let id = req.params.id;
        const category = await Category.findById(id);
        if (category === null) {
            res.redirect("/");
        } else {
            res.render("edit_category", {
                title: "Edit Category",
                category: category
            });
        }

    } catch (error) {
        res.json({ error });
    }
});

// Update a Category route
router.post("/updateCategory/:id", async (req, res) => {
    try {
        let id = req.params.id;
        const result = await Category.updateOne({ _id: id }, {
            $set: {
                categoryName: req.body.categoryName
            }
        });
        req.session.message = {
            type: "success",
            message: "Category updated successfully!"
        };
        res.redirect("/categories");
    } catch (error) {
        res.json({ error });
    }
});


// Delete category route
router.get("/categories/:id/delete", async (req, res) => {
    try {
        let id = req.params.id;
        const result = Category.deleteOne({ _id: id }, (err, result) => {
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
    } catch (error) {
        res.json({ error });
    }
});



// Adding pagination to the home route 
// where all the products and categories will be
router.get('/home/:page', async (req, res, next) => {
    var perPage = 9
    var page = req.params.page || 1

    const products = await Product
        .find()
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .populate("category");

    const count = await Product.countDocuments();

    res.render("home", {
        title: "All The Products with Pagination On Home Page",
        products: products,
    });
});


// Adding pagination to the products route
router.get('/products/:page', async (req, res, next) => {
    try {
        var perPage = 9
        var page = req.params.page || 1
    
        const products = await Product
            .find()
            .skip((perPage * page) - perPage)
            .limit(perPage)
            .populate("category");
    
        const count = await Product.countDocuments();
    
        res.render("home", {
            title: "All The Products with Pagination On Products Page",
            products: products,
        });
    } catch (error) {
        res.json({ error });
    }
});


// Adding pagination to the categories route
router.get('/categories/:page', async (req, res, next) => {
    try {
        var perPage = 9
        var page = req.params.page || 1
    
        const categories = await Category
            .find()
            .skip((perPage * page) - perPage)
            .limit(perPage);
    
        const count = await Category.countDocuments();
    
        res.render("categoriesIndex", {
            title: "All The Categories with Pagination",
            categories: categories,
        });
    } catch (error) {
        res.json({ error });
    }
});


module.exports = router;
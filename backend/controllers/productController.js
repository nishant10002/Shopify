const fs = require('fs');
const productModel = require("../models/productModel");
const coludinary = require("cloudinary");
const sendError = require("../utils/sendError");
const { filterData } = require("../utils/filterQuery");

const predefinedProducts = [
  {
    name: "Organic Apple",
    rate: 25,
    stocks: 100,
    category: "6712a2f377b4529f7437c112", // Replace with actual category ObjectId
    kilogramOption: [0.5, 1.0, 1.5],
    image: "C:/Users/nisha/grocery-shop/backend/public/uploads/category/shimla-apple.jpg", // Direct local path
  },
  {
    name: "Banana",
    rate: 15,
    stocks: 200,
    category: "6712a2f377b4529f7437c112", // Replace with actual category ObjectId
    kilogramOption: [1.0, 2.0],
    image: "C:/Users/nisha/grocery-shop/backend/public/uploads/category/banana.webp", // Direct local path
  },
  {
    name: "Black Grapes",
    rate: 80,
    stocks: 0,
    category: "6712a2f377b4529f7437c112",  // Replace with actual category ObjectId
    kilogramOption: [0.5, 1.0, 2.0],
    image: "C:/Users/nisha/grocery-shop/backend/public/uploads/category/grapeblack.jpg",  // Local image path
  },
  {
    name: "Green Grapes",
    rate: 75,
    stocks: 120,
    category: "6712a2f377b4529f7437c112",  // Replace with actual category ObjectId
    kilogramOption: [0.5, 1.0, 2.0],
    image: "C:/Users/nisha/grocery-shop/backend/public/uploads/category/greengrapes.jpeg",  // Local image path
  },
  {
    name: "Milk",
    rate: 45,
    stocks: 500,
    category: "6712a2f477b4529f7437c115",  // Replace with actual category ObjectId for dairy
    kilogramOption: [0.5, 1.0],  // This can represent liters instead of kilograms
    image: "C:/Users/nisha/grocery-shop/backend/public/uploads/category/milk.webp",  // Local image path
  },
  {
    name: "Cheese",
    rate: 60,
    stocks: 300,
    category: "6712a2f477b4529f7437c115",  // Replace with actual category ObjectId for dairy
    kilogramOption: [0.25, 0.5, 1.0],
    image: "C:/Users/nisha/grocery-shop/backend/public/uploads/category/cheese.jpg",  // Local image path
  },
  {
    name: "Tomatoes",
    rate: 7,
    stocks: 400,
    category: "6712a2f677b4529f7437c118",  // Replace with actual category ObjectId for vegetables
    kilogramOption: [0.5, 1.0, 2.0],
    image: "C:/Users/nisha/grocery-shop/backend/public/uploads/category/tomato.jpg",  // Local image path
  },
  {
    name: "Broccoli",
    rate: 12,
    stocks: 0,
    category: "6712a2f677b4529f7437c118",  // Replace with actual category ObjectId for vegetables
    kilogramOption: [0.5, 1.0],
    image: "C:/Users/nisha/grocery-shop/backend/public/uploads/category/broccoli.webp",  // Local image path
  },
  {
    name: "Spinach",
    rate: 26,  // Rate in ₹
    stocks: 350,
    category: "6712a2f677b4529f7437c118",  // Replace with actual category ObjectId for vegetables
    kilogramOption: [0.25, 0.5, 1.0],
    image: "C:/Users/nisha/grocery-shop/backend/public/uploads/category/spinach.jpg",  // Local image path
  },
  {
    name: "Potato",
    rate: 9,  // Rate in ₹
    stocks: 600,
    category: "6712a2f677b4529f7437c118",  // Replace with actual category ObjectId for vegetables
    kilogramOption: [1.0, 2.0, 5.0],
    image: "C:/Users/nisha/grocery-shop/backend/public/uploads/category/potato.jpg",  // Local image path
  },
  {
    name: "Yogurt",
    rate: 50,  // Rate in ₹ (per 500g)
    stocks: 200,
    category: "6712a2f477b4529f7437c115",  // Replace with actual category ObjectId for dairy
    kilogramOption: [0.5, 1.0],
    image: "C:/Users/nisha/grocery-shop/backend/public/uploads/category/yogurt.webp",  // Local image path
  },
  {
    name: "Butter",
    rate: 65,  // Rate in ₹ (per 250g)
    stocks: 150,
    category: "6712a2f477b4529f7437c115",  // Replace with actual category ObjectId for dairy
    kilogramOption: [0.25, 0.5],
    image: "C:/Users/nisha/grocery-shop/backend/public/uploads/category/butter.jpg",  // Local image path
  }
];

const initializeProducts = async () => {
  try {
    for (const product of predefinedProducts) {
      // Check if the product already exists
      const isProductExists = await productModel.findOne({ name: product.name });
    
      if (!isProductExists) {
        // Read the local image file
        const imageFilePath = product.image;
        
        if (fs.existsSync(imageFilePath)) {
          // Upload the local image file to Cloudinary
          const result = await coludinary.uploader.upload(imageFilePath, {
            folder: "products",
          });

          // Create the product in the database
          await productModel.create({
            name: product.name,
            rate: product.rate,
            stocks: product.stocks,
            category: product.category,
            kilogramOption: product.kilogramOption,
            public_id: result.public_id,
            url: result.secure_url, // URL from Cloudinary
          });

          console.log(`Product ${product.name} added successfully!`);
        } else {
          console.error(`Image file for ${product.name} not found at ${imageFilePath}`);
        }
      } 
    }
  } catch (error) {
    console.error("Error initializing products:", error.message);
  }
};

// Call initializeProducts when the server starts
initializeProducts();

//Add Product
const addProduct = async (req, res) => {
  try {
    const { name, rate, stocks, category, kilogramOption, image } = req.body;
    if (kilogramOption.length == 1) {
      sendError(res, 400, ["Weight: Required..!!"]);
    } else {
      const kgOption = [];
      kilogramOption.map((kg) => {
        kgOption.push(kg);
      });

      const result = await coludinary.v2.uploader.upload(image, {
        folder: "products",
      });

      const newProduct = await productModel.create({
        name,
        rate,
        stocks,
        category,
        kilogramOption: kgOption,
        public_id: result.public_id,
        url: result.url,
      });

      res.status(201).json({
        success: true,
        message: "Product Add SuccessFully..!!",
        newProduct,
      });
    }
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = {};
      Object.keys(error.errors).map((key) => {
        errors[key] = error.errors[key].message;
      });
      sendError(res, 400, Object.values(errors));
    } else {
      console.log(error);
      sendError(res, 400, ["Somethings Went Wrong..!!"]);
    }
  }
};

//Delete Product
const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    if (productId) {
      const isProductExit = await productModel.findById(productId);
      if (isProductExit) {
        const DeletedProduct = await productModel
          .findByIdAndDelete(productId)
          .populate("category");
        res.status(200).json({
          success: true,
          message: "Product Delete SuccessFully..!!",
          DeletedProduct,
        });
      } else {
        sendError(res, 400, "Product Not Found");
      }
    } else {
      sendError(res, 400, "Product Id Not Found");
    }
  } catch (error) {
    sendError(res, 400, error.message);
  }
};

//Update Products
const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { name, rate, kilogramOption, category, stocks, image } = req.body;
    if (productId) {
      const isProductExit = await productModel.findById(productId);
      if (image !== "") {
        const result = await coludinary.v2.uploader.upload(image, {
          folder: "products",
        });
        isProductExit.url = result.url;
        isProductExit.public_id = result.public_id;
        isProductExit.name = name;
        isProductExit.rate = rate;
        isProductExit.category = category;
        isProductExit.stocks = stocks;
        isProductExit.kilogramOption = kilogramOption;

        await isProductExit.save();
        res.status(200).json({
          success: true,
          message: "Product Updated..!!",
        });
      } else {
        isProductExit.name = name;
        isProductExit.rate = rate;
        isProductExit.category = category;
        isProductExit.stocks = stocks;
        isProductExit.kilogramOption = kilogramOption;
        await isProductExit.save();
        res.status(200).json({
          success: true,
          message: "Product Updated..!!",
        });
      }
    } else {
      sendError(res, 400, "Product Id Not Found");
    }
  } catch (error) {
    console.log(error);
    sendError(res, 400, error.message);
  }
};

//Retrieve All Products
const getAllProduct = async (req, res) => {
  try {
    const productsDocCount = await productModel.find().countDocuments();
    const queryStr = filterData(productModel.find(), req.query);
    const products = await queryStr.populate("category");
    res.status(200).json({
      success: true,
      message: "Product Retrieve SuccessFully..!!",
      products,
      productsDocCount,
    });
  } catch (error) {
    console.log(error);
    sendError(res, 400, error.message);
  }
};

//Retrieve First Five Products
const getRecentProducts = async (req, res) => {
  try {
    const products = await productModel.find().sort({ date: -1 }).limit(10);
    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    sendError(res, 400, "Something Is Wrong..!!");
  }
};

//Retrieve Single Product
const getSingleProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    if (productId) {
      const product = await productModel
        .findById(productId)
        .populate("category");

      if (product) {
        res.status(200).json({
          success: true,
          message: "Product Retrieve SuccessFully..!!",
          product,
        });
      } else {
        sendError(res, 400, "Product Not Found..!!");
      }
    } else {
      sendError(res, 400, "Product Id Not Found");
    }
  } catch (error) {
    console.log(error.message);
    sendError(res, 400, "Somethings Is Wrong..!!");
  }
};

module.exports = {
  addProduct,
  deleteProduct,
  updateProduct,
  getAllProduct,
  getRecentProducts,
  getSingleProduct,
};

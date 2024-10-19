const categoryModel = require("../models/categoryModel");
const coludinary = require("cloudinary");
const sendError = require("../utils/sendError");

//Add Category
const addCategory = async (req, res) => {
  try {
    const { categoryName, categoryImage } = req.body;

    const isCategoryExist = await categoryModel.findOne({
      categoryName: categoryName,
    });
    if (isCategoryExist) {
      sendError(res, 400, "Category Already Exist..!!");
    } else {
      const result = await coludinary.v2.uploader.upload(categoryImage, {
        folder: "category",
      });
      const newCategory = await categoryModel.create({
        categoryName,
        categoryImage: result.url,
      });
      res.status(201).json({
        success: true,
        message: "Category Added..!!",
        newCategory,
      });
    }
  } catch (error) {
    sendError(res, 400, error.message);
  }
};

//get all categories
const getAllCategories = async (req, res) => {
  try {
    const CategoriesCount = await categoryModel.find().countDocuments();
    const Categories = await categoryModel.find();
    if (Categories.length == 0) {
      sendError(res, 400, "Categories Not Found..!!");
    } else {
      res.status(200).json({
        success: true,
        Categories,
        CategoriesCount,
        message: "Add Categories Get Successfully..!!",
      });
    }
  } catch (error) {
    sendError(res, 400, "Something Went To Wrong..!!");
  }
};

//delete category
const deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    if (categoryId) {
      const isCategoryExist = await categoryModel.findById(categoryId);
      if (isCategoryExist) {
        const DeletedCategory = await categoryModel.findByIdAndDelete(
          categoryId
        );
        res.status(200).json({
          success: true,
          message: "Category Delete SuccessFully..!!",
          DeletedCategory,
        });
      } else {
        sendError(res, 400, "Category Not Found");
      }
    } else {
      sendError(res, 400, "Category Id Not Found");
    }
  } catch (error) {
    sendError(res, 400, "Something Went's Wrong..!!");
  }
};

//Update Category
const updateCategory = async (req, res) => {
  try {
    if (req.params.categoryId) {
      const category = await categoryModel.findById(req.params.categoryId);
      if (req.body.categoryImage !== "") {
        const { categoryImage } = req.body;

        const result = await coludinary.v2.uploader.upload(categoryImage, {
          folder: "category",
        });
        category.categoryImage = result.url;
        category.categoryName = req.body.categoryName;
        await category.save();
        res.status(200).json({
          success: true,
          message: "Category Updated..!!",
        });
      } else {
        category.categoryName = req.body.categoryName;
        await category.save();
        res.status(200).json({
          success: true,
          message: "Category Updated..!!",
        });
      }
    } else {
      sendError("Category Id Required..!!");
    }
  } catch (error) {
    console.log(error);
    sendError(res, 400, "Somethings Went's To Wrong..!!");
  }
};

module.exports = {
  addCategory,
  getAllCategories,
  deleteCategory,
  updateCategory,
};

// const categoryModel = require("../models/categoryModel");
// const cloudinary = require("cloudinary");
// const sendError = require("../utils/sendError");
// const fs = require('fs');

// // Predefined categories
// const predefinedCategories = [
//   {
//     categoryName: "Fruits",
//     categoryImage: "C:/Users/nisha/grocery-shop/backend/public/uploads/category/fruits.jpeg" // Local image path for fruits
//   },
//   {
//     categoryName: "Dairy",
//     categoryImage: "C:/Users/nisha/grocery-shop/backend/public/uploads/category/dairy.jpeg" // Local image path for dairy
//   },
//   {
//     categoryName: "Vegetables",
//     categoryImage: "C:/Users/nisha/grocery-shop/backend/public/uploads/category/vegetables.jpeg" // Local image path for vegetables
//   }
// ];

// // Add Category
// const addCategory = async (req, res) => {
//   try {
//     const { categoryName, categoryImage } = req.body;

//     const isCategoryExist = await categoryModel.findOne({
//       categoryName: categoryName,
//     });
//     if (!isCategoryExist) {
//       const result = await cloudinary.v2.uploader.upload(categoryImage, {
//         folder: "category",
//       });
//       const newCategory = await categoryModel.create({
//         categoryName,
//         categoryImage: result.url,
//       });
//       res.status(201).json({
//         success: true,
//         message: "Category Added..!!",
//         newCategory,
//       });
//     }
//   } catch (error) {
//     sendError(res, 400, error.message);
//   }
// };

// // Initialize predefined categories
// const initializeCategories = async () => {
//   try {
//     for (const category of predefinedCategories) {
//       // Check if the category already exists
//       const isCategoryExist = await categoryModel.findOne({
//         categoryName: category.categoryName,
//       });

//       if (!isCategoryExist) {
//         if (fs.existsSync(category.categoryImage)) {
//           const result = await cloudinary.v2.uploader.upload(category.categoryImage, {
//             folder: "category",
//           });

//           await categoryModel.create({
//             categoryName: category.categoryName,
//             categoryImage: result.url,
//           });

//           console.log(`Category ${category.categoryName} added successfully!`);
//         } else {
//           console.error(`Image file not found for ${category.categoryName} at:`, category.categoryImage);
//         }
//       } 
//     }
//   } catch (error) {
//     console.error("Error initializing categories:", error.message);
//   }
// };

// initializeCategories();

// // Get all categories
// const getAllCategories = async (req, res) => {
//   try {
//     const CategoriesCount = await categoryModel.find().countDocuments();
//     const Categories = await categoryModel.find();
//     if (Categories.length == 0) {
//       sendError(res, 400, "Categories Not Found..!!");
//     } else {
//       res.status(200).json({
//         success: true,
//         Categories,
//         CategoriesCount,
//         message: "Categories retrieved successfully..!!",
//       });
//     }
//   } catch (error) {
//     sendError(res, 400, "Something went wrong..!!");
//   }
// };

// // Delete category
// const deleteCategory = async (req, res) => {
//   try {
//     const { categoryId } = req.params;
//     if (categoryId) {
//       const isCategoryExist = await categoryModel.findById(categoryId);
//       if (isCategoryExist) {
//         const DeletedCategory = await categoryModel.findByIdAndDelete(categoryId);
//         res.status(200).json({
//           success: true,
//           message: "Category deleted successfully..!!",
//           DeletedCategory,
//         });
//       } else {
//         sendError(res, 400, "Category Not Found");
//       }
//     } else {
//       sendError(res, 400, "Category Id Not Found");
//     }
//   } catch (error) {
//     sendError(res, 400, "Something went wrong..!!");
//   }
// };

// // Update Category
// const updateCategory = async (req, res) => {
//   try {
//     if (req.params.categoryId) {
//       const category = await categoryModel.findById(req.params.categoryId);
//       if (req.body.categoryImage !== "") {
//         const { categoryImage } = req.body;

//         const result = await cloudinary.v2.uploader.upload(categoryImage, {
//           folder: "category",
//         });
//         category.categoryImage = result.url;
//         category.categoryName = req.body.categoryName;
//         await category.save();
//         res.status(200).json({
//           success: true,
//           message: "Category updated successfully..!!",
//         });
//       } else {
//         category.categoryName = req.body.categoryName;
//         await category.save();
//         res.status(200).json({
//           success: true,
//           message: "Category updated successfully..!!",
//         });
//       }
//     } else {
//       sendError(res, 400, "Category Id Required..!!");
//     }
//   } catch (error) {
//     console.log(error);
//     sendError(res, 400, "Something went wrong..!!");
//   }
// };

// module.exports = {
//   addCategory,
//   getAllCategories,
//   deleteCategory,
//   updateCategory,
// };

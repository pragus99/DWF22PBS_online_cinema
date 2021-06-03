const express = require("express");

const router = express.Router();

module.exports = router;

const { auth } = require("../middleware/auth");
const { admin } = require("../middleware/admin");

const { uploadImg } = require("../middleware/uploadImg");

// user

const { register, login, authUser } = require("../controllers/authController");
router.post("/register", register);
router.post("/login", login);
router.get("/authuser", auth, authUser);

const {
  getFilm,
  createFilm,
  updateFilm,
  deleteFilm,
} = require("../controllers/filmController");
router.get("/film/:id", auth, getFilm);

const {
  getPersons,
  getPerson,
  updatePerson,
  deletePerson,
} = require("../controllers/personController");
router.get("/profile/:id", auth, getPerson);
router.patch("/profile/:id", uploadImg("avatar"), auth, updatePerson);

const {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
  getTransactionsByUser,
} = require("../controllers/transactionController");
router.get("/my-films", auth, getTransactionsByUser);
router.post(
  "/transaction",
  auth,
  uploadImg("transferProof"),
  createTransaction
);
router.patch("/transaction/:id", auth, updateTransaction);

// Admin

const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
router.get("/category", admin, getCategories);
router.post("/category", admin, createCategory);
router.patch("/category/:id", admin, updateCategory);
router.delete("/category/:id", admin, deleteCategory);

router.post("/film", admin, uploadImg("thumbnail"), createFilm);
router.patch("/film/:id", admin, uploadImg("thumbnail"), updateFilm);
router.delete("/film/:id", admin, deleteFilm);
router.get("/profile", admin, getPersons);
router.delete("/profile/:id", admin, deletePerson);
router.get("/transactions", admin, getTransactions);
router.delete("/transaction/:id", admin, deleteTransaction);

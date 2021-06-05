const express = require("express");

const router = express.Router();

module.exports = router;

const { auth } = require("../middleware/auth");
const { admin } = require("../middleware/admin");

const { uploadImg } = require("../middleware/uploadImg");

const { register, login, authUser } = require("../controllers/authController");
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const {
  getFilm,
  createFilm,
  updateFilm,
  deleteFilm,
  orderFilm,
} = require("../controllers/filmController");
const {
  getPersons,
  getPerson,
  updatePerson,
  deletePerson,
} = require("../controllers/personController");
const {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
  getTransactionsByUser,
  sendMail,
  notification,
} = require("../controllers/transactionController");

// user

router.post("/register", register);
router.post("/login", login);
router.get("/authuser", auth, authUser);

router.get("/film/:id", auth, getFilm);
router.post("/order", orderFilm);

router.get("/profile/:id", auth, getPerson);
router.patch("/profile/:id", uploadImg("avatar"), auth, updatePerson);

router.get("/my-films", auth, getTransactionsByUser);
router.post("/notification", notification);
router.post("/mail-notif", sendMail);
router.post(
  "/transaction",
  auth,
  uploadImg("transferProof"),
  createTransaction
);
router.patch("/transaction/:id", auth, updateTransaction);

// Admin

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

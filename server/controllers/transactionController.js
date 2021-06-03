const { Person, Transaction, Film, Category } = require("../models");

exports.createTransaction = async (req, res) => {
  try {
    const transferProof = req.files.transferProof[0].filename;

    const transactions = await Transaction.create({
      ...req.body,
      transferProof,
    });
    const { id } = transactions;
    const findTransaction = await Transaction.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "personId", "filmId"],
      },
    });

    res.status(200).send({
      status: "success",
      data: findTransaction,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "server error",
    });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const dataTransactions = await Transaction.findAll({
      include: [
        {
          model: Person,
          as: "person",
          attributes: {
            exclude: [
              "createdAt",
              "updatedAt",
              "phone",
              "password",
              "avatar",
              "is_admin",
            ],
          },
        },
        {
          model: Film,
          as: "film",
          attributes: {
            exclude: ["createdAt", "updatedAt", "categoryId", "filmUrl"],
          },
          include: [
            {
              model: Category,
              as: "category",
              attributes: {
                exclude: ["createdAt", "updatedAt"],
              },
            },
          ],
        },
      ],
      attributes: {
        exclude: ["updatedAt", "filmId"],
      },
    });

    res.status(200).send({
      status: "success",
      data: dataTransactions,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "server error",
    });
  }
};

exports.getTransactionsByUser = async (req, res) => {
  try {
    const dataTransactions = await Transaction.findAll({
      where: { status: "approve" },
      include: [
        {
          model: Film,
          as: "film",
          attributes: {
            exclude: ["createdAt", "updatedAt", "categoryId", "filmUrl"],
          },
          include: [
            {
              model: Category,
              as: "category",
              attributes: {
                exclude: ["createdAt", "updatedAt"],
              },
            },
          ],
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    res.status(200).send({
      status: "success",
      data: dataTransactions,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "server error",
    });
  }
};

exports.updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const dataTransaction = {
      status,
    };

    await Transaction.update(dataTransaction, {
      where: { id },
    });

    const updateTransaction = await Transaction.findAll({
      where: { id },
      attributes: {
        exclude: ["updatedAt"],
      },
    });

    res.status(200).send({
      status: "Success",
      data: updateTransaction,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "server erreeor",
    });
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    const id = req.params.id;

    const findTransaction = await Transaction.findOne({ where: { id } });

    if (!findTransaction) {
      return res.send({
        status: "failed",
        message: "Data not found",
      });
    }
    await Transaction.destroy({ where: { id } });

    res.status(200).send({
      status: "Sucessfully delete data",
      data: { id },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "server error",
    });
  }
};

const { Person, Transaction, Film, Category } = require("../models");
const { v4: uuidv4 } = require("uuid");
const midtransClient = require("midtrans-client");
const nodemailer = require("nodemailer");

exports.createTransaction = async (req, res) => {
  try {
    const { filmId } = req.body;

    if (req.files) {
      var transferProof = req.files.transferProof[0].filename;
    }

    const transactions = await Transaction.create({
      id: uuidv4(),
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
      order: [["createdAt", "ASC"]],
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

    await Transaction.update(req.body, {
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

// Midtrans

const MIDTRANS_CLIENT_KEY = "SB-Mid-client-D1UCzFbCkflWcvS5";
const MIDTRANS_SERVER_KEY = "SB-Mid-server-MtFP6QCMW7nSpIsrEHqFBuQb";

const core = new midtransClient.CoreApi();

core.apiConfig.set({
  isProduction: false,
  clientKey: MIDTRANS_CLIENT_KEY,
  serverKey: MIDTRANS_SERVER_KEY,
});

const midTransaction = async (status, transactionId) => {
  await Transaction.update(
    {
      status,
    },
    {
      where: {
        id: transactionId,
      },
    }
  );
};

exports.notification = async (req, res) => {
  try {
    const data = req.body;
    const statusResponse = await core.transaction.notification(data);
    const orderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;

    if (transactionStatus == "capture") {
      if (fraudStatus == "challenge") {
        midTransaction("pending", orderId);
        res.status(200);
      } else if (fraudStatus == "accept") {
        midTransaction("approve", orderId);
        res.status(200);
      }
    } else if (transactionStatus == "settlement") {
      midTransaction("approve", orderId);
      res.status(200);
    } else if (transactionStatus == "deny") {
      midTransaction("cancel", orderId);
      res.status(200);
    } else if (transactionStatus == "cancel" || transactionStatus == "expire") {
      midTransaction("cancel", orderId);
      res.status(200);
    } else if (transactionStatus == "pending") {
      midTransaction("pending", orderId);
      res.status(200);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "server error",
    });
  }
};

exports.sendMail = async (req, res) => {
  const { order_id, payment_type, gross_amount } = req.body;
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "suntoro1999@gmail.com",
        pass: "prayogo123",
      },
    });

    let info = await transporter.sendMail({
      from: "suntoro1999@gmail.com",
      to: "prayogosuntoro@gmail.com",
      subject: "Transaction Notification",
      html: `<h6>Order id : ${order_id}</h6>
      <h6>gross amaount : ${gross_amount}</h6>
      <h6>Order id : ${payment_type}</h6>`,
    });
    console.log(info.envelope);
    res.status(201);
  } catch (err) {
    console.log(err);
    res.status(500);
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

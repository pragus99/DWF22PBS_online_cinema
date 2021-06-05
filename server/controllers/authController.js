const { Person, Transaction } = require("../models");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const data = req.body;

    const schema = Joi.object({
      fullName: Joi.string().min(3).required(),
      email: Joi.string().email().min(6).required(),
      password: Joi.string()
        .pattern(/^[a-zA-Z0-9]{6,30}$/)
        .required(),
    });

    const { error } = schema.validate(data);

    if (error) {
      return res.send({
        status: "Validation Failed",
        message: error.details[0].message,
      });
    }

    const checkEmail = await Person.findOne({
      where: {
        email,
      },
    });

    if (checkEmail) {
      return res.send({
        status: "Failed",
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const dataPerson = await Person.create({
      ...data,
      password: hashedPassword,
    });

    const updatePerson = await Person.findOne({
      where: {
        email,
      },
    });

    const secretKey = process.env.SECRET_KEY;
    const token = jwt.sign(
      {
        id: updatePerson.id,
        role: updatePerson.is_admin,
      },
      secretKey
    );

    res.status(200).send({
      status: "Success",
      data: {
        Person: {
          email: dataPerson.email,
          fullName: dataPerson.fullName,
          token,
        },
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "Failed",
      message: "Server Error",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return res.send({
        status: "Validation failed",
        message: error.details[0].message,
      });
    }

    const checkEmail = await Person.findOne({
      where: {
        email,
      },
      include: [
        {
          model: Transaction,
          as: "transaction",
        },
      ],
    });

    if (!checkEmail) {
      return res.send({
        status: "Login failed",
        message: "Email/Password is wrong",
      });
    }

    const checkPassword = await bcrypt.compare(password, checkEmail.password);

    if (!checkPassword) {
      return res.send({
        status: "Login Failed",
        message: "Email/Password is wrong",
      });
    }

    const secretKey = process.env.SECRET_KEY;
    const token = jwt.sign(
      {
        id: checkEmail.id,
        role: checkEmail.is_admin,
      },
      secretKey
    );

    res.send({
      status: "success",
      data: {
        user: {
          id: checkEmail.id,
          fullName: checkEmail.fullName,
          email: checkEmail.email,
          avatar: checkEmail.avatar,
          phone: checkEmail.phone,
          role: checkEmail.is_admin,
          token,
          transaction: checkEmail.transaction,
        },
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Server error",
    });
  }
};

exports.authUser = async (req, res) => {
  try {
    const id = req.userId;
    const dataPerson = await Person.findOne({
      where: {
        id,
      },
      include: [
        {
          model: Transaction,
          as: "transaction",
        },
      ],
      attributes: {
        exclude: ["createdAt", "updateAt", "password"],
      },
    });

    if (!dataPerson) {
      return res.status(404).send({
        status: "Failed",
      });
    }

    res.status(200).send({
      status: "Success",
      message: "person valid",
      data: {
        user: {
          id: dataPerson.id,
          name: dataPerson.fullName,
          email: dataPerson.email,
          avatar: dataPerson.avatar,
          phone: dataPerson.phone,
          role: dataPerson.is_admin,
          transaction: dataPerson.transaction,
        },
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "server error",
    });
  }
};

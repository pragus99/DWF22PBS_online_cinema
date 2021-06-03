const { Person, Transaction, Film, Category } = require("../models");
const fs = require("fs");

exports.getPersons = async (req, res) => {
  try {
    const dataPerson = await Person.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt", "password", "is_admin"],
      },
    });
    res.status(200).send({
      status: "success",
      data: { Persons: dataPerson },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "server error",
    });
  }
};

exports.getPerson = async (req, res) => {
  const { id } = req.params;

  try {
    const dataPerson = await Person.findOne({
      where: {
        id,
      },
      include: [
        {
          model: Transaction,
          as: "transaction",
          attributes: {
            exclude: ["updatedAt", "personId"],
          },
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
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt", "password", "is_admin"],
      },
    });

    if (!dataPerson) {
      return res.send({
        status: "failed",
        message: "data not found",
      });
    }

    res.status(200).send({
      status: "success",
      data: {
        person: dataPerson,
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

exports.updatePerson = async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body;

    const findPerson = await Person.findOne({ where: { id } });

    if (!findPerson) {
      return res.send({
        status: "Error",
        message: "Person doesn't exist",
      });
    }

    if (req.files) {
      var avatar = req.files.avatar[0].filename;

      fs.stat(`storage/${findPerson.avatar}`, function (err, stats) {
        if (err) {
          return console.log(err);
        }

        fs.unlink(`storage/${findPerson.avatar}`, (err) => {
          if (err) {
            console.log(err);
          }
        });
      });
    }

    const dataUpdated = {
      ...body,
      avatar,
    };

    await Person.update(dataUpdated, {
      where: { id },
    });

    const updatePerson = await Person.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["updatedAt", "createdAt", "password", "is_admin"],
      },
    });
    console.log(updatePerson),
      res.status(200).send({
        status: "success",
        data: { person: updatePerson },
      });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "server error",
    });
  }
};

exports.deletePerson = async (req, res) => {
  try {
    const id = req.params.id;

    const findPerson = await Person.findOne({ where: { id } });

    if (!findPerson) {
      return res.send({
        status: "failed",
        message: "Data not found",
      });
    }
    await Person.destroy({ where: { id } });

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

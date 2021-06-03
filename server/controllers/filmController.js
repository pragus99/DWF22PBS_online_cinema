const { Film, Category } = require("../models");
const fs = require("fs");

exports.getFilms = async () => {
  let dataFilms = await Film.findAll({
    include: [
      {
        model: Category,
        as: "category",
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      },
    ],
    attributes: {
      exclude: ["createdAt", "updatedAt", "categoryId"],
    },
  });
  dataFilms = JSON.parse(JSON.stringify(dataFilms));

  return dataFilms.map((films) => {
    return {
      ...films,
    };
  });
};

exports.getFilm = async (req, res) => {
  const { id } = req.params;

  try {
    const dataFilm = await Film.findOne({
      where: {
        id,
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
      attributes: {
        exclude: ["createdAt", "updatedAt", "categoryId"],
      },
    });

    if (!dataFilm) {
      return res.send({
        status: "failed",
        message: "data not found",
      });
    }

    res.status(200).send({
      status: "success",
      data: { film: dataFilm },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "server error",
    });
  }
};

exports.createFilm = async (req, res) => {
  try {
    const thumbnail = req.files.thumbnail[0].filename;

    const dataFilm = await Film.create({
      ...req.body,
      thumbnail,
    });
    const { id } = dataFilm;

    const findFilm = await Film.findOne({
      where: {
        id,
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
      attributes: {
        exclude: ["createdAt", "updatedAt", "categoryId"],
      },
    });
    res.status(200).send({
      status: "success",
      data: findFilm,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "server error",
    });
  }
};

exports.updateFilm = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const findFilm = await Film.findOne({ where: { id } });

    if (!findFilm) {
      return res.send({
        status: "failed",
        message: "data not found",
      });
    }

    if (req.files) {
      var thumbnail = req.files.thumbnail[0].filename;

      fs.stat(`storage/${findFilm.thumbnail}`, function (err, stats) {
        if (err) {
          return console.log(err);
        }

        fs.unlink(`storage/${findFilm.thumbnail}`, (err) => {
          if (err) {
            return console.log(err);
          }
        });
      });
    }

    const dataFilm = {
      ...body,
      thumbnail,
    };
    await Film.update(dataFilm, {
      where: { id },
    });

    const updateFilm = await Film.findOne({
      where: { id },
      include: [
        {
          model: Category,
          as: "category",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      ],
      attributes: { exclude: ["updatedAt", "createdAt", "categoryId"] },
    });

    res.status(200).send({
      status: "Success",
      data: {
        film: updateFilm,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: "failed",
      message: "server error",
    });
  }
};

exports.deleteFilm = async (req, res) => {
  try {
    const id = req.params.id;

    const findFilm = await Film.findOne({ where: { id } });

    if (!findFilm) {
      return res.send({
        status: "failed",
        message: "Data not found",
      });
    }

    fs.unlink(`storage/${findFilm.thumbnail}`, (err) => {
      if (err) {
        console.log(err);
      }
    });

    await Film.destroy({ where: { id } });

    res.status(200).send({
      status: "success",
      data: { id: findFilm.id },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "server error",
    });
  }
};

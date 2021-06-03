const { Category } = require("../models");

exports.getCategories = async (req, res) => {
  try {
    const dataCategories = await Category.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    res.status(200).send({
      status: "success",
      data: dataCategories,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "server error",
    });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const checkName = await Category.findOne({
      where: {
        name,
      },
    });

    if (checkName) {
      return res.send({
        status: "Failed",
        message: "Category already Created",
      });
    }

    const dataCategory = await Category.create({
      ...req.body,
    });

    res.status(200).send({
      status: "success",
      data: { name: dataCategory.name },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "server error",
    });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const findCategory = await Category.findOne({ where: { id } });

    if (!findCategory) {
      return res.send({
        status: "failed",
        message: "data not found",
      });
    }

    const dataCategory = {
      ...req.body,
    };

    await Category.update(dataCategory, {
      where: { id },
    });

    const updateCategory = await Category.findOne({
      where: { id },
      attributes: { exclude: ["updatedAt", "createdAt"] },
    });

    res.status(200).send({
      status: "Success",
      data: updateCategory,
    });
  } catch (error) {
    res.status(500).send({
      status: "failed",
      message: "server error",
    });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const id = req.params.id;

    const findCategory = await Category.findOne({ where: { id } });

    if (!findCategory) {
      return res.send({
        status: "failed",
        message: "Data not found",
      });
    }

    await Category.destroy({ where: { id } });

    res.status(200).send({
      status: "success",
      data: { id: findCategory.id },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "server error",
    });
  }
};

const { Comment, Person, Film } = require("../models");

exports.getComments = async (req, res) => {
  try {
    const dataComment = await Comment.findAll({
      include: [
        {
          model: Person,
          as: "person",
        },
        { model: Film, as: "film" },
      ],
      attributes: {
        exclude: ["createdAt", "updateAt"],
      },
      order: [["createdAt", "DESC"]],
    });
    res.status(200).send({
      status: "success",
      data: dataComment,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "server error",
    });
  }
};

exports.createComment = async (req, res) => {
  try {
    const dataComment = await Comment.create({
      ...req.body,
    });

    res.status(200).send({
      status: "success",
      data: dataComment,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "server error",
    });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const id = req.params.id;

    const findComment = await Comment.findOne({ where: { id } });

    if (!findComment) {
      return res.send({
        status: "failed",
        message: "Data not found",
      });
    }

    await Comment.destroy({ where: { id } });

    res.status(200).send({
      status: "success",
      data: findComment,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "server error",
    });
  }
};

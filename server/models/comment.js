"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Comment.belongsTo(models.Person, {
        as: "person",
        foreignKey: {
          name: "personId",
        },
      });
      Comment.belongsTo(models.Film, {
        as: "film",
        foreignKey: {
          name: "filmId",
        },
      });
    }
  }
  Comment.init(
    {
      personId: DataTypes.INTEGER,
      filmId: DataTypes.INTEGER,
      text: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Comment",
    }
  );
  return Comment;
};

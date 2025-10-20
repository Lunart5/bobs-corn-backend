import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import User from "./User";

class Sale extends Model {
  public id!: number;
  public userId!: number;
  public amount!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Sale.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
  },
  {
    sequelize,
    tableName: "sales",
    timestamps: true,
  },
);

User.hasMany(Sale, { foreignKey: "userId", as: "sales" });
Sale.belongsTo(User, { foreignKey: "userId", as: "user" });

export default Sale;

import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import bcrypt from "bcrypt";

class User extends Model {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public address!: string;
  public role!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}
const saltRounds = 12;

const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, saltRounds);
};

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "USER",
    },
    address: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(128),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        len: [5, 128],
      },
    },
  },
  {
    sequelize,
    tableName: "users",
    timestamps: true,
    hooks: {
      beforeCreate: async (user: User): Promise<void> => {
        if (user.password) {
          user.password = await hashPassword(user.password);
        }
      },
      beforeUpdate: async (user: User): Promise<void> => {
        if (user.changed("password") && user.password) {
          user.password = await hashPassword(user.password);
        }
      },
    },
  },
);

export default User;

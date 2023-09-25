'use strict';
import * as Sequelize from 'sequelize';

import { MedicationsAttributes } from '../interface/models';

module.exports = (sequelize: any, DataTypes: any) => {
  class Medications extends Sequelize.Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
      // define association here
      Medications.belongsTo(models.Drone, {
        foreignKey: 'drone_id',
        targetKey: 'id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }
  Medications.init(
    {
      name: DataTypes.STRING,
      code: DataTypes.STRING,
      weight: DataTypes.FLOAT,
      image: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Medications',
    },
  );
  return Medications;
};

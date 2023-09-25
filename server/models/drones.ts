'use strict';
import * as Sequelize from 'sequelize';
import { DronesAttrributes } from '../interface/models';

module.exports = (sequelize: any, DataTypes: any) => {
  class Drones extends Sequelize.Model<DronesAttrributes> {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
      // define association here
      Drones.associate = (models) => {
        Drones.hasMany(models.Medication, {
          foreignKey: 'drone_id',
          sourceKey: 'id',
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        });
      };
    }
  }

  Drones.init(
    {
      serial_number: DataTypes.STRING,
      model: DataTypes.STRING,
      weight_limit: DataTypes.STRING,
      battery_capacity: DataTypes.STRING,
      state: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Drones',
    },
  );
  return Drones;
};

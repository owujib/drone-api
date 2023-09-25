/**modules import */
import { Response, Request, NextFunction } from 'express';
import Joi from 'joi';
import { randomUUID } from 'crypto';

/**file imports */
import Controller from '.';
import Helper from '../../helpers';
import HttpStatusCode from '../../helpers/HttpsResponse';
import Validator from '../../helpers/Validator';

import db from '../../models';
import ApiError from '../../utils/ApiError';
import { DronesAttrributes } from '../../interface/models';

class DronesController extends Controller {
  constructor() {
    super();
  }

  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { error } = Validator.validateBody(req, {
        model: Joi.string()
          .required()
          .valid('Lightweight', 'Middleweight', 'Cruiserweight', 'Heavyweight'),
        weight_limit: Joi.string().required(),
        battery_capacity: Joi.string().required(),
        state: Joi.string()
          .required()
          .valid(
            'IDLE',
            'LOADING',
            'LOADED',
            'DELIVERING',
            'DELIVERED',
            'RETURNING',
          ),
      });
      if (error) {
        return next(Validator.RequestValidationError(error.message));
      }

      /**check if dron exists */
      if (
        await db.Drones.findOne({
          where: {
            serial_number: req.body.serial_number,
          },
        })
      ) {
        return next(
          new ApiError(
            'Serial number already exist',
            HttpStatusCode.HTTP_BAD_REQUEST,
            {
              message: 'A drone with the given serail number exists',
            },
          ),
        );
      }

      const newDrone = await db.Drones.create(req.body);
      return super.sendSuccessResponse(
        res,
        newDrone,
        'A new drone has been added',
        HttpStatusCode.HTTP_CREATED,
      );
    } catch (error) {
      return next(error);
    }
  }

  public async loadDrone(req: Request, res: Response, next: NextFunction) {
    try {
      const drone = await db.Drones.findByPk(req.params.drone_id);
      const medication = await db.Medications.findByPk(
        req.params.medication_id,
      );

      if (!drone || !medication) {
        return next(
          new ApiError(
            'Something went wrong',
            HttpStatusCode.HTTP_BAD_REQUEST,
            {
              message: 'Could not find any resource for drones or medications',
            },
          ),
        );
      }
      if (drone.state !== 'IDLE' && drone.weight_limit < medication.weight) {
        return next(
          new ApiError(
            'Request not completed',
            HttpStatusCode.HTTP_BAD_REQUEST,
            {
              message:
                'Medication weight is more than what the drone can carry',
            },
          ),
        );
      }

      if (drone !== 'IDLE' && drone.battery_capacity < medication.weight) {
        return next(
          new ApiError(
            'Request not completed',
            HttpStatusCode.HTTP_BAD_REQUEST,
            {
              message: 'Drone battery capacity is below 25%',
            },
          ),
        );
      }

      return super.sendSuccessResponse(
        res,
        { drone, medication },
        'Drone loaded successfully',
        HttpStatusCode.HTTP_OK,
      );
    } catch (error) {
      return next(error);
    }
  }

  checkDroneState(
    drone: any,
    medicationWeight: number,
    batteryThreshold: number,
  ) {
    return (
      drone.state === 'IDLE' &&
      drone.battery_capacity >= batteryThreshold &&
      drone.weight_limit >= medicationWeight
    );
  }

  async updateDroneState(
    drone: any,
    newStateValue: string,
    newBatteryLevel: number,
  ) {
    drone.state = newStateValue;
    drone.battery_capacity = newBatteryLevel;
    await drone.save();
  }
}

export default new DronesController();

export interface UserAttributes {
  id?: number;
  firstname?: string;
  lastname?: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MedicationsAttributes {
  id?: number;
  code: string;
  weight: number;
  image: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface DronesAttrributes {
  id?: number;
  serial_number: string;
  model: string;
  weight_limit: string;
  battery_capacity: string;
  state: string;
  createdAt?: Date;
  updatedAt?: Date;
}

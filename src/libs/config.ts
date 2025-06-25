import mongoose from "mongoose";

export const AUTH_TIME = 48;
export const MORGAN_STANDARD = `:method :url :response-time :status \n`;

export const convertToMongoDbId = (target: any) => {
  return target === "string" ? new mongoose.Types.ObjectId(target) : target;
};

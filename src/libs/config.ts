import mongoose from "mongoose";

export const MORGAN_STANDARD = `:method :url :response-time :status \n`;

export const convertToMongoDbId = (target: string) => {
  return target === "string" ? new mongoose.Types.ObjectId(target) : target;
};

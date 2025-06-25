export enum HttpCode {
  OK = 200,
  CREATED = 201,
  NOT_MODIFIED = 304,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

export enum Message {
  SOMETHING_WENT_WRONG = "something went wrong",
  NO_DATA_FOUND = "No data is found!",
  CREATE_FAILED = "Create is failed! Admin already exists",
  UPDATE_FAILED = "Update is failed!",
  USER_NOT_FOUND = "User not found, wrong Id",
  WRONG_PASSWORD = "Password is incorrect",
  USED_NICK_PHONE = "Used Nickname or Email",
  NOT_AUTHENTICATED = "You are not authenticated yet, Please Login first!",
  MORE_IMAGE = "Please upload more than one photos!",
  PROFILE_IMAGE_NEEDED = "ㅖlease, Upload Profile Image!",
  BLOCKED_USER = "You are blocked, please connect to the Restaurant",
  TOKEN_CREATION_FAIL = "TOKEN_CREATION_FAIL",
}

class Errors extends Error {
  public code: HttpCode;
  public message: Message;

  static standard = {
    code: HttpCode.INTERNAL_SERVER_ERROR,
    message: Message.SOMETHING_WENT_WRONG,
  };

  constructor(statusCode: HttpCode, errorMessage: Message) {
    super();
    this.code = statusCode;
    this.message = errorMessage;
  }
}
export default Errors;

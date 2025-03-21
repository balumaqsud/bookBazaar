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
    CREATE_FAILED = "Create is failed!",
    UPDATE_FAILED = "Update is failed!",
    USER_NOT_FOUND = "User not found, wrong Id",
    WRONG_PASSWORD = "Password is incorrect"
}

class Errors extends Error {
    public code: HttpCode;
    public message: Message;

    constructor(statusCode: HttpCode, errorMessage: Message) {
        super()
        this.code  = statusCode;
        this.message = errorMessage;
    }
}
export default Errors;
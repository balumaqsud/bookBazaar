import Errors, { HttpCode, Message } from "../libs/Errors";
import { AUTH_TIME } from "../libs/config";
import { Member } from "../libs/types/member";
import jwt from "jsonwebtoken";

class AuthService {
  private readonly secret_token;
  constructor() {
    this.secret_token = process.env.SECRET_TOKEN as string;
  }

  public async createToken(payload: Member) {
    return new Promise((resolve, reject) => {
      const duration = `${AUTH_TIME}h`;
      jwt.sign(
        payload,
        process.env.SECRET_TOKEN as string,
        {
          expiresIn: duration,
        },
        (error, token) => {
          if (error) {
            console.log(error);
            reject(
              new Errors(HttpCode.UNAUTHORIZED, Message.TOKEN_CREATION_FAIL)
            );
          } else {
            resolve(token as string);
          }
        }
      );
    });
  }

  public async checkAuth(token: string): Promise<Member> {
    const result: Member = (await jwt.verify(
      token,
      process.env.SECRET_TOKEN as string
    )) as Member;
    console.log(`member nick check: ${result.memberNick}`);
    return result;
  }
}

export default AuthService;

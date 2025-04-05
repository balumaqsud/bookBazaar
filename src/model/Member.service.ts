import { MemberInput, Member, LoginInput } from "../libs/types/member";
import MemberModel from "../schema/Member.model";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { MemberType } from "../libs/enums/member.enum";
import bcrypt from "bcryptjs";

//Member service helps us to control member schema and stands between schema and controller!
class MemberService {
  private readonly memberModel;
  //schema from schemaModel
  constructor() {
    this.memberModel = MemberModel;
  }
  //SPA
  public async signup(input: MemberInput): Promise<Member> {
    const salt = await bcrypt.genSalt();
    input.memberPassword = await bcrypt.hash(input.memberPassword, salt);
    try {
      const result = await this.memberModel.create(input);
      result.memberPassword = "";
      return result.toJSON() as Member;
    } catch (error) {
      throw new Errors(HttpCode.BAD_REQUEST, Message.USED_NICK_PHONE);
    }
  }
  public async login(input: LoginInput): Promise<Member> {
    const member = await this.memberModel
      .findOne(
        { memberNick: input.memberNick },
        { memberNick: 1, memberPassword: 1 }
      )
      .exec();
    if (!member) throw new Errors(HttpCode.NOT_FOUND, Message.USER_NOT_FOUND);

    const isMatch = await bcrypt.compare(
      input.memberPassword,
      member.memberPassword
    );
    if (!isMatch)
      throw new Errors(HttpCode.UNAUTHORIZED, Message.WRONG_PASSWORD);

    const result = await this.memberModel.findById(member._id).exec();
    return result?.toObject() as Member;
  }

  //SSR
  //signin process
  public async processSignUp(input: MemberInput): Promise<Member> {
    // throwing error if admin type exists
    const exist = await this.memberModel
      .findOne({ memberType: MemberType.ADMIN })
      .exec();
    if (exist) {
      console.log("admin exist");
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }

    //hashing password coming in input
    const salt = await bcrypt.genSalt();
    input.memberPassword = await bcrypt.hash(input.memberPassword, salt);

    //tying to create and admin with memberModel.create()
    try {
      const result = await this.memberModel.create(input);
      result.memberPassword = "";
      //sending result as Member type
      return result.toObject() as Member;
    } catch (error) {
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }
  //login process
  public async processLogin(input: LoginInput): Promise<Member> {
    //finding memberNick in database as the same as input's memberNick! and returning memberNick and password
    const member = await this.memberModel
      .findOne(
        { memberNick: input.memberNick },
        { memberNick: 1, memberPassword: 1 }
      )
      .exec();
    if (!member) throw new Errors(HttpCode.NOT_FOUND, Message.USER_NOT_FOUND);
    //checking if input's password and password in db is the same!
    const isMatch = await bcrypt.compare(
      input.memberPassword,
      member.memberPassword
    );
    if (!isMatch)
      throw new Errors(HttpCode.BAD_REQUEST, Message.WRONG_PASSWORD);

    //finding member in db
    const result = await this.memberModel.findById(member._id).exec();
    return result?.toObject() as Member;
  }

  public async getAllUsers(): Promise<any> {
    const result = await this.memberModel
      .find({
        memberType: MemberType.ADMIN,
      })
      .exec();
    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    return result;
  }
  public async updateTheUser(id: string, input: any): Promise<Member> {
    const result = await this.memberModel
      .findByIdAndUpdate(
        {
          _id: id,
        },
        input,
        { new: true }
      )
      .exec();
    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    return result.toObject() as Member;
  }
}
export default MemberService;

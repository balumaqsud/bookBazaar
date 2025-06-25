import {
  MemberInput,
  Member,
  LoginInput,
  MemberUpdateInput,
  ExtendedRequest,
} from "../libs/types/member";
import MemberModel from "../schema/Member.model";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { MemberStatus, MemberType } from "../libs/enums/member.enum";
import bcrypt from "bcryptjs";
import { convertToMongoDbId } from "../libs/config";

//Member service helps us to control member schema and stands between schema and controller!
class MemberService {
  private readonly memberModel;
  //schema from schemaModel
  constructor() {
    this.memberModel = MemberModel;
  }

  public async getAdmin(): Promise<Member> {
    const result = await this.memberModel
      .findOne({ memberType: MemberType.ADMIN })
      .exec();

    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    return result.toJSON() as Member;
  }

  //signin process
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
    const status = console.log(input);
    const member = await this.memberModel
      .findOne(
        {
          memberNick: input.memberNick,
          memberStatus: { $ne: MemberStatus.DELETE },
        },
        { memberNick: 1, memberPassword: 1, memberStatus: 1 }
      )
      .exec();
    if (!member) throw new Errors(HttpCode.NOT_FOUND, Message.USER_NOT_FOUND);
    else if (member.memberStatus === MemberStatus.BLOCK) {
      throw new Errors(HttpCode.FORBIDDEN, Message.BLOCKED_USER);
    }

    const isMatch = await bcrypt.compare(
      input.memberPassword,
      member.memberPassword
    );
    if (!isMatch)
      throw new Errors(HttpCode.UNAUTHORIZED, Message.WRONG_PASSWORD);

    //lean() cannot be used for further errors it makes
    const result = await this.memberModel.findById(member._id).exec();
    return result?.toJSON() as Member;
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
        memberType: MemberType.USER,
      })
      .exec();
    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    return result;
  }

  //updateMember
  public async updateMember(
    member: Member,
    input: MemberUpdateInput
  ): Promise<Member> {
    const memberID = convertToMongoDbId(member._id);
    const result = await this.memberModel
      .findByIdAndUpdate({ _id: memberID }, input, { new: true })
      .exec();
    if (!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);

    return result.toJSON() as Member;
  }

  public async getMemberDetail(member: Member): Promise<Member> {
    const memberId = convertToMongoDbId(member._id);
    const result = await this.memberModel
      .findOne({
        _id: memberId,
        memberStatus: MemberStatus.ACTIVE,
      })
      .exec();

    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

    return result.toJSON() as Member;
  }

  //top Users
  public async getTopUsers(): Promise<any> {
    const result = await this.memberModel
      .find({
        memberStatus: MemberStatus.ACTIVE,
        memberPoints: { $gte: 1 },
      })
      .sort({ memberPoints: -1 })
      .limit(4)
      .exec();

    if (!result || result.length === 0) {
      throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    }

    return result;
  }

  public async updateTheUser(input: MemberUpdateInput): Promise<Member> {
    input._id = convertToMongoDbId(input._id);
    const result = await this.memberModel
      .findByIdAndUpdate(
        {
          _id: input._id,
        },
        input,
        { new: true }
      )
      .exec();
    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    return result.toObject() as Member;
  }
  //addUserPoint
  public async addUserPoint(member: Member): Promise<Member> {
    const memberId = convertToMongoDbId(member._id);
    const result = await this.memberModel.findOneAndUpdate(
      {
        _id: memberId,
        memberStatus: MemberStatus.ACTIVE,
        memberType: MemberType.USER,
      },
      { $inc: { memberPoints: 1 } },
      { new: true }
    );
    return result?.toJSON() as Member;
  }
}
export default MemberService;

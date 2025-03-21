import { MemberInput, Member, LoginInput } from "../libs/types/member";
import MemberModel from "../schema/Member.model";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { MemberType } from "../libs/enums/member.types";

class MemberService {
    private readonly memberModel;

    constructor() {
        this.memberModel = MemberModel;
    }

    public async proccessSignUp(input: MemberInput): Promise<Member>{
        //thowing erro if admin type exists
        const exist = await this.memberModel.findOne({memberType: MemberType.ADMIN}).exec()
        if(exist) {
            console.log('admin exist')
            throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED)}
        //tring to create and admin with memberModel.create()
        //sending result as Member type
        try {
            const result = await this.memberModel.create(input)
            result.memberPassword = "";
            return result.toObject() as Member;   
        } catch (error) {
            throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED)
        }
        
    }

    public async proccessLogin(input: LoginInput): Promise<Member> {
        const member = await this.memberModel.findOne({memberNick: input.memberNick}, {memberNick: 1, memberPassword: 1}).exec()
        if(!member) throw new Errors(HttpCode.NOT_FOUND, Message.USER_NOT_FOUND)

        const isMatch = input.memberPassword === member.memberPassword;
        if(!isMatch) throw new Errors(HttpCode.BAD_REQUEST, Message.WRONG_PASSWORD)
        
        const result = await this.memberModel.findById(member._id).exec()
        return result?.toObject() as Member;
        
    }

}

export default MemberService;
import mongoose, {Schema} from "mongoose";
import { MemberType, MemberStatus } from "../libs/enums/member.types";

const memberSchema = new Schema({
    memberType: {
        type: String,
        enum: MemberType,
        default: MemberType.USER
    },
    memberStatus: {
        type: String,
        enum: MemberStatus,
        default: MemberStatus.ACTIVE
    },
    memberNick: {
        type: String,
        index: {unique: true},
        required: true
    },
    memberPhone: {
        type: String,
        index: {unique: true},
        required: true
    },
    memberPassword: {
        type: String,
        select: false,
        required: true
    },
    memberPoints: {
        type: Number,
        default: 0
    },
    memberDescription: {
        type: String
    },
     memberImage: {
        type: String
    }, 
    memberAdress: {
        type: String
    }
}, {timestamps: true});

export default mongoose.model("Member", memberSchema);

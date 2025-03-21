import { ObjectId } from "mongoose";
import { MemberStatus, MemberType } from "../enums/member.types";

export interface Member {
    _id: ObjectId;
    memberType: MemberType;
    memberStatus: MemberStatus;
    memberNick:string;
    memberPassword?: string;
    memberPhone: string;
    memberAdress?: string;
    memberImage?: string;
    memberDescription?: string;
    memberPoints: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface MemberInput {
    memberType?: MemberType;
    memberStatus?: MemberStatus;
    memberNick:string;
    memberPassword: string;
    memberPhone: string;
    memberAdress?: string;
    memberImage?: string;
    memberDescription?: string;
    memberPoints?: number;
}

export interface LoginInput {
    memberNick:string;
    memberPassword: string;
}

import Errors, { Message, HttpCode } from "../libs/Errors";
import { View, ViewInput } from "../libs/types/view";
import ViewModel from "../schema/View.model";

class ViewService {
  private readonly viewModel;

  constructor() {
    this.viewModel = ViewModel;
  }

  public async checkViewExistence(input: ViewInput): Promise<View> {
    const view = await this.viewModel
      .findOne({ memberId: input.memberId, viewRefId: input.viewRefId })
      .exec();

    return view?.toObject() as View;
  }

  public async insertMemberView(input: ViewInput): Promise<View> {
    try {
      return (await this.viewModel.create(input)).toObject() as View;
    } catch (error) {
      console.log("insertMemberError", error);
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }
}

export default ViewService;

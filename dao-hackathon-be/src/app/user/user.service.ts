import { User } from "@schemas";
import { GetUserInput, CreateUserInput, UpdateVoteInput } from "./user";
import { DAOService } from "@app/dao/dao.service";

export class UserService {
  async GetUser({ wallet_address }: GetUserInput) {
    try {
      const user = await User.findOne({ wallet_address });
      if (!user) throw { message: "User not found" };
      return user;
    } catch (error: any) {
      throw error.message;
    }
  }

  async CreateUser({ wallet_address }: CreateUserInput) {
    try {
      const wallet = await User.findOne({ wallet_address });
      if (wallet) return wallet;

      const daoService = new DAOService();
      const power = await daoService.GetPower(wallet_address);

      const user = await User.create({ wallet_address });
      user.votes = power;
      return await user.save();
    } catch (error: any) {
      throw error.message;
    }
  }

  async UpdateVote({ wallet_address, votes }: UpdateVoteInput) {
    try {
      const user = await User.findOneAndUpdate(
        { wallet_address },
        { votes },
        { new: true }
      );
      if (!user) throw { message: "User not found" };
    } catch (error: any) {
      throw error.message;
    }
  }

  async UpdateAllUserVote() {
    try {
      const users = await User.find({});
      if (!users) throw { message: "User not found" };
      const daoService = new DAOService();
      users.forEach(async (user) => {
        const votes = await daoService.GetPower(user.wallet_address);
        await this.UpdateVote({ wallet_address: user.wallet_address, votes });
      });
      return users;
    } catch (error: any) {
      throw error.message;
    }
  }
}

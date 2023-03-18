import { Position, PositionPower } from "bupbethuytinh";
import { card, cardPosition, getTotalNFT, getTotalRewards } from "@providers";

export class CardService {
  public async GetVotingUnits(address: string): Promise<string> {
    try {
      const data = await card.getVotingUnits(address);
      return data;
    } catch (error: any) {
      throw error.message;
    }
  }

  public async GetCardPower(tokenId: string): Promise<PositionPower> {
    try {
      const data = await cardPosition.getCardPower(tokenId);
      return data;
    } catch (error: any) {
      throw error.message;
    }
  }

  public async GetPositionPower(position: Position): Promise<PositionPower> {
    try {
      const data = await cardPosition.getPositionPower(position);
      return data;
    } catch (error: any) {
      throw error.message;
    }
  }

  public async GetPosition(tokenId: any): Promise<Position> {
    try {
      const data = await cardPosition.getPosition(tokenId);
      return data;
    } catch (error: any) {
      throw error.message;
    }
  }

  public async GetTotalNFT(): Promise<number> {
    try {
      const data = await getTotalNFT();
      return data;
    } catch (error: any) {
      throw error.message;
    }
  }

  public async GetTotalRewards(): Promise<any> {
    try {
      const data = await getTotalRewards();
      return parseInt(data) / 10 ** 18;
    } catch (error: any) {
      throw error.message;
    }
  }
}

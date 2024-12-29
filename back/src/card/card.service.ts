import { injectable } from "tsyringe";
import { Card, CardInterface } from "./card.model";
import { logger } from "../main";

@injectable()
export class CardService {
    constructor() { }

    createCard(cardInfo: CardInterface) {
        logger.trace(`Creating new card with info: `, cardInfo)
        const card = new Card(cardInfo)
        card.save()
        logger.trace(`Created new card`)
    }
}
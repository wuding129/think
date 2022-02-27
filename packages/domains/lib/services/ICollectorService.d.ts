import { IUser, IWiki, IDocument, CollectType } from "../models";
export declare type ICollectDto = {
    targetId: IWiki["id"] | IDocument["id"];
    type: CollectType;
};
export declare abstract class ICollectorService {
    abstract toggleCollect(data: ICollectDto, user?: IUser): Promise<void>;
    abstract checkCollect(data: ICollectDto): Promise<boolean>;
    abstract getCollectWikis(user?: IUser): Promise<IWiki[]>;
    abstract getCollectDocuments(user?: IUser): Promise<IDocument[]>;
}

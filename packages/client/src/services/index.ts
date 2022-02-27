import "reflect-metadata";
import { Container } from "inversify";
import {
  IRequestService,
  IUserService,
  IWikiService,
  IDocumentService,
  ICommentService,
  ICollectorService,
  IMessageService,
  ITemplateService,
  IFileService,
} from "@think/domains";
import { RequestService } from "./request";
import { UserService } from "./user";
import { WikiService } from "./wiki";
import { DocumentService } from "./document";
import { CommentService } from "./comment";
import { CollectorService } from "./collector";
import { TemplateService } from "./template";
import { MessageService } from "./message";
import { FileService } from "./file";

export const container = new Container();

function injectService(definition, service) {
  container.bind<typeof definition>(definition).to(service).inSingletonScope();
}

[
  [IRequestService, RequestService],
  [IUserService, UserService],
  [IWikiService, WikiService],
  [IDocumentService, DocumentService],
  [ICommentService, CommentService],
  [ICollectorService, CollectorService],
  [ITemplateService, TemplateService],
  [IMessageService, MessageService],
  [IFileService, FileService],
].forEach(([definition, service]) => {
  injectService(definition, service);
});

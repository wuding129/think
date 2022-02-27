import { inject, injectable } from "inversify";
import { makeAutoObservable } from "mobx";
import { IRequestService, IFileService } from "@think/domains";

@injectable()
export class FileService implements IFileService {
  @inject(IRequestService)
  private requestService: IRequestService;

  uploadLoading = false;
  uploadError = null;

  constructor() {
    makeAutoObservable(this);
  }

  uploadFile(file: any): Promise<string> {
    if (process.env.ENABLE_ALIYUN_OSS) {
      return Promise.reject(
        new Error("阿里云OSS配置不完善，请自行实现上传文件！")
      );
    }
    this.uploadLoading = true;
    this.uploadError = null;
    try {
      const formData = new FormData();
      formData.append("file", file);

      return this.requestService.post("/file/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (e) {
      this.uploadError = e;
    } finally {
      this.uploadLoading = false;
    }
  }
}

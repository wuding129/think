export abstract class IFileService {
  /**
   * 上传文件
   * @param file
   */
  abstract uploadFile(file): Promise<string>;
}

/** 内部创建，接口只需上传接收文件 */
export class CreateOssDto {
  constructor(url, mimetype, path, size, oldName) {
    this.ossUrl = url
    this.ossType = mimetype
    this.ossLocation = path
    this.ossSize = size
    this.ossOldName = oldName
  }
  ossOldName: string
  ossUrl: string;
  ossSize: number;
  ossType: string;
  ossLocation: string;
}

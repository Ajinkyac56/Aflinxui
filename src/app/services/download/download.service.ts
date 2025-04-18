import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GlobalConstants } from 'src/app/config/GlobalConstants';
import { ToastrService } from 'ngx-toastr';
import { FileSaverService } from 'ngx-filesaver';

@Injectable({
  providedIn: 'root',
})
export class DownloadService {
  fileDownloadAPI = GlobalConstants.API_SERVER_URL + GlobalConstants.API_BASE_URL + GlobalConstants.STORAGE;

  constructor(private http: HttpClient, private toaster: ToastrService, private _FileSaverService: FileSaverService) {}
  downloadFileService(filePath: string): Observable<any> {
    const headers = { Accept: 'application/octet-stream' };
    return this.http.get<any>(this.fileDownloadAPI + '?filePath=' + encodeURIComponent(filePath), {
      headers: headers,
      responseType: 'blob' as 'json',
    });
  }
  downloadFileServiceOpen(filePath: string): Observable<any> {
    const headers = { Accept: 'application/octet-stream' };
    return this.http.get<any>(this.fileDownloadAPI + '/open?filePath=' + encodeURIComponent(filePath), {
      headers: headers,
      responseType: 'blob' as 'json',
    });
  }
  downloadByResponse(responseData: any, fileName: string) {
    this._FileSaverService.save(responseData, fileName);
    this.toaster.success('File downloaded Successfully', 'Success!');
  }
  downloadFileOpen(filePath: string) {
    this.downloadFileServiceOpen(filePath).subscribe({
      next: responseData => {
        const fileName = this.getFileName(filePath);
        this._FileSaverService.save(responseData, 'Policy.pdf');
        this.toaster.success('File downloaded Successfully', 'Success!');
      },
      error: error => {
        this.toaster.error('Unable to download file', 'Error!');
      },
    });
  }
  downloadFile(filePath: string) {
    this.downloadFileService(filePath).subscribe({
      next: responseData => {
        const fileName = this.getFileName(filePath);
        this._FileSaverService.save(responseData, fileName);
        this.toaster.success('File downloaded Successfully', 'Success!');
      },
      error: error => {
        this.toaster.error('Unable to download file', 'Error!');
      },
    });
  }
  getFileName(filePath: any) {
    try {
      const fileName = filePath.split('/').pop();
      return fileName;
    } catch (error) {}
    return '';
  }
  downloadFileUI(file: File) {
    const fileName = file.name;
    this._FileSaverService.save(file, fileName);
    this.toaster.success('File downloaded Successfully', 'Success!');
  }
}

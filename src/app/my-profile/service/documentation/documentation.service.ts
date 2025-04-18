import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalConstants } from 'src/app/config/GlobalConstants';
import { Observable } from 'rxjs';
import { DocumentDto } from '../../model/documentation.model';

@Injectable({
  providedIn: 'root',
})
export class DocumentationService {
  constructor(private http: HttpClient) {}

  documentApi = GlobalConstants.API_SERVER_URL + GlobalConstants.API_BASE_URL + GlobalConstants.DOCUMENT_API;

  getDocument(userId: string): Observable<DocumentDto[]> {
    const params = new HttpParams().set('userId', userId);
    return this.http.get<DocumentDto[]>(this.documentApi + '/getDocument', { params });
  }

  saveDocument(fileName: string, DocumentDto: DocumentDto): Observable<any> {
    const formData = new FormData();
    formData.append('fileName', fileName);
    formData.append('document', JSON.stringify(DocumentDto));

    return this.http.post<any>(this.documentApi + '/saveDocument', formData);
  }

  updateDocument(fileName: string, DocumentDto: DocumentDto): Observable<any> {
    const formData = new FormData();
    formData.append('fileName', fileName);
    formData.append('document', JSON.stringify(DocumentDto));

    return this.http.post<any>(this.documentApi + '/updateDocument', formData);
  }

  deleteDocument(documentId: string): Observable<any> {
    const params = new HttpParams().set('documentId', documentId);
    return this.http.post<any>(this.documentApi + '/deleteDocument', {}, { params });
  }
}

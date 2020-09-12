import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppServiceService {

  constructor(private httpClient: HttpClient) { }

  public getSummary(): Observable<any> {
    return this.httpClient.get(environment.baseUrl + '/app/getLatestSummary');
  }

  public getQuarantineArea(): Observable<any> {
    return this.httpClient.get(environment.baseUrl + '/app/getLatestQuarantine');
  }

  public getVaccineSummary(): Observable<any> {
    return this.httpClient.get(environment.baseUrl + '/app/getLatestVaccineSummary');
  }
}

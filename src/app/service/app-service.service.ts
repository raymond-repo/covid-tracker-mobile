import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppServiceService {

  constructor(private http: HttpClient) { }

  public getRegionSummary(region: string): Observable<any> {
    return this.http.get(environment.baseUrl + 'app/getRegionByNameAndLatestPublishedDate', {
      params: { name: region }
    });
  }

  public getSummary(): Observable<any> {
    return this.http.get(environment.baseUrl + 'app/getSummary');
  }

  public getVaccineSummary(): Observable<any> {
    return this.http.get(environment.baseUrl + 'app/getLatestVaccineSummary');
  }
}

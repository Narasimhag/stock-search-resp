import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class GetdataService {
  
  searchUrl: string = 'api/search/';

  detailsUrl: string = 'api/detail/';
  summaryUrl: string = 'api/summary/';
  newsUrl: string = 'api/news/';
  chartsUrl: string = 'api/charts/'
  histUrl: string = 'api/hist/'
  testUrl: string = 'api/test/'
  
  constructor(private http: HttpClient) { }

  test(ticker: string){
    let url = this.testUrl + ticker;
    return this.http.get(url);
  }

  search(searchString: string): Observable<any>{
    let url = this.searchUrl + searchString;
    return this.http.get(url);
  }

  detail(ticker: string) {
    let url = this.detailsUrl + ticker;
    return this.http.get(url);
  }

  summary(ticker: string) {
    let url = this.summaryUrl + ticker;
    return this.http.get(url);
  }

  news(ticker: string) {
    let url = this.newsUrl + ticker;
    return this.http.get(url);
  }

  charts(ticker: string, date: string){
    let url = this.chartsUrl + ticker + "/" + date;
    return this.http.get(url);
  }

  history(ticker: string, date: string){
    let url = this.histUrl + ticker + "/" + date;
    return this.http.get(url);
  }

}

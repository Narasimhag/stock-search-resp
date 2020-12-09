import { Component, OnInit } from '@angular/core';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { GetdataService } from '../getdata.service';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, finalize, startWith, switchMap, tap } from 'rxjs/operators';
import { query } from '@angular/animations';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  faS = faSearch;
  isLoading = false;
  results: any = null;
  queryField: FormControl = new FormControl();
  query: string;
  ticker: string;


  constructor(private getdata: GetdataService
  ) { }

  ngOnInit(): void {
    
    this.queryField.valueChanges.pipe(
      debounceTime(500)
      )
    .subscribe( {
      
      next: (result: any) => {
        this.isLoading = true;
        this.results = null;
        if(result == '') {
          this.isLoading = false;
        }
        else {
      this.getResults(result).subscribe(data => {
        
        setTimeout(() => {}, 500);
        this.isLoading = false;
        this.results = data;
        this.ticker = this.query.split("|")[0].trim();
      },
      error => {
        this.isLoading = false;
        this.results = null;
      });}
      
      },
      error: (err: any) => {
      },
      complete: () => {
      }
      });

    }

  getResults(query: string) {
    return this.getdata.search(query);
  }


}

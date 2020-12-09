import { Component, OnInit } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { GetdataService } from '../getdata.service';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
declare var $: any;

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css']
})
export class WatchlistComponent implements OnInit {
  isLoading = true;
  master = [];
  input = [];
  cross = faTimes;
  isEmpty = false;
  constructor(private getdata:GetdataService) { }

  ngOnInit(): void {
    this.isLoading = false;
    this.getAndSet();
    var arr = JSON.parse(localStorage.getItem('watchlist'));
    if(!(arr instanceof Array))
      arr = [arr];
      if(arr.length == 0){
        this.isEmpty = true;
        this.isLoading = false;
      }

  }

  getAndSet(){
    this.master = [];
    let observables: Observable<any>[] = [];
  this.input = JSON.parse(localStorage.getItem('watchlist'));
  console.log(this.input);
  
  console.log(this.input);
  for(let i=0;i < this.input.length; i++){
    var ticker = this.input[i];
    
    observables.push(this.getdata.detail(ticker));
  }
  forkJoin(observables).subscribe(dataArray =>{
    this.isLoading = false;
    for(let i=0; i<dataArray.length; i++){
      var temp = {};
    var ele = this.input[i];
    
    console.log(ele);

    
      temp['ticker'] = dataArray[i]['ticker'];
      temp['name'] = dataArray[i]['name'];
      temp['last'] = dataArray[i]['last'];
      temp['change'] = dataArray[i]['change'];
      temp['changePercent'] = dataArray[i]['changePercent'];
    
    this.master.push(temp);
    }
    console.log(this.master);
  });
  
  }

  deleteTicker(item){
    $('.close-icon').on('click',function() {
      $(this).closest('.card').fadeOut();
    });

    var arr = JSON.parse(localStorage.getItem('watchlist'));
    if(!(arr instanceof Array))
      arr = [arr];
    var newwatch = arr.filter(e => e !== item.ticker);
    
    if(newwatch.length == 1){
    localStorage.setItem('watchlist', JSON.stringify([]));
    this.isEmpty = true;
  }
    else{
    localStorage.setItem('watchlist', JSON.stringify(newwatch));}
    
    this.getAndSet();
   
  }

  // $('.close-icon').on('click',function() {
  //   $(this).closest('.card').fadeOut();
  // })

}

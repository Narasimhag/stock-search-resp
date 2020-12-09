import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { GetdataService } from '../getdata.service';
import { interval } from 'rxjs';
import * as Highcharts from "highcharts/highstock";
import { Options } from "highcharts/highstock";
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Form, FormControl, Validators } from '@angular/forms';
import {faFacebookSquare, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { Portal } from '@angular/cdk/portal';


@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  ticker: string;
  detailsLoading: boolean;
  summaryLoading: boolean ;
  newsLoading: boolean;
  chartLoading: boolean;
  updateFlag: boolean = false;
  ddata: any;
  sdata: any;
  ndata: any;
  ndatalen: number;
  stock_up: boolean = true;
  mopen: boolean = true;
  startDate;
  closeResult = '';
  interval = interval(15000);
  isBuyDisabled = true;
  quantityVal: FormControl = new FormControl();
  totalPrice;
  faFace = faFacebookSquare;
  faTwit = faTwitter; 
  isSelected = false;
  present = false;
  isEmpty = false;
  res;
  x;
  Highcharts: typeof Highcharts = Highcharts; 
  // chartOptions: Options;
  chartOptions: Options = { 
    title: {
      text:'ABC'
    },
    rangeSelector: {
      enabled: false
    },
    yAxis: {
      title: {
        text: ''
      },
      opposite: true
    },
    series: [{
      color: '#28a745',
      data:[],
      type: 'line'
    }],
    time: {
      useUTC: false
    }
   };
  

  constructor(
    private route: ActivatedRoute,
    private getdata: GetdataService,
    private modalService: NgbModal
  ) {
      
   }

  ngOnInit(): void {

    this.ticker = this.route.snapshot.paramMap.get('ticker');
    this.detailsLoading = true;
    this.newsLoading = true;
    this.summaryLoading = true;
    this.chartLoading = true;
    // this.res = this.getdata.test(this.ticker);
    // console.log(this.res);
    // if(this.res["name"]=="error"){
    //   console.log("error");
    //   this.isEmpty = true;
    //   this.chartLoading = false;
    //   this.detailsLoading = false;
    //   this.summaryLoading = false;
    //   this.newsLoading = false;
    //   return;
    // }
    // else {

    console.log(this.ticker);

    var arr = JSON.parse(localStorage.getItem('watchlist'));
    if(!(arr instanceof Array))
      arr = [arr];
    if(arr.includes(this.ticker.toUpperCase())){
      this.present = true;
    }

    this.getDetails(this.ticker);
    this.getSummary(this.ticker);
    this.getNews(this.ticker);
    // this.x = setInterval(() => {
    //   console.log("called");
    //   this.getDetails(this.ticker);
    //   this.getSummary(this.ticker);}, 15000);
    // if(this.ddata.mStatus == 'open'){
    //   this.x();

    // }
    
    // console.log(this.ndata[0]);
  
  }


  repeat() {
    this.getDetails(this.ticker);
    this.getSummary(this.ticker);
  }

  getDetails(ticker: string){
    this.getdata.detail(ticker).subscribe(data => {
      this.detailsLoading = false;
      console.log(data);
      
      this.ddata = data;
      if(parseFloat(this.ddata.change) < 0) this.stock_up = false;
      if(this.ddata.mStatus == "closed") this.mopen = false;
      
      this.getChart(this.ticker);
    });
  }

  getSummary(ticker: string){
    this.getdata.summary(ticker).subscribe(data => {
      this.summaryLoading = false;
      this.sdata = data;
      
    });
  }

  getChart(ticker: string){
   
    
    this.getdata.charts(ticker, this.ddata.ldate).subscribe(data => {
      console.log(data[0]);
    //   var output = [];
    //   for(var i=0;i<Object.keys(data).length;i++){
    //     output.push([data[i]]);
    // }
    // console.log(output[0]);
      this.chartLoading = false;
      this.chartOptions.series[0]['data'] = data;

      this.chartOptions.title.text = this.ticker.toUpperCase();
      if(this.stock_up){
        this.chartOptions.series[0]['color'] = 'green';
        }
        else {
        this.chartOptions.series[0]['color'] = 'red';}
     
      this.updateFlag = true;
    });
  }

  getNews(ticker: string){
    this.getdata.news(ticker).subscribe(data => {
      this.newsLoading = false;
      console.log("bye");
      this.ndata = data;
      if(this.ndata.length % 2 == 1){
      this.ndatalen = Math.ceil(this.ndata.length / 2);
      }
      else{
        this.ndatalen = this.ndata.length / 2;
      }
    });
  }

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    this.quantityVal.valueChanges.subscribe(val => {
        if(this.quantityVal.value > 0){
          this.isBuyDisabled = false;
        }
        else{
          this.isBuyDisabled = true;
        }
        this.totalPrice =  this.quantityVal.value * parseFloat(this.ddata.last);

    });
  }

  open2(newscontent) {
    this.modalService.open(newscontent, {ariaLabelledBy: 'modal-newstitle'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }


  storeBought(){
    
    var obj = {
      'ticker': this.ticker.toUpperCase(),
      'totalcost': this.totalPrice,
      'quantity': parseInt(this.quantityVal.value),
      
    };

    // if(!localStorage.getItem('portfolio')){
    //   localStorage.setItem('portfolio', JSON.stringify([]));
    // }
     
    var port = JSON.parse(localStorage.getItem('portfolio'));
    if(!(port instanceof Array))
      port = [port];
    
    for(var i=0;i<port.length;i++){
      if(port[i]['ticker'] == this.ticker){
        port[i]['quantity'] += parseFloat(this.quantityVal.value);
        port[i]['totalcost'] += this.totalPrice;
        localStorage.setItem('portfolio', JSON.stringify(port));
        return;
      }
    }
    port.push(obj)
    var str  =JSON.stringify(port);

    
    localStorage.setItem('portfolio', str);
  }

  toWatch(){
    var ticker = this.ticker.toUpperCase();
    var arr = JSON.parse(localStorage.getItem('watchlist'));
    if(!(arr instanceof Array))
      arr = [arr];
    if(arr.includes(ticker)){
      this.present = false;
      var newwatch = arr.filter(e => e !== ticker);
      console.log(newwatch);
      localStorage.setItem('watchlist', JSON.stringify(newwatch));
    }
    else{
      this.present = true;
      arr.push(ticker);
      localStorage.setItem('watchlist', JSON.stringify(arr));
    }
    
  }
}

  
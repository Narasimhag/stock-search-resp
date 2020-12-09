import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbModal, ModalDismissReasons, NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin, Observable } from 'rxjs';
import { GetdataService } from '../getdata.service';


@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {
  input = [];
  constructor(private getdata: GetdataService,
    private modalService: NgbModal,
    ) { }
  master = [];
  ticker = [];
  quantityVal: FormControl = new FormControl('');
  quantitySellVal: FormControl = new FormControl('');
  closeResult ='';
  isBuyDisabled = true;
  isSellDisabled = true;
  isLoading = true;
  isEmpty = false;
  ngOnInit(): void {

    var arr = JSON.parse(localStorage.getItem('portfolio'));
    if(!(arr instanceof Array))
      arr = [arr];
    if(arr.length == 0){
      this.isEmpty = true;
      this.isLoading = false;
    }
    this.getAndSet();
    // this.isLoading = false;
    }

    getAndSet(){
      this.master = [];
      let observables: Observable<any>[] = [];
    this.input = JSON.parse(localStorage.getItem('portfolio'));
    console.log(this.input);
    
    console.log(this.input);
    for(let i=0;i < this.input.length; i++){
      var ticker = this.input[i]['ticker'];
      this.ticker.push(ticker);
      observables.push(this.getdata.detail(ticker));
    }
    forkJoin(observables).subscribe(dataArray =>{
      this.isLoading = false;
      for(let i=0; i<dataArray.length; i++){
        var temp = {};
      var ele = this.input[i];
      
      console.log(ele);

      
        temp['ticker'] = ele['ticker'];
        temp['quantity'] = ele['quantity'];
        temp['total'] = ele['totalcost'];
        temp['name'] = dataArray[i]['name'];
        temp['avgcost'] = parseFloat(temp['total']) / temp['quantity'];
        temp['cp'] = dataArray[i]['last'];
        temp['change'] = temp['avgcost'] - temp['cp']; 
        temp['mv'] = parseFloat(temp['cp']) * temp['quantity'];
      
      this.master.push(temp);
      }
      console.log(this.master);
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
          
  
      });
    }

    open2(sellcontent, item) {
      this.modalService.open(sellcontent, {ariaLabelledBy: 'modal-sell-title'}).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
      this.quantitySellVal.valueChanges.subscribe(val => {
        // console.log(item.quantity);
          if(val > 0 && val < item.quantity){
            this.isSellDisabled = false;
          }
          else if(val == 0){
            this.isSellDisabled = true;
            // console.log(item.quantity);
          }
          else if(val > item.quantity){
            this.isSellDisabled = true;
            // console.log(item.quantity) + "more";
          }
          
  
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

    storeBought(item){
    
      var obj = {
        'ticker': item.ticker,
        'totalcost': item.mv * this.quantityVal.value,
        'quantity': parseInt(this.quantityVal.value),
        
      };
  
       
      var port = JSON.parse(localStorage.getItem('portfolio'));
      if(!(port instanceof Array))
        port = [port];
      
      for(var i=0;i<port.length;i++){
        if(port[i]['ticker'] == item.ticker){
          port[i]['quantity'] += parseFloat(this.quantityVal.value);
          port[i]['totalcost'] += item.mv * this.quantityVal.value;
          localStorage.setItem('portfolio', JSON.stringify(port));
          this.getAndSet();
          return;
        }
      }
      port.push(obj)
      var str  =JSON.stringify(port);
  
      
      localStorage.setItem('portfolio', str);
      
      // for(let i=0;i<this.master.length;i++){
      //     if(this.master[i].ticker == obj.ticker){
      //       this.master[i].total += obj.totalcost;
      //       this.master[i].quantity += obj.quantity;
      //     }
      // }
      this.getAndSet();
    }

    storeSell(item){
      var port = JSON.parse(localStorage.getItem('portfolio'));
      if(!(port instanceof Array))
        port = [port];
      
      for(var i=0; i<port.length;i++){
        if(port[i]['ticker']==item.ticker){
          // console.log(port[i]);
          port[i]['quantity'] -= parseFloat(this.quantitySellVal.value);
          // console.log(port[i]);
          if(port[i]['quantity'] == 0){
            var newPort = port.filter(e => e !== item.ticker);
            console.log(newPort);
            if(newPort.length == 1){
              localStorage.setItem('portfolio', JSON.stringify([]));
              this.isEmpty = true;
            }
              else{
            localStorage.setItem('portfolio', JSON.stringify(newPort)); }
          }
          else{
            // console.log(port[i] + "s");
            localStorage.setItem('portfolio', JSON.stringify(port));
            
          }
        }
      }
      this.getAndSet();
    }
    
  }



import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent  implements OnInit{
  
  title = 'stock search';

  ngOnInit(){
    if(localStorage.getItem('watchlist') == null){
      localStorage.setItem('watchlist', '[]');
    }
    if(localStorage.getItem('portfolio') == null){
      localStorage.setItem('portfolio', '[]');
    }
  }
}

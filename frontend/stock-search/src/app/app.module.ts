import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatSliderModule } from '@angular/material/slider';
import { MenuComponent } from './menu/menu.component';
import { FooterComponent } from './footer/footer.component';
import { SearchComponent } from './search/search.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { GetdataService } from './getdata.service';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { DetailComponent } from './detail/detail.component'
import {MatTabsModule} from '@angular/material/tabs';
import { HighchartsChartModule } from 'highcharts-angular';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { ChartsComponent } from './detail/charts/charts.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { WatchlistComponent } from './watchlist/watchlist.component';
import { CommonModule } from '@angular/common'; 

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    FooterComponent,
    SearchComponent,
    DetailComponent,
    ChartsComponent,
    PortfolioComponent,
    WatchlistComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSliderModule,
    FontAwesomeModule,
    HttpClientModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    HighchartsChartModule,
    NgbModule,
    FormsModule,
    CommonModule
  ],
  providers: [GetdataService],
  bootstrap: [AppComponent]
})
export class AppModule { }

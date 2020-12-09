import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchComponent } from './search/search.component';
import { DetailComponent } from './detail/detail.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { WatchlistComponent } from './watchlist/watchlist.component';

const routes: Routes = [
  {path:"", component: SearchComponent},
  {path:"details/:ticker", component: DetailComponent},
  {path:"portfolio", component: PortfolioComponent},
  {path: "watchlist", component: WatchlistComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

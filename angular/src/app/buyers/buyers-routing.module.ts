import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { CalgaryListingComponent } from './calgary-listing/calgary-listing.component';
import { AirdrieListingComponent } from './airdrie-listing/airdrie-listing.component';
import { ChestermereListingComponent } from './chestermere-listing/chestermere-listing.component';

const routes: Routes = [
  { path: 'buyers/home', component: HomeComponent },
  // { path: 'Calgary', component: CalgaryListingComponent },
  // { path: 'Airdrie', component: AirdrieListingComponent },
  // { path: 'Chestermere', component: ChestermereListingComponent },
  // { path: ':City/:Community/:Address', component: PropertyDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BuyersRoutingModule { }

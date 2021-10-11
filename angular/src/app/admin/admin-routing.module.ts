import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageContentComponent } from './page-content/page-content.component';

const routes: Routes = [
  { path: 'page-content', component: PageContentComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PreloadAllModules } from '@angular/router';
import { MemLoginComponent } from './components/mem-login/mem-login.component';
import { AuthGuard } from './_services/auth-guard.service';

const routes: Routes = [
  // { path: '', pathMatch: 'full', redirectTo: 'home' },

  { path: '', loadChildren: () => import('./home/home.module').then(m => m.HomeModule), canActivate:[AuthGuard] },

  { path: 'sellers', loadChildren: () => import('./sellers/sellers.module').then(m => m.SellersModule), canActivate:[AuthGuard] },

  { path: 'commercials', loadChildren: () => import('./commercials/commercials.module').then(m => m.CommercialsModule), canActivate:[AuthGuard] },

  { path: 'mortgage', loadChildren: () => import('./mortgage/mortgage.module').then(m => m.MortgageModule), canActivate:[AuthGuard] },

  { path: '', loadChildren: () => import('./area/area.module').then(m => m.AreaModule), canActivate:[AuthGuard] },

  { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule), canActivate:[AuthGuard] },

  { path: 'buyers', loadChildren: () => import('./buyers/buyers.module').then(m => m.BuyersModule), canActivate:[AuthGuard] },

  { path: 'memdash', loadChildren: () => import('./memdash/memdash.module').then(m => m.MemdashModule),
    canActivate:[
      AuthGuard
    ] 
  },

  { path: 'memlogin', component: MemLoginComponent },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules,
    initialNavigation: 'enabled'
})],
  exports: [RouterModule]
})
// export const AppRoutingModule: ModuleWithProviders = RouterModule.forRoot(routes)

export class AppRoutingModule {}
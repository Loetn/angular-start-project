import { Routes } from '@angular/router';
import { HomeComponent } from './home';

export const ROUTES: Routes = [
	{
		path: '',
		redirectTo: 'pageRoute',
		pathMatch: 'full'
	},
	{
		path: 'pageRoute',
		component: HomeComponent
	},
	{
		path: '**',
		redirectTo: 'pageRoute'
	}
];
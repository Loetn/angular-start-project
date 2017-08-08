import { NgModule, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpModule, Http } from '@angular/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { removeNgStyles, createNewHosts, createInputTransfer } from '@angularclass/hmr';

import { ROUTES } from './app.routes';
import { AppState, InternalStateType } from './app.service';

import { TailermateCommonModule } from 'ds-tailermate-web-common';
import { AppComponent } from './app.component';
import { HomeModule } from './home';

import '../styles/style.scss';

type StoreType = {
	state: InternalStateType,
	restoreInputValues: () => void,
	disposeOldHosts: () => void
};

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: Http) {
	return isPlatformBrowser ? new TranslateHttpLoader(http, '/assets/i18n/', '.json') : new TranslateHttpLoader(http);
}

@NgModule({
	bootstrap: [AppComponent],
	declarations: [
		AppComponent
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		HttpModule,
		RouterModule.forRoot(ROUTES, { useHash: true }),
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useFactory: HttpLoaderFactory,
				deps: [Http]
			}
		}),
		NgbModule.forRoot(),
		TailermateCommonModule.forRoot(),
		HomeModule
	],
	providers: [
		AppState
	]
})

export class AppModule {
	constructor(
		public appRef: ApplicationRef,
		public appState: AppState
	) { }

	public hmrOnInit(store: StoreType) {
		if (!store || !store.state) {
			return;
		}
		console.log('HMR store', JSON.stringify(store, null, 2));
		// Set state
		this.appState._state = store.state;
		// Set input values
		if ('restoreInputValues' in store) {
			let restoreInputValues = store.restoreInputValues;
			setTimeout(restoreInputValues);
		}

		this.appRef.tick();
		delete store.state;
		delete store.restoreInputValues;
	}

	public hmrOnDestroy(store: StoreType) {
		const cmpLocation = this.appRef.components.map((cmp) => cmp.location.nativeElement);
		// Save state
		const state = this.appState._state;
		store.state = state;
		// Recreate root elements
		store.disposeOldHosts = createNewHosts(cmpLocation);
		// Save input values
		store.restoreInputValues = createInputTransfer();
		// Remove styles
		removeNgStyles();
	}

	public hmrAfterDestroy(store: StoreType) {
		// Display new elements
		store.disposeOldHosts();
		delete store.disposeOldHosts;
	}
}
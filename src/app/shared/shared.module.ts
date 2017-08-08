import { NgModule } from '@angular/core';
import { Http } from '@angular/http';
import { TranslateModule } from '@ngx-translate/core';
import { BusyModule, BusyConfig } from 'angular2-busy';
import { TailermateCommonModule } from 'ds-tailermate-web-common';

@NgModule({
	declarations: [
	],
	providers: [
		// Services
		TailermateCommonModule,
	],
	imports: [
		TranslateModule
	],
	exports: [
		TranslateModule,
		BusyModule
	],
	entryComponents: [
	]
})
export class SharedModule { }
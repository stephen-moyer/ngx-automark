import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ComponentFactoryResolver, ComponentFactory, Type, ComponentRef, NgModuleRef } from '@angular/core';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

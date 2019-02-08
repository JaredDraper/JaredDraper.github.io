import {Component} from '@angular/core';
import {CalendarComponent} from './calendar.component';
import { OAuthService } from 'angular2-oauth2/oauth-service';

@Component({
    selector: 'my-app',
    template: `<h1>Welcome to Step Tracker</h1><days></days>`,
    entryComponents: [CalendarComponent]
})
export class AppComponent {
	constructor(private oauthService: OAuthService) {
		this.oauthService.loginUrl = "https://www.fitbit.com/oauth2/authorize?response_type=token&client_id=2287H9&redirect_uri=http%3A%2F%2Fwww.steptracker.org%2Findex.html&scope=activity&expires_in=604800";
		this.parseURL();
		this.oauthService.tryLogin({});
 }
 private parseURL(){
 	if((window.location.href).includes("#")){
 	let callbackResponse = (window.location.href).split("#")[1];
            let responseParameters = (callbackResponse).split("&");
            let token = responseParameters[0].split("=")[1];
            let expire = responseParameters[5].split("=")[1];
            if(token != null){        
                window.localStorage.setItem('access_token', token);
                window.localStorage.setItem('expires_at', expire);
                console.log(token);                
            } else {
                alert("Problem authenticating");
            }
            
        }
 }
}

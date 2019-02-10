import{ Injectable } from '@angular/core';
import{ Http, Response, Headers, RequestOptions, URLSearchParams} from '@angular/http';
import{ Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { OAuthService } from 'angular2-oauth2/oauth-service';

import{ Steps } from './steps';

@Injectable()
export class CalendarService {
	private _fitbitPostURL = 'https://api.fitbit.com/1/user/-/activities.json';
	constructor(
		private _http: Http,
		private oauthService: OAuthService) {
		
	}
	public getTestStepsPerMonth(date: string) {
		let stepsList: Steps[] = [];
		for (let x = 0; x < 31; x++) {
			stepsList.push(new Steps(x + '124', ''));
		}
		return stepsList;
	}

	public getStepsPerMonth(monthYear: string): Observable<Steps[]> {
		 if (this.oauthService.hasValidAccessToken() == false) {
		 	this.oauthService.initImplicitFlow();
		 	return;
		 }
		//if (window.localStorage.getItem('access_token') == null) { //for testing purposes
		//	this.oauthService.initImplicitFlow();
		//	return;
		//}
		let date: string[] = monthYear.split(',');
        let month: string = date[0].length === 1 ? '0' + date[0] : date[0];
        let year: string = date[1];
        let daysInMonth: string  = date[2];
        let urlString: string = 'https://api.fitbit.com/1/user/-/activities/steps/date/' + year + '-' + month + '-01/' + year + '-' + month + '-' +
                    daysInMonth + '.json';

		let headers = new Headers({ 'Content-Type': 'application/json' });
		headers.set('Authorization', 'Bearer ' + this.oauthService.getAccessToken());
		 let options = new RequestOptions({ headers: headers});
		return this._http.get(urlString, options).map(this.extractData).catch(this.handleError);
	}

	private handleError(error: Response) {
		console.error(error);
		return Observable.throw(error.json().error || 'Server error');
	}

  	public updateSteps(updatedSteps: string, date: string, calendar: any) {
		let headers = new Headers({ 'Accept-Language': 'en-US,en;q=0.5' });
		headers.set('Authorization', 'Bearer ' + this.oauthService.getAccessToken());
		let params = new URLSearchParams();
		params.set('activityId', '90013');		
		params.set('startTime', this.getRandomTime());
		params.set('durationMillis', '600000');
		params.set('date', date);
		params.set('distance', updatedSteps);
		params.set('distanceUnit', 'steps');
        let options = new RequestOptions({ headers: headers, search: params});

        return this._http.post(this._fitbitPostURL, {}, options).map((response: Response) => console.log(response.json())).subscribe(
    	function(response) {
    		calendar.helperFunction();
    	},
    		function(error) { console.log('Error happened' + error)
    	},
    		function() { console.log('the subscription is completed')});
  	}

  	private extractData(res: Response) {
  		let body = res.json();
  		console.log(body['activities-steps']);
  		return body['activities-steps'] || { };
	}

	private getRandomTime(){
		let hour: number = Math.floor(Math.random() * 24) + 1;
		let hourStr: string = hour < 10 ? '0' + hour : '' + hour;
		return hourStr + ':30:00';
	}
	
}

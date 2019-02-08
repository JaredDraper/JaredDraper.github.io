import{ Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { OAuthService } from 'angular2-oauth2/oauth-service';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import{ Steps } from './steps';
import {catchError, tap} from "rxjs/operators";


@Injectable()
export class CalendarService {
	private _fitbitPostURL = 'https://api.fitbit.com/1/user/-/activities.json';
	constructor(
    private http: HttpClient,
		private oauthService: OAuthService) {
		
	}
	public getTestStepsPerMonth(date: string) {
		let stepsList: Steps[] = [];
		for (let x = 0; x < 31; x++) {
			stepsList.push(new Steps(x + '124', ''));
		}
		return stepsList;
	}

	public getStepsPerMonth(monthYear: string): Observable<any> {
		 // if (this.oauthService.hasValidAccessToken() == false) {
		 // 	this.oauthService.initImplicitFlow();
		 // 	return;
		 // }
		if (window.localStorage.getItem('access_token') == null) { //for testing purposes
			this.oauthService.initImplicitFlow();
			return;
		}
		let date: string[] = monthYear.split(',');
        let month: string = date[0].length === 1 ? '0' + date[0] : date[0];
        let year: string = date[1];
        let daysInMonth: string  = date[2];
        let urlString: string = 'https://api.fitbit.com/1/user/-/activities/steps/date/' + year + '-' + month + '-01/' + year + '-' + month + '-' +
                    daysInMonth + '.json';

		let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
		headers.set('Authorization', 'Bearer ' + this.oauthService.getAccessToken());

		return this.http.get(urlString, {headers}).pipe(tap(
		  info => this.log(`fetched data from fitbit`)),
      catchError(error => this.handleError(error)));
	}

  private log(message: string) {
    console.log(message);
  }

	private handleError(error: Response) {
		console.error(error);
		return Observable.throw(error.json() || 'Server error');
	}

  	public updateSteps(updatedSteps: string, date: string, calendar: any) {
		let headers = new HttpHeaders({ 'Accept-Language': 'en-US,en;q=0.5' });
		headers.set('Authorization', 'Bearer ' + this.oauthService.getAccessToken());
		let params = new HttpParams();
		params.set('activityId', '90013');		
		params.set('startTime', this.getRandomTime());
		params.set('durationMillis', '600000');
		params.set('date', date);
		params.set('distance', updatedSteps);
		params.set('distanceUnit', 'steps');
        //let options = new RequestOptions({ headers: headers, search: params});

        return this.http.post(this._fitbitPostURL, {}, {headers: headers, params: params}).pipe(tap(
          info => calendar.helperFunction()),
          catchError(error => this.handleError(error)));
      //   ((response: Response) => console.log(response.json())).subscribe(
    	// function(response) {
    	// 	calendar.helperFunction();
    	// },
    	// 	function(error) { console.log('Error happened' + error)
    	// },
    	// 	function() { console.log('the subscription is completed')});
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

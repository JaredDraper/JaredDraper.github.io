import{Component} from '@angular/core';
import{CalendarService} from './calendar.service';
import { Steps } from './steps';

@Component({
selector: 'days',
styleUrls: ['./calendar.component.css'],
template: `
<h2>Edit your steps for the Month</h2>
<br>
<div class='month'>
  <ul>
    <li class='prev' (click)='getPreviousMonth()'>&#10094;</li>
    <li class='next' (click)='getNextMonth()'>&#10095;</li>
    <li>
      {{ month }}<br>
      <span style='font-size:18px'>{{ year }}</span>
    </li>
  </ul>
</div>

<ul class='weekdays'>
  <li>Su</li>
  <li>Mo</li>
  <li>Tu</li>
  <li>We</li>
  <li>Th</li>
  <li>Fr</li>
  <li>Sa</li>
</ul>

<ul class='days'>
  <li *ngFor='let notDay of notDays'>
  <li *ngFor='let day of days'><font size='3'>{{ day }} </font>
  <input type="text" size="5" [style.color]="getStyle(oldStepsList[day-1].value)" *ngIf="oldStepsList" class="error" id="{{ day }}" [(ngModel)]="oldStepsList[day-1].value" disabled>
  <input type="text" size="5" *ngIf="stepsList" class="error" id="{{ day }}" [(ngModel)]="stepsList[day-1].value">
  </li>
</ul>
<br>
<h2 [textContent]="'Days completed: ' + totalDays"></h2>
<button (click)='submitSteps()'>Submit</button>
<button (click)='logout()'>Logout</button>
`
})

export class CalendarComponent {
	title: string;
	days: string[];
	notDays: string[];
	month: string;
	year: string;
	totalDays: number;
	oldStepsList: Steps[];
	stepsList: Steps[];
	errorMessage: string;
	calendarDate: Date;
	dayList: Array<string> = new Array();
	monthNames: Array<string> = [
    	'January', 'February', 'March',
    	'April', 'May', 'June',
    	'July', 'August', 'September',
    	'October', 'November', 'December'
		];

	constructor(private calendarService: CalendarService) {
		this.calendarDate = new Date();
		this.calendarService = calendarService;
		this.populateScreen();
	}


	private getMonthName() {
		return this.monthNames[this.calendarDate.getMonth()];
	}

	 // pass in any date as parameter anyDateInMonth
	private daysInMonth() {
		this.days = [];
		this.stepsList = [];
		this.oldStepsList = [];
		for (let i = 1; i <= new Date(this.calendarDate.getFullYear(), this.calendarDate.getMonth() + 1, 0).getDate(); i++) {
			this.days.push((i).toString());
			this.stepsList.push(new Steps('', ''));
			this.oldStepsList.push(new Steps('', ''));
		}
	}

	private calculateNotDays() {

		this.notDays = [];
		for (let i = 1; i < new Date(this.calendarDate.getFullYear(), this.calendarDate.getMonth(), 1).getDay() + 1; i++) {
			this.notDays.push(i.toString());
		}
	}

	public getPreviousMonth() {
		this.calendarDate = new Date(this.calendarDate.getFullYear(), this.calendarDate.getMonth() - 1, this.calendarDate.getDay());
		this.populateScreen();
	}

	public getNextMonth() {
		this.calendarDate = new Date(this.calendarDate.getFullYear(), this.calendarDate.getMonth() + 1, this.calendarDate.getDay());
		this.populateScreen();
	}

	private getStyle(steps: String) {
		if (Number(steps) > 6499) {
				return 'darkblue';
		} else {
      return 'red';
    }
  }

public updateTotal() {
  	let total: number = 0;
  	for (let i = 0; i < this.oldStepsList.length; i++) {
		if (Number(this.oldStepsList[i].value) > 6499) {
			total++;
		}
	}
  	this.totalDays = total;
  	return true;
}

public submitSteps() {
	for (let i = this.stepsList.length - 1; i >= 0; i--) {
		if (this.stepsList[i].value !== '' && Number(this.stepsList[i].value) > 0) {
			let dayInt: number = i + 1;
			let day: string = dayInt < 10 ? '0' + dayInt : '' + dayInt;
			this.dayList.push(day + '&' + this.stepsList[i].value);
		}
	}

		this.helperFunction();
}

public helperFunction(){
	if(this.dayList.length>0)
	{
		let month: number = this.calendarDate.getMonth() + 1;
			let monthStr: string = '' + month;
			let data: string[] = this.dayList[0].split('&');
			let day: string = data[0];
			let value: string = data[1];
			this.dayList.shift();

		this.calendarService.updateSteps(value, this.calendarDate.getFullYear().toString() + '-' + monthStr + '-' + day, this);
	}
	else{
		this.populateScreen();
	}
}

	public logout() {
		window.localStorage.removeItem('access_token');
        window.localStorage.removeItem('expires_at');
        this.populateScreen();
        //navigate to login screen when it is made.
	}

	private populateScreen() {
		this.daysInMonth();
		this.month = this.getMonthName();
		this.year = this.calendarDate.getFullYear().toString();
		this.calculateNotDays();
		this.calendarService.getStepsPerMonth((this.calendarDate.getMonth() + 1).toString() + ',' + this.calendarDate.getFullYear().toString() + ',' + this.days.length)
                .subscribe(oldStepsList => this.oldStepsList = oldStepsList, error => this.errorMessage = <any>error, () => this.updateTotal());
	}


}

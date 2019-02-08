"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var calendar_service_1 = require('./calendar.service');
var CalendarComponent = (function () {
    function CalendarComponent(calendarService) {
        this.calendarService = calendarService;
        this.monthNames = [
            "January", "February", "March",
            "April", "May", "June",
            "July", "August", "September",
            "October", "November", "December"
        ];
        this.calendarDate = new Date();
        this.calendarService = calendarService;
        this.populateScreen();
    }
    CalendarComponent.prototype.getMonthName = function () {
        return this.monthNames[this.calendarDate.getMonth()];
    };
    // pass in any date as parameter anyDateInMonth
    CalendarComponent.prototype.daysInMonth = function () {
        this.days = [];
        for (var i = 1; i <= new Date(this.calendarDate.getFullYear(), this.calendarDate.getMonth() + 1, 0).getDate(); i++) {
            this.days.push((i).toString());
        }
    };
    CalendarComponent.prototype.calculateNotDays = function () {
        this.notDays = [];
        for (var i = 1; i < new Date(this.calendarDate.getFullYear(), this.calendarDate.getMonth(), 1).getDay() + 1; i++) {
            this.notDays.push(i.toString());
        }
    };
    CalendarComponent.prototype.getPreviousMonth = function () {
        this.calendarDate = new Date(this.calendarDate.getFullYear(), this.calendarDate.getMonth() - 1, this.calendarDate.getDay());
        this.populateScreen();
    };
    CalendarComponent.prototype.getNextMonth = function () {
        this.calendarDate = new Date(this.calendarDate.getFullYear(), this.calendarDate.getMonth() + 1, this.calendarDate.getDay());
        this.populateScreen();
    };
    CalendarComponent.prototype.populateScreen = function () {
        // this.steps = this.calendarService.getStepsPerMonth(this.calendarDate);
        this.daysInMonth();
        this.month = this.getMonthName();
        this.year = this.calendarDate.getFullYear().toString();
        this.calculateNotDays();
    };
    CalendarComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.calendarService.getStepsPerMonth(this.calendarDate)
            .subscribe(function (stepsList) { return _this.stepsList = stepsList; }, function (error) { return _this.errorMessage = error; });
    };
    CalendarComponent = __decorate([
        core_1.Component({
            selector: 'days',
            template: "\n\t<h2>Edit your steps for the Month</h2>\n\t<br>\n\t<div class=\"month\"> \n  <ul>\n    <li class=\"prev\" (click)=\"getPreviousMonth()\">&#10094;</li>\n    <li class=\"next\" (click)=\"getNextMonth()\">&#10095;</li>\n    <li>\n      {{ month }}<br>\n      <span style=\"font-size:18px\">{{ year }}</span>\n    </li>\n  </ul>\n</div>\n\n<ul class=\"weekdays\">\n  <li>Su</li>\n  <li>Mo</li>\n  <li>Tu</li>\n  <li>We</li>\n  <li>Th</li>\n  <li>Fr</li>\n  <li>Sa</li> \n</ul>\n\n<ul class=\"days\"> \n  <li *ngFor=\"let notDay of notDays\">\n  <li *ngFor=\"let day of days\">{{ day }} \n  <input type=\"text\" id=\"{{ day }}\" value=\"{{ stepsList[day] }}\">\n  </li>\n</ul>\n<br>\n<button type=\"button\">Submit</button>\n<button type=\"button\">Logout</button>\n<button type=\"button\">Change User</button>\n\t"
        }), 
        __metadata('design:paramtypes', [calendar_service_1.CalendarService])
    ], CalendarComponent);
    return CalendarComponent;
}());
exports.CalendarComponent = CalendarComponent;
//# sourceMappingURL=calendar.component.js.map
import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { PickerService } from 'ng-zorro-antd-mobile';
import { Platform } from '@ionic/angular';
import { AppServiceService } from '../service/app-service.service';
import { filter } from 'rxjs/operators';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy, AfterViewInit {

  // Charts
  @ViewChild('barChart') barChart;
  bars: any;

  private backButtonSubscription: any;

  public itemPerPage: number;
  public currentPage = 1;
  public totalPage: number;

  public isNationalCasesSummary: boolean;

  tabbarStyle: object = {
    position: 'fixed',
    height: '100%',
    width: '100%',
    top: 0
  };
  selectedIndex = 0;

  wide: string;
  dateRelease: string;

  totalCase: string;
  newCase: string;
  activeCase: string;
  recovered: string;
  died: string;

  paginatedListOfVaccineCandidate = [];
  listOfVaccineCandidate = [];

  // pagination
  locale = {
    prevText: 'Prev',
    nextText: 'Next'
  };

  listOfRegion = [
    '',
    'NCR',
    'CAR',
    'Region 1',
    'Region 2',
    'Region 3',
    'Region 4-A',
    'Region 4-B',
    'Region 5',
    'Region 6',
    'Region 7',
    'Region 8',
    'Region 9',
    'Region 10',
    'Region 11',
    'Region 15',
    'Region 13',
    'BARMM'
  ];

  name: string;
  totalCasesTimeline = [];
  recoveredTimeline = [];
  diedTimeline = [];

  constructor(
    private picker: PickerService,
    private platform: Platform,
    private appServiceService: AppServiceService) {
  }

  ngOnInit(): void {
    this.onChange(1);
    this.defaultValues();
    this.initSummaryData();
    this.initVaccineData();
  }

  ionViewDidEnter() {
    this.createBarChart();
  }

  private initSummaryData(): void {
    this.appServiceService.getSummary().pipe(filter(res => !!res)).subscribe(res => {
      this.dateRelease = res.datePublished;
      this.newCase = res.newCase;
      this.totalCase = res.totalCase;
      this.activeCase = res.activeCase;
      this.recovered = res.recovered;
      this.died = res.died;
      this.totalCasesTimeline = res.totalCasesTimeline;
      this.recoveredTimeline = res.recoveredTimeline;
      this.diedTimeline = res.diedTimeline;
      this.createBarChart();
    });
  }

  private initVaccineData(): void {
    this.appServiceService.getVaccineSummary().pipe(filter(res => !!res)).subscribe(res => {
      this.dateRelease = res.datePublished;
      this.listOfVaccineCandidate = res.vaccineSummaryListResponse;
    });
  }

  private defaultValues() {
    this.dateRelease = '';
    this.totalCase = '0';
    this.newCase = '0';
    this.activeCase = '0';
    this.recovered = '0';
    this.died = '0';
    this.name = 'Filter by region';
  }

  ngAfterViewInit() {
    this.backButtonSubscription = this.platform.backButton.subscribe(async () => {
      navigator['app'].exitApp();
    });
  }

  ngOnDestroy() {
    this.backButtonSubscription.unsubscribe();
  }

  public tabBarTabOnPress(pressParam: any): void {

    if (pressParam.index === 0) {
      this.wide = 'Nationwide Cases Data';
      this.initSummaryData();
      this.name = 'Filter by region';
    }
    else if (pressParam.index === 1) {
      this.wide = 'Worldwide Data';
      this.initVaccineData();
      this.initTotalPage(this.listOfVaccineCandidate.length, 15);
      this.onChange(1);
    }

    this.selectedIndex = pressParam.index;
  }

  private getResult(result): string {
    const value = [];
    let temp = '';
    result.forEach(item => {
      value.push(item.label || item);
      temp += item.label || item;
    });
    return value.map(v => v).join(',');
  }

  public showPicker(): void {
    this.picker.showPicker(
      {
        title: 'Region',
        data: this.listOfRegion,
        dismissText: 'Cancel',
        okText: 'Select'
      },
      result => {
        this.name = 'Filter by region';
        if (!!this.getResult(result)) {
          this.name = this.getResult(result);
          this.appServiceService.getRegionSummary(this.name).pipe(filter(res => !!res)).subscribe(res => {
            this.dateRelease = res.datePublished;
            this.newCase = res.newCase;
            this.totalCase = res.totalCase;
            this.activeCase = res.activeCase;
            this.recovered = res.recovered;
            this.died = res.died;
            this.totalCasesTimeline = res.totalCasesTimeline;
            this.recoveredTimeline = res.recoveredTimeline;
            this.diedTimeline = res.diedTimeline;
            this.createBarChart();
          });
        } else {
          this.initSummaryData();
        }
      }
    );
  }

  public onChange(event: any) {
    this.paginatedListOfVaccineCandidate = this.paginate(event, this.listOfVaccineCandidate, 15);
  }

  private paginate(page: any, listToPaginate: any[], itemPerpage: number): any[] {
    const offset = (page - 1) * itemPerpage;
    return listToPaginate.slice(offset).slice(0, itemPerpage);
  }

  private initTotalPage(totalNumberOfData: number, itemPerpage: number) {
    this.totalPage = Math.ceil(totalNumberOfData / itemPerpage);
  }

  createBarChart() {
    this.bars = new Chart(this.barChart.nativeElement, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: 'Total Cases',
          data: this.totalCasesTimeline,
          backgroundColor: 'rgb(0, 0, 0, 0)',
          borderColor: '#ff4d4f',
          borderWidth: 1
        }, {
          label: 'Recovered',
          data: this.recoveredTimeline,
          backgroundColor: 'rgb(0, 0, 0, 0)',
          borderColor: '#13c2c2',
          borderWidth: 1
        }, {
          label: 'Died',
          data: this.diedTimeline,
          backgroundColor: 'rgb(0, 0, 0, 0)',
          borderColor: '#722ed1',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
  }
}


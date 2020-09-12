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

  public quarantineDate = '';

  public isSummary: boolean;

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
  newActiveCase: string;
  recovered: string;
  newRecovered: string;
  died: string;
  newDied: string;

  paginatedListOfVaccineCandidate = [];
  listOfVaccineCandidate = [];
  regionCases = [];
  paginatedRegionCases = [];

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

  quarantineAreas = [];

  constructor(
    private platform: Platform,
    private appServiceService: AppServiceService) {
  }

  ngOnInit(): void {
    this.defaultValues();
    this.initSummaryData();
    this.initVaccineData();
    this.initQuarantineData();
  }

  ionViewDidEnter() {
    this.createBarChart();
  }

  private initSummaryData(): void {
    this.appServiceService.getSummary().pipe(filter(res => !!res)).subscribe(res => {
      this.dateRelease = res.date;
      this.newCase = res.newCase;
      this.totalCase = res.totalCases;
      this.newActiveCase = res.newActive;
      this.activeCase = res.active;
      this.newRecovered = res.newRecoveries;
      this.recovered = res.recoveries;
      this.newDied = res.newDeaths;
      this.died = res.totalDeaths;
      this.totalCasesTimeline = res.totalCasesTimeline;
      this.recoveredTimeline = res.recoveredTimeline;
      this.diedTimeline = res.diedTimeline;
      this.createBarChart();
      this.regionCases = res.region;
      this.initTotalPage(this.regionCases.length, 10);
      this.onChange(1);
    });
  }

  private initQuarantineData(): void {
    this.appServiceService.getQuarantineArea().pipe(filter(res => !!res)).subscribe(res => {
      this.quarantineDate = res.date;
      this.quarantineAreas = res.quarantineListResponse;
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
    this.newActiveCase = '0';
    this.recovered = '0';
    this.newRecovered = '0';
    this.died = '0';
    this.newDied = '0';
    this.name = 'Filter by region';
    this.isSummary = true;
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
      this.initQuarantineData();
      this.isSummary = true;
    }
    else if (pressParam.index === 1) {
      this.wide = 'Worldwide Data';
      this.isSummary = false;
      this.initVaccineData();
      this.initTotalPage(this.listOfVaccineCandidate.length, 15);
      this.onChange(1);
    }

    this.selectedIndex = pressParam.index;
  }

  public onChange(event: any) {
    if (this.isSummary) {
      this.paginatedRegionCases = this.paginate(event, this.regionCases, 10);
    } else {
      this.paginatedListOfVaccineCandidate = this.paginate(event, this.listOfVaccineCandidate, 15);
    }
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


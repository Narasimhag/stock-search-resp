import { Component, OnInit } from '@angular/core';
import { GetdataService } from '../../getdata.service';
import * as Highcharts from 'highcharts/highstock';
import { ActivatedRoute } from '@angular/router';

declare var require: any;
require('highcharts/indicators/indicators')(Highcharts);
require('highcharts/indicators/volume-by-price')(Highcharts);

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements OnInit {

  ohlc = [];
  volume = [];
  updateFlag = false;
  Highcharts: typeof Highcharts = Highcharts; 
  chartOptions: Highcharts.Options;

  constructor(private getdata: GetdataService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    var ticker = this.route.snapshot.paramMap.get('ticker');

    this.getdata.summary(ticker).subscribe(info => {
      
      var lastTimeStamp = info['lastdate'];
      console.log(lastTimeStamp);
      var year = (parseInt(lastTimeStamp.substring(0,4)) - 2).toString();
      var startDate = year + lastTimeStamp.substring(4);

      this.getdata.history(ticker, startDate).subscribe(info=> {
        console.log(Object.keys(info).length);
        for(let i=0; i<Object.keys(info).length;i++){
          var entry = info[i];
          // console.log(entry);
          this.ohlc.push([
            Date.parse(entry['date']),
            entry['open'],
            entry['high'],
            entry['low'],
            entry['close']
          ]);
          this.volume.push([
            Date.parse(entry['date']),
            entry['volume']
          ]);
        };
        console.log(this.ohlc);
        console.log(this.volume);


        //chartoptions
        this.chartOptions = {
          rangeSelector: {
            selected: 2
          },
      
          title: {
            text: ''
          },
      
          subtitle: {
            text: 'With SMA and Volume by Price technical indicators'
          },
      
          yAxis: [{
            startOnTick: false,
            endOnTick: false,
            labels: {
              align: 'right',
              x: -3
            },
            title: {
              text: 'OHLC'
            },
            height: '60%',
            lineWidth: 2,
            resize: {
              enabled: true
            }
          },
          {
            labels: {
              align: 'right',
              x: -3
            },
            title: {
              text: 'volume'
            },
            top: '65%',
            height: '35%',
            offset: 0,
            lineWidth: 2
          }],
          tooltip: {
            split: true
          },
      
          plotOptions: {
            series: {
              dataGrouping: {
                units: [[
                  'day', [1]
                ],
              [
                'week',
                [1]
              ],
            [
              'month',
              [1,2,3,4,6]
            ]],
              }
            }
          },
          series: [{
            type: 'candlestick',
            name: ticker.toUpperCase(),
            id: 'aapl',
            zIndex: 2,
            data: this.ohlc
          },
          {
            type: 'column',
            name: 'volume',
            id: 'volume',
            data: this.volume,
            yAxis: 1
          },
          {
            type: 'vbp',
            linkedTo: 'aapl',
            params: {
              volumeSeriesID: 'volume'
            },
            dataLabels: {
              enabled: false
            },
            zoneLines: {
              enabled: false
            }
          },
          {
            type: 'sma',
            linkedTo: 'aapl',
            zIndex: 1,
            marker: {
              enabled: false
            }
          }
        ]
        };
        this.chartOptions.series[0]['data'] = this.ohlc;
        this.chartOptions.series[1]['data'] = this.volume;
        this.chartOptions.title.text = ticker.toUpperCase() + " Historical";
        this.updateFlag = true;
        // Highcharts.stockChart("stockChart", this.chartOptions);
      });
    });
    }
  }



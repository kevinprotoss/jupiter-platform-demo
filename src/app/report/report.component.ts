import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';

import { AnalysisService } from '../analysis.service';

export interface Ths {
  code: string;
  name: string;
  traces?: Array<string>;
}

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  coll: any;
  blArray: any[];
  bl: any;
  selectedCategory;
  traceTypeList: Array<string> = [
    'alpha',
    'alpha20',
    'std',
    'std_result',
    'avg_result_5',
    'avg_result_10'
  ];
  traceMap: any = new Map();
  traceDataCache: any = new Map();

  public alphaGraph = {
    data: [],
    layout: { title: '日线分析' }
  };

  constructor(private analysisService: AnalysisService) {
  }

  ngOnInit() {
  }

  showSpinner() {
    return this.analysisService.isLoading;
  }

  getThsList() {
    return this.analysisService.getThsList();
  }

  applyFilter(filterValue: string) {
  }

  open(event, ths) {
    if (!event) { // close
      const { code, traces } = ths;
      // Recalculate if required
      if (!this.traceMap.has(code)) {
        console.time('calculation');
        const {
          alpha,
          alpha20,
          std,
          std_result,
          avg_result_5,
          avg_result_10
        } = this.analysisService.calculate(code);
        console.timeEnd('calculation');
        const alphaArray = Array.from(alpha.dataSync());
        const alpha20Array = Array.from(alpha20.dataSync());
        const stdArray = Array.from(std.dataSync());
        const stdResultArray = Array.from(std_result.dataSync());
        const avgResult5Array = Array.from(avg_result_5.dataSync());
        const avgResult10Array = Array.from(avg_result_10.dataSync());
        this.traceDataCache.set(`${code}_alpha`, alphaArray);
        this.traceDataCache.set(`${code}_alpha20`, alpha20Array);
        this.traceDataCache.set(`${code}_std`, stdArray);
        this.traceDataCache.set(`${code}_std_result`, stdResultArray);
        this.traceDataCache.set(`${code}_avg_result_5`, avgResult5Array);
        this.traceDataCache.set(`${code}_avg_result_10`, avgResult10Array);
        this.traceMap.set(code, true);
      }
      // Remove all existing traces
      _.pullAllWith(this.alphaGraph.data, [ code ], (data, code) => _.startsWith(data.name, code));
      // Add new selected traces
      const xData = this.analysisService.getDateArray();
      if (traces.includes('alpha')) {
        const yData = this.traceDataCache.get(`${code}_alpha`);
        this.alphaGraph.data.push({
          x: xData,
          y: yData,
          type: 'scatter',
          name: `${code}_alpha`,
        });
      }
      xData.splice(0, 19);
      if (traces.includes('alpha20')) {
        const yData = this.traceDataCache.get(`${code}_alpha20`);
        this.alphaGraph.data.push({
          x: xData,
          y: yData,
          type: 'scatter',
          name: `${code}_alpha20`,
        });
      }
      if (traces.includes('std')) {
        const yData = this.traceDataCache.get(`${code}_std`);
        this.alphaGraph.data.push({
          x: xData,
          y: yData,
          type: 'scatter',
          name: `${code}_std`,
        });
      }
      if (traces.includes('std_result')) {
        const yData = this.traceDataCache.get(`${code}_std_result`);
        this.alphaGraph.data.push({
          x: xData,
          y: yData,
          type: 'scatter',
          name: `${code}_std_result`,
        });
      }
      xData.splice(0, 4);
      if (traces.includes('avg_result_5')) {
        const yData = this.traceDataCache.get(`${code}_avg_result_5`);
        this.alphaGraph.data.push({
          x: xData,
          y: yData,
          type: 'scatter',
          name: `${code}_avg_result_5`,
        });
      }
      xData.splice(0, 5);
      if (traces.includes('avg_result_10')) {
        const yData = this.traceDataCache.get(`${code}_avg_result_10`);
        this.alphaGraph.data.push({
          x: xData,
          y: yData,
          type: 'scatter',
          name: `${code}_avg_result_10`,
        });
      }
    }
  }
}

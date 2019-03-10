import { Injectable } from '@angular/core';
import * as moment from 'moment';
import * as loki from 'lokijs';
import * as tf from '@tensorflow/tfjs';

export interface Ths {
  code: string;
  name: string;
  traces?: Array<string>;
}

function cumsum(tensor, length, count) {
  const tensors = [];
  for (let i = 0; i < count; i++) {
    tensors.push(tensor.pad([[i, count -1 - i]]));
  }
  const stack = tf.stack(tensors);
  const result = stack.sum(0).slice([count - 1], [length - count + 1]);
  return result;
}

function cummean(tensor, length, count) {
  const tensors = [];
  for (let i = 0; i < count; i++) {
    tensors.push(tensor.pad([[i, count -1 - i]]));
  }
  const stack = tf.stack(tensors);
  const result = stack.mean(0).slice([count - 1], [length - count + 1]);
  return result;
}

function cumvariance(tensor, length, count) {
  const tensors = [];
  for (let i = 0; i < count; i++) {
    tensors.push(tensor.pad([[i, count -1 - i]]));
  }
  const stack = tf.stack(tensors);
  const { variance } = tf.moments(stack, [0]);
  const result = variance.slice([count - 1], [length - count + 1]);
  return result;
}

const blCode = '801300.SL';
const thsCodeList = [
  '801111.SL',
  '801081.SL',
  '801141.SL',
  '801194.SL',
  '801712.SL',
  '801020.SL',
  '801024.SL',
  '801211.SL',
  '801017.SL',
  '801760.SL',
  '801744.SL',
  '801743.SL',
  '801731.SL',
  '801161.SL',
  '801730.SL',
  '801732.SL',
  '801733.SL',
  '801080.SL',
  '801085.SL',
  '801018.SL',
  '801191.SL',
  '801180.SL',
  '801181.SL',
  '801721.SL',
  '801130.SL',
  '801131.SL',
  '801790.SL',
  '801132.SL',
  '801041.SL',
  '801040.SL',
  '801171.SL',
  '801734.SL',
  '801175.SL',
  '801055.SL',
  '801172.SL',
  '801160.SL',
  '801084.SL',
  '801740.SL',
  '801173.SL',
  '801742.SL',
  '801741.SL',
  '801176.SL',
  '801752.SL',
  '801030.SL',
  '801032.SL',
  '801033.SL',
  '801034.SL',
  '801151.SL',
  '801162.SL',
  '801053.SL',
  '801174.SL',
  '801890.SL',
  '801723.SL',
  '801750.SL',
  '801101.SL',
  '801222.SL',
  '801110.SL',
  '801142.SL',
  '801710.SL',
  '801720.SL',
  '801170.SL',
  '801051.SL',
  '801075.SL',
  '801212.SL',
  '801213.SL',
  '801011.SL',
  '801214.SL',
  '801202.SL',
  '801021.SL',
  '801012.SL',
  '801010.SL',
  '801013.SL',
  '801022.SL',
  '801082.SL',
  '801713.SL',
  '801881.SL',
  '801144.SL',
  '801215.SL',
  '801880.SL',
  '801092.SL',
  '801093.SL',
  '801094.SL',
  '801140.SL',
  '801193.SL',
  '801163.SL',
  '801200.SL',
  '801205.SL',
  '801152.SL',
  '801035.SL',
  '801023.SL',
  '801124.SL',
  '801120.SL',
  '801112.SL',
  '801711.SL',
  '801164.SL',
  '801014.SL',
  '801036.SL',
  '801177.SL',
  '801770.SL',
  '801102.SL',
  '801223.SL',
  '801072.SL',
  '801761.SL',
  '801178.SL',
  '801054.SL',
  '801037.SL',
  '801210.SL',
  '801203.SL',
  '801156.SL',
  '801153.SL',
  '801154.SL',
  '801150.SL',
  '801073.SL',
  '801192.SL',
  '801780.SL',
  '801123.SL',
  '801751.SL',
  '801050.SL',
  '801015.SL',
  '801083.SL',
  '801725.SL',
  '801182.SL',
  '801076.SL',
  '801143.SL',
  '801155.SL',
  '801016.SL',
  '801724.SL',
  '801204.SL',
  '801074.SL',
  '801722.SL',
  '801231.SL',
  '801230.SL'
];

@Injectable({
  providedIn: 'root'
})
export class AnalysisService {
  db: any;
  thsList: Array<Ths> = [];

  constructor() {
    this.db = new loki('index.db', {
      autoload: false,
      autosave: false
    });
  }

  loadDatabase(csvText) {
    const lines = csvText.split('\n');
    this.db.loadDatabase({}, () => {
      const coll = this.db.addCollection('indices', { indices: ['time', 'code'] });
      const thsList = [];
      for (let line of lines) {
        const [time, code, name, index, index300] = line.split(',');
        const indexVal = parseFloat(index);
        coll.insert({
          code, 
          name, 
          time: moment(time, 'YYYY-MM-DD').toDate(), 
          index: isNaN(indexVal) ? 0 : indexVal
        });
        if (thsCodeList.includes(code) && thsList.findIndex(ths => ths.code === code) < 0) {
          thsList.push({
            code,
            name
          });
        }
      }
      this.thsList = thsList;
    });
  }

  getThsList() {
    return this.thsList;
  }

  getDateArray() {
    const coll = this.db.getCollection('indices');
    return coll
      .chain()
      .find({ code: blCode })
      .simplesort('time')
      .data()
      .map(({time}) => new Date(time).toISOString().slice(0, 10));
  }

  getBaseline() {
    const coll = this.db.getCollection('indices');
    const blArray = coll
      .chain()
      .find({ code: blCode })
      .simplesort('time')
      .data()
      .map(({index}) => index);
    return tf.tensor1d(blArray);
  }

  getIndustryLine(code) {
    const coll = this.db.getCollection('indices');
    const indArray = coll
      .chain()
      .find({ code })
      .simplesort('time')
      .data()
      .map(({index}) => index);
    return tf.tensor1d(indArray);
  }

  calculate(code) {
    const alpha = this.calculateAlpha(code);
    const alpha20 = this.calculateAlphaSum(alpha, 20);
    const std = this.calculateStd(alpha, 20);
    const std_result = this.calculateStdResult(alpha20, std);
    const avg_result_5 = this.calculateAvgResult(std_result, 5);
    const avg_result_10 = this.calculateAvgResult(std_result, 10);
    return {
      alpha,
      alpha20,
      std,
      std_result,
      avg_result_5,
      avg_result_10
    };
  }

  calculateAlpha(code) {
    const ind = this.getBaseline();
    const bl = this.getIndustryLine(code);
    return ind.sub(bl);
  }

  calculateAlphaSum(alpha, count) {
    return cumsum(alpha, 266, count);
  }

  calculateStd(alpha, count) {
    const variance = cumvariance(alpha, 266, count);
    return variance.mul(tf.scalar(count).div(tf.scalar(count - 1))).sqrt();
  }

  // TODO: to be extended with count parameter
  calculateStdResult(alpha20, std) {
    const sqrt20 = tf.scalar(20).sqrt();
    return alpha20.div(std).div(sqrt20);
  }

  calculateAvgResult(std_result, count) {
    return cummean(std_result, 247, count);
  }
}

import { ServerRespond } from './DataStreamer';

export interface Row {
  price_abc: number,
  price_def: number,
  ratio: number,
  upper_bound: number,
  lower_bound: number,
  trigger_alert: number | undefined,
  timestamp: Date,
}


export class DataManipulator {
   static count =0;
   static prev_avg =0.0;
  static generateRow(serverRespond: ServerRespond[]): Row {
      const priceABC = (serverRespond[0].top_ask.price + serverRespond[0].top_bid.price)/2;
      const priceDEF = (serverRespond[1].top_ask.price + serverRespond[1].top_bid.price)/2;
      const ratio = priceABC/priceDEF;
      var avg_ratio = (this.prev_avg*this.count + ratio)/(this.count+1);
      const upper_bound = this.count>365?avg_ratio*1.1:1.1; //Approximately 12 months of initial data wil not be affected asnotenough data to calculate average
      const lower_bound = this.count>365?avg_ratio*0.9:0.9;
      this.count++;
      this.prev_avg = avg_ratio;
      return {
        price_abc: priceABC,
        price_def: priceDEF,
        ratio: ratio,
        upper_bound: upper_bound,
        lower_bound: lower_bound,
        trigger_alert: (ratio>upper_bound || ratio<lower_bound)?ratio : undefined,
        timestamp: serverRespond[0].timestamp>serverRespond[1].timestamp?serverRespond[0].timestamp:serverRespond[1].timestamp,
      };
    
  }
}

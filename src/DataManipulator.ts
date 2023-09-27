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
  static generateRow(serverRespond: ServerRespond[]): Row {
      const priceABC = (serverRespond[0].top_ask.price + serverRespond[0].top_bid.price)/2;
      const priceDEF = (serverRespond[1].top_ask.price + serverRespond[1].top_bid.price)/2;
      const ratio = priceABC/priceDEF;
      const upper_bound = 1+0.10;
      const lower_bound = 1-0.10;
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

import {Injectable, signal, Signal, WritableSignal} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ICurrency, ICurrencyResponse} from "../app/types/converter.type";
import {map, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ConverterService {
  currencies$: WritableSignal<ICurrency[]> = signal([]);
  constructor(private httpClient: HttpClient) { }

  fetchCurrencies(): void {
     this.httpClient.get<ICurrencyResponse>('https://api.currencyapi.com/v3/latest?apikey=cur_live_HWNZFWaeJqA4ouViQp4enxFKLpAw9jHhGCVZ3ouQ').pipe(
      map((response: ICurrencyResponse)=> {
        const selectedCurrencies = [
          response.data['USD'],
          response.data['RUB'],
          response.data['GBP'],
          response.data['EUR'],
        ];
        return selectedCurrencies;
      })
    ).subscribe(data => {
      this.currencies$.set(data);
    })
  }

  getCurrencies(): ICurrency[] {
    return this.currencies$();
  }
}

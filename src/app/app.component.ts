import {Component, computed, NgModule, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {ConverterService} from "../services/converter.service";
import {CommonModule} from "@angular/common";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {toNumbers} from "@angular/compiler-cli/src/version_helpers";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'converter';
  currentCurrencies = computed( ()=> this.converterService.getCurrencies());
  converterForm!: FormGroup;
  from!: number;
  to!: number;
  usd!: number;
  eur!: number;
  rub!: number;
  gbp!: number;

  constructor(private converterService: ConverterService,
              private fb: FormBuilder) {
    this.converterService.fetchCurrencies();
  }

  ngOnInit(): void {
    this.initForm();
    this.handleFormChanges()
  }

  initForm(): void {
    this.converterForm = this.fb.group({
      fromCode: ['USD'],
      toCode: ['EUR'],
      fromValue: ['', [Validators.required, Validators.pattern("[0-9]{10}")]],
      toValue: ['', [Validators.required, Validators.pattern("[0-9]{10}")]],
    })
  }

  get toValue() {
    return this.converterForm.get('toValue')?.value;
  }

  get toCode() {
    return this.converterForm.get('toCode')?.value;
  }

  get fromCode() {
    return this.converterForm.get('fromCode')?.value;
  }
  handleFormChanges() {
    const fromValueControl = this.converterForm.get('fromValue');
    const toValueControl = this.converterForm.get('toValue');
    const fromCode= this.converterForm.get('fromCode');
    const toCode = this.converterForm.get('toCode');

    fromValueControl?.valueChanges.subscribe(value => {
      this.updateToValue(value);
    });

    toValueControl?.valueChanges.subscribe(value => {
      this.updateFromValue(value);
    });

    fromCode?.valueChanges.subscribe(code => {
      this.updateToValue(fromValueControl?.value);
    })

    toCode?.valueChanges.subscribe(code => {
      this.updateFromValue(toValueControl?.value);
    })
  }

  private updateToValue(fromValue: number) {
    const currencies = this.currentCurrencies();
    if (currencies) {
      const currencyFromValue = this.getCurrencyValue(this.fromCode, currencies);
      const currencyToValue = this.getCurrencyValue(this.toCode, currencies);
      if (currencyFromValue && currencyToValue) {
        this.converterForm.get('toValue')?.setValue((fromValue / currencyFromValue)*currencyToValue, { emitEvent: false });
      }
    }
  }

  private updateFromValue(toValue: number) {
    const currencies = this.currentCurrencies();
    if (currencies) {
      const currencyFromValue = this.getCurrencyValue(this.toCode, currencies);
      const currencyToValue = this.getCurrencyValue(this.fromCode, currencies);
      if (currencyFromValue && currencyToValue) {
        this.converterForm.get('fromValue')?.setValue((toValue / currencyFromValue)*currencyToValue, { emitEvent: false });
      }
    }
  }

  private getCurrencyValue(code: string, currencies: any[]): number | undefined {
    const currency = currencies.find(x => x.code === code);
    return currency?.value;
  }
}


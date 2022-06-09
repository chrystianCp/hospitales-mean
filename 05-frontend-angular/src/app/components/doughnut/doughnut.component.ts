import { Component, Input } from '@angular/core';
import { MultiDataSet, Label, Color } from 'ng2-charts';


@Component({
  selector: 'app-doughnut',
  templateUrl: './doughnut.component.html',
  styles: [
  ]
})
export class DoughnutComponent {

  @Input() title: string = 'sin titulo';

  @Input('labels') doughnutChartLabels: Label[] = ['label1', 'label2', 'label3'];
  
  @Input('data') doughnutChartData: MultiDataSet = [
    [350, 450, 100],
  ];
  
  public colors: Color[] = [
    { backgroundColor: ['#6857E6', '#009FEE', '#F02059'] }
  ];

}

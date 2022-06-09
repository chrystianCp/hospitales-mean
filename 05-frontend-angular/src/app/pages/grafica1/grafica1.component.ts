import { Component, Input } from '@angular/core';



@Component({
  selector: 'app-grafica1',
  templateUrl: './grafica1.component.html',
  styles: [
  ]
})
export class Grafica1Component{
  
  
  public labels1: string[] = ['hoodie', 'sandals Jordan', 'buckethat'];
  public data1 = [
    [3, 5, 10],
  ]; 
}

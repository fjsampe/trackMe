import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.scss'],
})
export class StarRatingComponent implements OnInit, OnChanges {
  
 
  @Input() rating: number;
  @Output() changeRating = new EventEmitter<number>();
  fill; empty=[];
  constructor() { }

  ngOnInit() {
    this.fill=Array(this.rating).fill(0).map((x,i)=>i+1);
    this.empty=Array(5-this.rating).fill(0).map((x,i)=>i+this.rating+1);
    
  } 
  
  // This method is called when @Input properties change (rating)
  ngOnChanges() {
    this.fill=Array(this.rating).fill(0).map((x,i)=>i+1);
    this.empty=Array(5-this.rating).fill(0).map((x,i)=>i+this.rating+1);
  }

  changeStar(num:number) {
    this.rating=num;
    this.changeRating.emit(this.rating);
  }

}





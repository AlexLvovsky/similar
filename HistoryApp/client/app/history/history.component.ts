import { Component, OnInit } from '@angular/core';
import {UrlService} from "../services/url.service";

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

  private urls = [];
  private isLoading = true;
  constructor(private urlService: UrlService) { }

  ngOnInit() {
    this.getUrls();
  }

  getUrls() {
    this.urlService.getUrls().subscribe(
      data => {this.urls = data; },
      error => console.log(error),
      () => this.isLoading = false
    );
  }
}

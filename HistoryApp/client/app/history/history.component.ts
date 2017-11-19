import {AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {UrlService} from '../services/url.service';
import { DataTableDirective } from 'angular-datatables';
import {Subject} from 'rxjs/Rx';

import 'rxjs/add/operator/map';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HistoryComponent implements OnInit {
  @ViewChild(DataTableDirective)
  datatableElement: DataTableDirective;

  dtOptions: any = {};
  // We use this trigger because fetching the list of persons can be quite long,
  // thus we ensure the data is fetched before rendering
  dtTrigger: Subject<any> = new Subject();
  private urls = [];
  private isLoading = true;
  customColumnsDef: any[] = [];
  columnsArray: any[] = [];

  constructor(private urlService: UrlService) {
  }

  ngOnInit() {
    this.columnsArray = [
      {title: 'Time', data: 'time', name: 'time', width: '20%'},
      {title: 'URL', data: 'url', name: 'url', width: '50%'},
      {title: 'Email', data: 'email', name: 'email', width: '30%'},
      {title: 'Frames', data: 'frames', name: 'frames', class: 'none'},
    ];
    this.customColumnsDef = [
      {
        targets: 0,
        render: (data, type, full) => {
          const transformedValue = this.transform(full.time);
          if (type === 'display') {
            return `<span>${transformedValue}</span>`;
          }
          // For sorting, filtering and etc.
          else {
            return data;
          }
        }
      },
      {
        targets: 3,
        render: (data, type, full) => {
          if (type === 'display') {
            let html = '<ul>';
            full.frames.forEach(frame => {
              if (frame) {
                html = html.concat('<li>').concat(frame).concat('</li>');
              }
            });
            html = html.concat('</ul>');
            return html;
          }
          // For sorting, filtering and etc.
          else {
            return data;
          }
        }
      },
    ];
    this.dtOptions = {
      paging: true,
      info: false,
      autoWidth: false,
      order: [[0, 'desc']],
      columnDefs: this.customColumnsDef,
      columns: this.columnsArray,
      data: this.urls,
      dom: 'rtlip',
      // Use this attribute to enable the responsive extension
      responsive: true
    };
    this.getUrls();
  }

  update() {
    if (this.datatableElement) {
      this.datatableElement.dtInstance.then(dtInstance => {
        dtInstance.clear();
        dtInstance.rows.add(this.urls).draw();
      });
    }
  }

  columnSearch(event?) {
    this.datatableElement.dtInstance.then(dtInstance => {
      dtInstance.columns(event.srcElement.name + ':name').search(event.srcElement.value).draw();
    });
  }

  getUrls() {
    this.urlService.getUrls().subscribe(
      data => {
        this.urls = data;
        this.dtTrigger.next();
        this.update();
      },
      error => console.log(error),
      () => this.isLoading = false
    );
  }

  transform(value: string) {
    const d = new Date(value);
    const now = new Date();
    const seconds = Math.round(Math.abs((now.getTime() - d.getTime()) / 1000));
    const minutes = Math.round(Math.abs(seconds / 60));
    const hours = Math.round(Math.abs(minutes / 60));
    const days = Math.round(Math.abs(hours / 24));
    if (minutes === 0) {
      return 'less then 1 minute ago';
    } else if (minutes === 1) {
      return '1 minute ago';
    } else if (minutes <= 59) {
      return minutes + ' minutes ago';
    } else if (hours === 1) {
      return '1 hour ago';
    } else if (hours <= 23) {
      return hours + ' hours ago';
    } else if (days === 1) {
      return '1 day ago';
    } else {
      return days + ' days ago';
    }
  }
}

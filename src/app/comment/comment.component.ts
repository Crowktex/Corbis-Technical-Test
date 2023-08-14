import { Component, inject, AfterViewInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import {MatTabsModule} from '@angular/material/tabs';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import {MatSort, Sort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import db from '../../assets/database/db.json';





export interface PerspectiveElement {
  id: number;
  name: string;
}

export interface ObjectiveElement {
  id: number;
  code: string;
  name: string;
  description: string;
  perspective: PerspectiveElement;
}

export interface CommentElement {
  id: number;
  date: string;
  author: string;
  comment: string;
}

const perspectives: PerspectiveElement[] = db.perspectives;
const objectives: ObjectiveElement[] = db.objectives;





@Component({
  selector: 'app-comment-and-tables',
  styleUrls: ['./comment.component.css'],
  templateUrl: './comment.component.html',
  encapsulation: ViewEncapsulation.None
  
})
export class CommentAndTables implements AfterViewInit {
 
  displayedColumnsPerspectives: string[] = ['id', 'name'];
  displayedColumnsObjectives: string[] = [
    'code',
    'perspective',
    'name',
    'description',
  ];
  dataPerspectives = new MatTableDataSource(perspectives);
  dataObjectives = new MatTableDataSource(objectives);

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataPerspectives.filter = filterValue.trim().toLowerCase();
    this.dataObjectives.filter = filterValue.trim().toLowerCase();
    
    
}

  constructor(private _liveAnnouncer: LiveAnnouncer) {}
//@ViewChild(MatSort) sort!: MatSort;

  @ViewChild('perspectiveSort') perspectiveSort = new MatSort();
  @ViewChild('objectivesSort') objectivesSort = new MatSort();

  @ViewChild('paginatorFirst') paginatorFirst!: MatPaginator;
  @ViewChild('paginatorSecond') paginatorSecond!: MatPaginator;

  ngAfterViewInit() {
    this.dataPerspectives.sort = this.perspectiveSort;
    this.dataPerspectives.paginator = this.paginatorFirst;

    this.dataObjectives.sort = this.objectivesSort;
    this.dataObjectives.sortingDataAccessor = (
      row: ObjectiveElement,
      columnName: string
    ): string => {
      if (columnName == 'perspective') return row.perspective.name;
      var columnValue = row[columnName as keyof PerspectiveElement] as string;
      return columnValue;
    };
    this.dataObjectives.paginator = this.paginatorSecond;
  }
  

  public sidebarShow: boolean = false;
  private breakpointObserver = inject(BreakpointObserver);

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  comments: CommentElement[] = db.comments;
}
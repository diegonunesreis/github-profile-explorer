import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router"

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  searchText = '';

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  submitSearch(): void {
    if (this.searchText.trim().length === 0) {
      return;
    }
    this.router.navigate(['/search'], { queryParams: { q: this.searchText } });
  }
}

import { ResultItem } from './../shared/interfaces/users-search-result';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersSearchResult } from '../shared/interfaces/users-search-result';
import { GithubService } from '../shared/services/github.service';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent implements OnInit {

  queryParams: string | null = null;
  PER_PAGE = 10;
  PAGE_NUM = 1;

  searchText: string = '';
  resultItems: ResultItem[] = []

  constructor(private route: ActivatedRoute,
    public githubService: GithubService,
    private router: Router) {
  }

  ngOnInit(): void {
    this.queryParams = this.route.snapshot.queryParamMap.get('q');
    this.searchText = this.queryParams!;
    this.searchUsers();
  }

  searchUsers(): void {
    this.githubService.searchByUsername(this.searchText, this.PER_PAGE, this.PAGE_NUM)
      .subscribe((res: UsersSearchResult) => {
        // console.log(res);
        this.resultItems = res.items;
      });
  }

  submitSearch(): void {
    if (this.searchText.trim().length === 0) {
      return;
    }

    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['/search'], { queryParams: { q: this.searchText } });
  }
}

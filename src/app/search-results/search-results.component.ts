import { ResultItem } from './../shared/interfaces/users-search-result';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersSearchResult } from '../shared/interfaces/users-search-result';
import { GithubService } from '../shared/services/github.service';
import { UserRepos } from '../shared/interfaces/user-repos';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css'],
})

export class SearchResultsComponent implements OnInit {
  queryParams: string | null = null;

  searchText: string = '';
  searchResult = new UsersSearchResults();
  originalSearch: UsersSearchResults;
  page: number = 1;
  pageSize: number = 10;
  starsRange: number = 0;
  repoFilter: string = '';
  isCollapsed = true;

  selectedSort: any;
  sortOptions: any = [
    { name: "Most followers", options: { sort: "followers", order: "desc" } },
    { name: "Fewest followers", options: { sort: "followers", order: "asc" } },
    { name: "Most recently joined", options: { sort: "joined", order: "desc" } },
    { name: "Least recently joined", options: { sort: "joined", order: "asc" } },
    { name: "Most repositories", options: { sort: "repositories", order: "desc" } },
    { name: "Fewest repositories", options: { sort: "repositories", order: "asc" } }];

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
    this.githubService.searchByUsername(this.searchText, this.pageSize, this.page, this.selectedSort)
      .subscribe((res: UsersSearchResult) => {
        console.log(res);
        this.searchResult = res;
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

  pageChanged(event: any) {
    this.page = event;
    this.searchUsers();
  }

  // Github API only provides the first 1000 search results
  getTotalCount(count: number): number {
    return count < 1000 ? count : 1000;
  }

  setStars(event: any): void {
    const objIndex = this.searchResult.items.findIndex((obj => obj.login === event.login));
    if (objIndex >= 0) {
      this.searchResult.items[objIndex].starsAmount = event.starsAmount;
    }
  }

  setRepos(event: any): void {
    const objIndex = this.searchResult.items.findIndex((obj => obj.login === event.login));
    if (objIndex >= 0) {
      this.searchResult.items[objIndex].repos = event.repos;
    }
  }

  filtersChanged(): void {
    const starsLimit = this.getStarsRange(this.starsRange);

    if (starsLimit === 0 && this.repoFilter === '' && this.originalSearch) {
      this.searchResult = { ...this.originalSearch };
      return;
    }

    if (!this.originalSearch) {
      this.originalSearch = { ...this.searchResult };
    }

    if (starsLimit > 0 && this.repoFilter === '') {
      this.searchResult.items = this.originalSearch.items.filter(i =>
        i.starsAmount && i.starsAmount < starsLimit
      );
    } else if (this.repoFilter !== '' && starsLimit === 0) {
      this.searchResult.items = this.originalSearch.items.filter(i =>
        i.repos && i.repos.some(r => r.name.includes(this.repoFilter))
      );
    } else {
      this.searchResult.items = this.originalSearch.items.filter(i =>
        i.repos && i.repos.some(r => r.name.includes(this.repoFilter))
        && i.starsAmount && i.starsAmount < starsLimit
      );
    }
  }

  getStarsRange(num: number): number {
    switch (num) {
      case 1: return 10;
      case 2: return 100;
      case 3: return 500;
      case 4: return 1000;
      case 5: return 10000;
      case 6: return 100000;
      default: return 0;
    }
  }

  getStarsRangeText(num: number): string {
    return num === 0 ? "Any" : `< ${this.getStarsRange(num)}`;
  }
}

export class Item implements ResultItem {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
  score: number;
  starsAmount?: number;
  repos?: UserRepos[];
}

export class UsersSearchResults implements UsersSearchResult {
  total_count: number;
  incomplete_results: boolean;
  items: Item[];
}
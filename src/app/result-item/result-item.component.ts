import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { tap } from 'rxjs';
import { User } from '../shared/interfaces/user';
import { UserRepos } from '../shared/interfaces/user-repos';
import { ResultItem } from '../shared/interfaces/users-search-result';
import { GithubService } from '../shared/services/github.service';

@Component({
  selector: 'app-result-item',
  templateUrl: './result-item.component.html',
  styleUrls: ['./result-item.component.css']
})
export class ResultItemComponent implements OnInit {

  @Input() resultItem: ResultItem | undefined;
  @Output() setStars = new EventEmitter();
  @Output() setRepos = new EventEmitter();

  user: User | undefined;
  starsAmount: string | undefined = '';

  constructor(public githubService: GithubService) { }

  ngOnInit(): void {
    this.getUserData();
    this.getUserStars();
    this.getUserRepos();
  }

  getUserStars() {
    this.githubService.getStarsAmount(this.resultItem?.login!)
      .pipe(
        tap(res => {
          const Link = this.parse_link_header(res.headers.get('Link'));
          this.starsAmount = Link ? Link['last'].replace(/.*&page=(.*)/, '$1').trim() : '0';
          this.setStars.emit({ login: this.resultItem?.login, starsAmount: this.starsAmount });
        })
      ).subscribe();
  }

  getUserData() {
    this.githubService.getUserByUsername(this.resultItem?.login!)
      .subscribe((res: User) => {
        this.user = res;
      });
  }

  getUserRepos() {
    this.githubService.getReposByUsername(this.resultItem?.login!)
      .subscribe((res: UserRepos) => {
        this.setRepos.emit({ login: this.resultItem?.login, repos: res });
      });
  }

  parse_link_header(header: any) {
    if (!header || header.length == 0) {
      return;
    }
    const parts = header.split(',');
    const links: any = {}
    parts.forEach((p: string) => {
      const section = p.split(';');
      const url = section[0].replace(/<(.*)>/, '$1').trim();
      const name = section[1].replace(/rel="(.*)"/, '$1').trim();
      links[name] = url;
    });
    return links;
  }
}

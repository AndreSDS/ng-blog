import { ArticleService } from './../article-list/article.service';
import { Article } from './../article';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { Title, Meta } from '@angular/platform-browser';
import { TitleService } from '../shared/title.service';

@Component({
    selector: 'app-article',
    templateUrl: './article.component.html',
    styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit {

    article: Article = new Article();

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private articleService: ArticleService,
        private titleService: Title,
        private blogTitle: TitleService,
        private meta: Meta
    ) { }

    ngOnInit(): void {
        this.getArticleKey();
    }

    getArticleKey() {
        this.route.params.pipe(
            take(1)
        ).subscribe(params => {
            const key = params.key;
            this.articleService.getArticletByKey(key).pipe(
                take(1)
            ).subscribe(
                article => {
                    (!article) ? this.router.navigateByUrl('404') : this.article = article;

                    this.titleService.setTitle(`${this.article.title} - ${this.blogTitle.blogTitle}`);
                    this.meta.addTags([
                        { name: "description", content: this.article.description },
                        { name: "og:title", content: `${this.article.title} - ${this.blogTitle.blogTitle}` },
                        { name: "og:type", content: "website" },
                        { name: "og:url", content: this.blogTitle.baseUrl + this.article.key},
                        { name: "og:image", content: this.article.imageUrl},
                        { name: "og:description", content: this.article.description},
                        { name: "og:site_name", content: this.blogTitle.blogTitle}
                    ]);
                }
            );
        });
    };

}

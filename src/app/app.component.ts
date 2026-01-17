import { Component } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { ThemeService } from "./common/service/theme.service";
import { TranslateService } from "@ngx-translate/core";

@Component({
    selector: 'app-root',
    imports: [RouterOutlet],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    constructor(private themeService: ThemeService, private translateService: TranslateService,
    ) {
        this.translateService.addLangs(["en"]);
        this.translateService.setDefaultLang("en");
        this.translateService.use("en");
        this.themeService.setThemeColors(this.themeService.defaultColors.primary);
    }
}

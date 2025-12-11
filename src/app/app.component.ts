import { Component } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { ThemeService } from "./common/service/theme.service";

@Component({
    selector: 'app-root',
    imports: [RouterOutlet],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    constructor(private themeService: ThemeService) {
        this.themeService.setThemeColors(this.themeService.defaultColors.primary)
    }
}

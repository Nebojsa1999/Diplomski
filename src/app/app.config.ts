import { APP_INITIALIZER, ApplicationConfig, inject, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, RouterLink, RouterLinkActive, RouterOutlet, withHashLocation } from '@angular/router';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HttpClient, provideHttpClient, withInterceptors } from "@angular/common/http";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipModule } from "@angular/material/tooltip";
import { MAT_CARD_CONFIG, MatCardModule } from "@angular/material/card";
import { CommonModule, DecimalPipe } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatTabsModule } from "@angular/material/tabs";
import { MatTableModule } from "@angular/material/table";
import { MatSortModule } from "@angular/material/sort";
import { MatSelectModule } from "@angular/material/select";
import { MatDialogModule } from "@angular/material/dialog";
import { MatDividerModule } from "@angular/material/divider";
import { MatRadioModule } from "@angular/material/radio";
import { MAT_DATE_LOCALE, MatRippleModule } from "@angular/material/core";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatTreeModule } from "@angular/material/tree";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { provideLuxonDateAdapter } from "@angular/material-luxon-adapter";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatChipsModule } from "@angular/material/chips";
import { MatGridListModule } from "@angular/material/grid-list";
import { provideEchartsCore } from "ngx-echarts";
import * as echarts from 'echarts';
import { MatPaginatorModule } from "@angular/material/paginator";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { MatSliderModule } from "@angular/material/slider";
import { ApiClient } from "./rest/api-client";
import { ApiClientService } from "./rest/api-client.service";
import { routes } from './app-routes';
import { authenticationInterceptor } from "./rest/authentication.iterceptor";
import { ThemeService } from "./common/service/theme.service";

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes, withHashLocation()),
        provideAnimationsAsync(),
        provideZonelessChangeDetection(),
        provideHttpClient(withInterceptors([authenticationInterceptor])),
        provideLuxonDateAdapter(),
        provideEchartsCore({echarts}),
        {
            provide: ApiClient,
            useClass: ApiClientService,
            deps: [HttpClient],
        },
        {
            provide: APP_INITIALIZER,
            useFactory: () => {
                inject(ThemeService);
            },
        },
        {
            provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
            useValue: {
                subscriptSizing: 'dynamic',
                appearance: 'outline',
            },
        },
        {
            provide: MAT_TOOLTIP_DEFAULT_OPTIONS,
            useValue: {
                showDelay: 700
            },
        },
        {
            provide: MAT_CARD_CONFIG,
            useValue: {
                appearance: 'outlined',
            },
        },
        {
            provide: MAT_DATE_LOCALE,
            useValue: 'en',
        },
        DecimalPipe
    ],
};

export const angularComponents = [
    MatButtonModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatMenuModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatSidenavModule,
    MatTabsModule,
    MatTableModule,
    MatIconModule,
    MatCardModule,
    MatSelectModule,
    MatDialogModule,
    MatSortModule,
    MatRadioModule,
    MatRippleModule,
    MatDividerModule,
    MatToolbarModule,
    MatInputModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatTreeModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatGridListModule,
    MatPaginatorModule,
    MatSliderModule
];

export const shared = [
    ...angularComponents,
    ReactiveFormsModule,
    CommonModule,
    RouterLink,
    RouterOutlet,
    RouterLinkActive,
    DragDropModule
];

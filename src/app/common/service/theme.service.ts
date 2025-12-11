import { DOCUMENT, Inject, Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";
import { argbFromHex, Hct, hexFromArgb, TonalPalette } from "@material/material-color-utilities";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

export interface Color {
    name: string;
    value: string;
}

export interface Theme {
    primary: string;
    secondary: string;
    tertiary: string;
    error: string;
    neutral: string;
    neutralVariant: string;
    warning: string;
    success: string;
}

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private readonly DEFAULT_COLORS: Theme = {
        primary: "#00AFFF",
        secondary: "#C8E1FF",
        tertiary: "#004B32",
        error: "#FF0032",
        neutral: "#191919",
        neutralVariant: "#323232",
        warning: "#ff8e00",
        success: "#4caf50",
    }

    private readonly themeColors$ = new BehaviorSubject<Theme>(this.DEFAULT_COLORS);

    constructor(@Inject(DOCUMENT) private readonly document: Document) {
        this.themeColors$.pipe(takeUntilDestroyed()).subscribe((colors) => this.updateThemeVariables(colors));
    }

    get defaultColors() {
        return this.DEFAULT_COLORS;
    }

    setThemeColors(primaryColor?: string, secondaryColor?: string, tertiaryColor?: string) {
        const currentTheme = this.themeColors;
        const primary = primaryColor ?? currentTheme.primary;
        const secondary = secondaryColor ?? currentTheme.secondary;
        const tertiary = tertiaryColor ?? currentTheme.tertiary;

        this.themeColors$.next({
            ...currentTheme,
            primary,
            secondary,
            tertiary
        })
    }


    get themeColors(): Theme {
        return this.themeColors$.value;
    }

    private updateThemeVariables(theme: Theme) {
        this.updateColorVariables('primary', theme.primary);
        this.updateColorVariables('secondary', theme.secondary);
        this.updateColorVariables('tertiary', theme.tertiary);
        this.updateColorVariables('error', theme.error);
        this.updateColorVariables('neutral', theme.neutral, true);
        this.updateColorVariables('neutral-variant', theme.neutralVariant,);
        this.updateColorVariables('warning', theme.warning);
        this.updateColorVariables('success', theme.success);
    }

    private updateColorVariables(name: string, color: string, hasAdditionalValues = false) {
        const palette = this.computeColorPalette(color, hasAdditionalValues);
        for (const variant of palette) {
            this.document.documentElement.style.setProperty(`--${name}-color${variant.name}`, variant.value);
        }
    }

    private computeColorPalette(hex: string, hasAdditionalValues: boolean): Color[] {
        const palette = TonalPalette.fromHct(Hct.fromInt(argbFromHex(hex)));
        const colorPalette = [
            this.getColorObject(palette, 0, '-0'),
            this.getColorObject(palette, 10, '-10'),
            this.getColorObject(palette, 20, '-20'),
            this.getColorObject(palette, 25, '-25'),
            this.getColorObject(palette, 30, '-30'),
            this.getColorObject(palette, 35, '-35'),
            this.getColorObject(palette, 40, '-40'),
            this.getColorObject(palette, 50, '-50'),
            this.getColorObject(palette, 60, '-60'),
            this.getColorObject(palette, 70, '-70'),
            this.getColorObject(palette, 80, '-80'),
            this.getColorObject(palette, 90, '-90'),
            this.getColorObject(palette, 95, '-95'),
            this.getColorObject(palette, 98, '-98'),
            this.getColorObject(palette, 99, '-99'),
            this.getColorObject(palette, 100, '-100'),
        ];

        const additionalValues = [
            this.getColorObject(palette, 4, '-4'),
            this.getColorObject(palette, 6, '-6'),
            this.getColorObject(palette, 12, '-12'),
            this.getColorObject(palette, 17, '-17'),
            this.getColorObject(palette, 22, '-22'),
            this.getColorObject(palette, 24, '-24'),
            this.getColorObject(palette, 87, '-87'),
            this.getColorObject(palette, 92, '-92'),
            this.getColorObject(palette, 94, '-94'),
            this.getColorObject(palette, 96, '-96'),
        ]

        return hasAdditionalValues ? [...colorPalette, ...additionalValues] : colorPalette;
    }

    private getColorObject(palette: TonalPalette, tone: number, name: string): Color {
        const hex = hexFromArgb(Hct.from(palette.hue, palette.chroma, tone).toInt());
        return {
            name,
            value: hex,
        };
    }
}

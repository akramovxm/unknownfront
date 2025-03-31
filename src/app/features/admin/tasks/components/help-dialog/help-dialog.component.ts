import {Component, inject, OnInit} from '@angular/core';
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from "@angular/material/dialog";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
    MatTable
} from "@angular/material/table";
import {MathjaxService} from "@services/mathjax.service";
import {MatIcon} from "@angular/material/icon";
import {MatButton} from "@angular/material/button";

export interface Info {
    description: string;
    symbol: string;
    example: string;
    result: string;
}

@Component({
    selector: 'app-help-dialog',
    imports: [
        MatDialogContent,
        MatDialogTitle,
        TranslatePipe,
        MatTable,
        MatColumnDef,
        MatHeaderCell,
        MatCell,
        MatCellDef,
        MatHeaderCellDef,
        MatHeaderRow,
        MatRow,
        MatRowDef,
        MatHeaderRowDef,
        MatIcon,
        MatDialogActions,
        MatButton,
        MatDialogClose
    ],
    templateUrl: './help-dialog.component.html',
    styleUrl: './help-dialog.component.scss'
})
export class HelpDialogComponent implements OnInit {
    private readonly mathjaxService = inject(MathjaxService);
    private readonly translate = inject(TranslateService);

    ngOnInit(): void {
        this.mathjaxService.renderMath();
    }

    private INFOS: Info[] = [
        {
            description: this.translate.instant('WRITE_SUPERSCRIPT'),
            symbol: '^',
            example: 'Al^{3+}',
            result: '$Al^{3+}$'
        },
        {
            description: this.translate.instant('WRITE_SUBSCRIPT'),
            symbol: '_',
            example: 'H_2',
            result: '$H_2$'
        },
        {
            description: this.translate.instant('WRITE_CENTER_DOT'),
            symbol: '\\cdot',
            example: '1,2\\cdotN_A',
            result: '$1,2 \\cdot N_A$'
        },
        {
            description: this.translate.instant('WRITE_DEGREE_SIGN'),
            symbol: '^{\\circ}',
            example: '20^{\\circ}C',
            result: '$20^{\\circ}C$'
        },
        {
            description: this.translate.instant('WRITE_SIGMA'),
            symbol: '\\sigma',
            example: '\\sigma',
            result: '$\\sigma$'
        },
        {
            description: this.translate.instant('WRITE_PI'),
            symbol: '\\pi',
            example: '\\pi',
            result: '$\\pi$'
        },
        {
            description: this.translate.instant('WRITE_RIGHT_ARROW'),
            symbol: '\\rightarrow',
            example: 'Ca \\rightarrow CaCl_2',
            result: '$Ca \\rightarrow CaCl_2$'
        },
        {
            description: this.translate.instant('WRITE_RIGHT_ARROW_WITH'),
            symbol: '\\xrightarrow{so\'z}',
            example: 'Ca \\xrightarrow{+Cl_2} CaCl_2',
            result: '$Ca \\xrightarrow{+Cl_2} CaCl_2$'
        },
        {
            description: this.translate.instant('WRITE_LEFT_ARROW'),
            symbol: '\\leftarrow',
            example: 'Ca \\leftarrow CaCl_2',
            result: '$Ca \\leftarrow CaCl_2$'
        },
        {
            description: this.translate.instant('WRITE_LEFT_ARROW_WITH'),
            symbol: '\\xleftarrow{so\'z}',
            example: 'Ca \\xleftarrow{t\\circ} CaCl_2',
            result: '$Ca \\xleftarrow{t^{\\circ}} CaCl_2$'
        },
        {
            description: this.translate.instant('WRITE_DOUBLE_ARROW'),
            symbol: '\\rightleftarrows',
            example: 'Ca \\rightleftarrows CaCl_2',
            result: '$Ca \\rightleftarrows CaCl_2$'
        },
    ];

    displayedColumns: string[] = ['description', 'symbol', 'example', 'result'];
    dataSource = this.INFOS;
}

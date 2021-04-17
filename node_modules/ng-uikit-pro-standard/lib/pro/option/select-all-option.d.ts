import { OnInit, ElementRef, ChangeDetectorRef } from '@angular/core';
import { MdbOptionGroup, OptionComponent, MdbOptionParent } from './option.component';
export declare class SelectAllOptionComponent extends OptionComponent implements OnInit {
    _multiple: boolean;
    constructor(_el: ElementRef, _cdRef: ChangeDetectorRef, _parent: MdbOptionParent, group: MdbOptionGroup);
    option: boolean;
    ngOnInit(): void;
}
//# sourceMappingURL=select-all-option.d.ts.map
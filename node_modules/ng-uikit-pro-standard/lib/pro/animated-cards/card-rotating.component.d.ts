import { EventEmitter, ChangeDetectorRef } from '@angular/core';
export declare class CardRotatingComponent {
    private _cdRef;
    rotate: boolean;
    ANIMATION_TRANSITION_TIME: number;
    animationStart: EventEmitter<any>;
    animationEnd: EventEmitter<any>;
    constructor(_cdRef: ChangeDetectorRef);
    toggle(): void;
}
//# sourceMappingURL=card-rotating.component.d.ts.map
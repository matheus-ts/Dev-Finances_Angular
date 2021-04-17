import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Component, ViewChild, ElementRef, Renderer2, Input, HostListener, forwardRef, Output, EventEmitter, ChangeDetectorRef, ViewEncapsulation, ChangeDetectionStrategy, } from '@angular/core';
export const RANGE_VALUE_ACCESOR = {
    provide: NG_VALUE_ACCESSOR,
    // tslint:disable-next-line: no-use-before-declare
    useExisting: forwardRef(() => MdbRangeInputComponent),
    multi: true,
};
export class MdbRangeInputComponent {
    // @HostListener('mousedown') onclick() {
    //   this.focusRangeInput();
    // }
    // @HostListener('touchstart') onTouchStart() {
    //   this.focusRangeInput();
    // }
    // @HostListener('mouseup') onmouseup() {
    //   this.blurRangeInput();
    // }
    constructor(renderer, cdRef) {
        this.renderer = renderer;
        this.cdRef = cdRef;
        this.min = 0;
        this.max = 100;
        this.rangeValueChange = new EventEmitter();
        this.range = 0;
        this.cloudRange = 0;
        this.visibility = false;
        // Control Value Accessor Methods
        this.onChange = (_) => { };
        this.onTouched = () => { };
    }
    onchange(event) {
        this.onChange(event.target.value);
    }
    oninput(event) {
        const value = +event.target.value;
        this.rangeValueChange.emit({ value: value });
        this.focusRangeInput();
        if (this.checkIfSafari()) {
            this.focusRangeInput();
        }
    }
    focusRangeInput() {
        // this.input.nativeElement.focus();
        this.visibility = true;
    }
    blurRangeInput() {
        this.input.nativeElement.blur();
        this.visibility = false;
    }
    coverage(event, value) {
        if (typeof this.range === 'string' && this.range.length !== 0) {
            return this.range;
        }
        if (!this.default) {
            // if `coverage()` is called by (input) event take value as event.target.value. If it's called manually, take value from parameter.
            // This is needed in situation, when slider value is set by default or ReactiveForms, and value clound is not moved to proper position
            const newValue = event.target ? event.target.value : value;
            const newRelativeGain = newValue - this.min;
            const inputWidth = this.input.nativeElement.offsetWidth;
            let thumbOffset;
            const offsetAmmount = 15;
            const distanceFromMiddle = newRelativeGain - this.steps / 2;
            this.stepLength = inputWidth / this.steps;
            thumbOffset = (distanceFromMiddle / this.steps) * offsetAmmount;
            this.cloudRange = this.stepLength * newRelativeGain - thumbOffset;
            this.renderer.setStyle(this.rangeCloud.nativeElement, 'left', this.cloudRange + 'px');
        }
    }
    checkIfSafari() {
        const isSafari = navigator.userAgent.indexOf('Safari') > -1;
        const isChrome = navigator.userAgent.indexOf('Chrome') > -1;
        const isFirefox = navigator.userAgent.indexOf('Firefox') > -1;
        const isOpera = navigator.userAgent.indexOf('Opera') > -1;
        if (isSafari && !isChrome && !isFirefox && !isOpera) {
            return true;
        }
        else {
            return false;
        }
    }
    ngAfterViewInit() {
        this.steps = this.max - this.min;
        if (this.value) {
            this.range = Number(this.value);
            // fix(slider): resolve problem with not moving slider cloud when setting value with [value] or reactive forms
            // Manual call the coverage method to move range value cloud to proper position based on the `value` variable
            this.coverage(new Event('input'), this.value);
            this.cdRef.detectChanges();
        }
    }
    writeValue(value) {
        this.value = value;
        this.range = Number(this.value);
        this.cdRef.markForCheck();
        // fix(slider): resolve problem with not moving slider cloud when setting value with [value] or reactive forms
        // Manual call the coverage method to move range value cloud to proper position based on the `value` variable
        setTimeout(() => {
            this.coverage(new Event('input'), value);
        }, 0);
    }
    registerOnChange(fn) {
        this.onChange = fn;
    }
    registerOnTouched(fn) {
        this.onTouched = fn;
    }
    setDisabledState(isDisabled) {
        this.disabled = isDisabled;
    }
}
MdbRangeInputComponent.decorators = [
    { type: Component, args: [{
                selector: 'mdb-range-input',
                template: "<div *ngIf=\"!default\" class=\"range-field\" #rangeField>\n  <div class=\"track\">\n    <div #rangeCloud class=\"range-cloud\" title=\"range\" [ngClass]=\"{ visible: this.visibility }\">\n      <span class=\"text-transform\">{{ range }}</span>\n    </div>\n  </div>\n  <input\n    #input\n    [name]=\"name\"\n    type=\"range\"\n    [disabled]=\"disabled\"\n    [id]=\"id\"\n    [min]=\"min\"\n    [max]=\"max\"\n    [step]=\"step\"\n    [value]=\"value\"\n    [(ngModel)]=\"range\"\n    (input)=\"coverage($event)\"\n    (mousedown)=\"focusRangeInput()\"\n    (mouseup)=\"blurRangeInput()\"\n    (touchstart)=\"focusRangeInput()\"\n    (touchend)=\"blurRangeInput()\"\n    (blur)=\"blurRangeInput()\"\n  />\n</div>\n\n<div *ngIf=\"default\">\n  <input\n    #input\n    class=\"custom-range\"\n    [name]=\"name\"\n    type=\"range\"\n    [id]=\"id\"\n    [min]=\"min\"\n    [max]=\"max\"\n    [step]=\"step\"\n    [attr.value]=\"value\"\n    [value]=\"value\"\n    [(ngModel)]=\"range\"\n    (input)=\"coverage($event)\"\n    (mousedown)=\"focusRangeInput()\"\n    (mouseup)=\"blurRangeInput()\"\n    (touchstart)=\"focusRangeInput()\"\n    (touchend)=\"blurRangeInput()\"\n    (blur)=\"blurRangeInput()\"\n  />\n  <span class=\"{{ defaultRangeCounterClass }}\">{{ range }}</span>\n</div>\n",
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                providers: [RANGE_VALUE_ACCESOR],
                styles: [".range-field input[type=range]{width:100%;height:1.5rem;padding:0;background-color:transparent;-webkit-appearance:none;-moz-appearance:none;appearance:none}.range-field input[type=range]:focus{outline:none}.range-field input[type=range]+.thumb{position:absolute;border:none;height:0;width:0;border-radius:50%;background-color:#4285f4;top:10px;margin-left:-6px;transform-origin:50% 50%;transform:rotate(-45deg)}.range-field input[type=range]+.thumb .value{display:block;width:30px;text-align:center;color:#4285f4;font-size:0;transform:rotate(45deg)}.range-field input[type=range]+.thumb.active{border-radius:50% 50% 50% 0}.range-field input[type=range]+.thumb.active .value{color:#fff;margin-left:-1px;margin-top:8px;font-size:10px}.range-field input[type=range]::-webkit-slider-runnable-track{height:3px;background:#c2c0c2;border:none}.range-field input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;border:none;height:14px;width:14px;border-radius:50%;background-color:#4285f4;transform-origin:50% 50%;margin:-5px 0 0;-webkit-transition:.3s;transition:.3s}.range-field input[type=range]:focus::-webkit-slider-runnable-track{background:#ccc}.range-field input[type=range]::-moz-range-track{height:3px;background:#c2c0c2;border:none}.range-field input[type=range]::-moz-range-thumb{border:none;height:14px;width:14px;border-radius:50%;background:#4285f4;margin-top:-5px;position:relative;-moz-appearance:none;appearance:none;outline:none}.range-field input[type=range]::-ms-track{height:3px;background:transparent;border-color:transparent;border-width:6px 0;color:transparent}.range-field input[type=range]::-ms-fill-lower,.range-field input[type=range]::-ms-fill-upper{background:#c2c0c2}.range-field input[type=range]::-ms-thumb{border:none;height:14px;width:14px;border-radius:50%;background:#4285f4}.range-field input[type=range]:focus::-ms-fill-lower,.range-field input[type=range]:focus::-ms-fill-upper{background:#c2c0c2}@supports (--css:variables){input[type=range].mdbMultiRange{padding:0;margin:0;display:inline-block;vertical-align:top;position:absolute;pointer-events:none}input[type=range].mdbMultiRange::-moz-range-thumb{pointer-events:all}input[type=range].mdbMultiRange::-webkit-slider-thumb{pointer-events:all}input[type=range].mdbMultiRange.original{position:absolute}input[type=range].mdbMultiRange.original::-webkit-slider-thumb{position:relative;z-index:2}input[type=range].mdbMultiRange.original::-moz-range-thumb{transform:scale(1);z-index:1}input[type=range].mdbMultiRange.ghost{position:relative}input[type=range].mdbMultiRange.ghost::-moz-range-track{background-color:transparent}}.multi-range-field{position:relative}.multi-range-field input[type=range]{width:100%;height:1.5rem;padding:0;background-color:transparent;-webkit-appearance:none;-moz-appearance:none;appearance:none}.multi-range-field input[type=range]:focus{outline:none}.multi-range-field input[type=range]+.thumb{position:absolute;border:none;height:0;width:0;border-radius:50%;background-color:#4285f4;top:10px;margin-left:-6px;transform-origin:50% 50%;transform:rotate(-45deg)}.multi-range-field input[type=range]+.thumb .value{display:block;width:30px;text-align:center;color:#4285f4;font-size:0;transform:rotate(45deg)}.multi-range-field input[type=range]+.thumb.active{border-radius:50% 50% 50% 0}.multi-range-field input[type=range]+.thumb.active .value{color:#fff;margin-left:-1px;margin-top:8px;font-size:10px}.multi-range-field input[type=range]::-webkit-slider-runnable-track{height:3px;background:#c2c0c2;border:none}.multi-range-field input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;border:none;height:14px;width:14px;border-radius:50%;background-color:#4285f4;transform-origin:50% 50%;margin:-5px 0 0;-webkit-transition:.3s;transition:.3s}.multi-range-field input[type=range]:focus::-webkit-slider-runnable-track{background:#ccc}.multi-range-field input[type=range]::-moz-range-track{height:3px;background:#c2c0c2;border:none}.multi-range-field input[type=range]::-moz-range-thumb{border:none;height:14px;width:14px;border-radius:50%;background:#4285f4;margin-top:-5px;position:relative;-moz-appearance:none;appearance:none;outline:none}.multi-range-field input[type=range]::-ms-track{height:3px;background:transparent;border-color:transparent;border-width:6px 0;color:transparent}.multi-range-field input[type=range]::-ms-fill-lower,.multi-range-field input[type=range]::-ms-fill-upper{background:#c2c0c2}.multi-range-field input[type=range]::-ms-thumb{border:none;height:14px;width:14px;border-radius:50%;background:#4285f4}.multi-range-field input[type=range]:focus::-ms-fill-lower,.multi-range-field input[type=range]:focus::-ms-fill-upper{background:#c2c0c2}.thumb-horizontal-wrapper{position:relative;transform:rotate(-270deg);top:500px}.multi-range-field input[type=range]+.thumb-horizontal .value{transform:rotate(315deg)!important}.range-field:focus{box-shadow:none}.range-field:focus::-webkit-slider-thumb{box-shadow:none}.range-field:focus::-moz-range-thumb{box-shadow:none}.range-field:focus::-ms-thumb{box-shadow:none}.range-field::-moz-focus-outer{border:0}.range-field::-webkit-slider-thumb{margin-top:-6px;box-shadow:none;-webkit-appearance:none;appearance:none}.range-field::-webkit-slider-runnable-track{height:4px;border-radius:0}.range-field::-moz-range-thumb{box-shadow:none;-moz-appearance:none;appearance:none}.range-field{position:relative}.range-field .track{position:absolute}.range-field .track .range-cloud{position:absolute;display:block;height:30px;width:30px;top:-32px;margin-left:-15px;text-align:center;border-radius:50% 50% 50% 0;transform:scale(0);transform-origin:bottom;transition:transform .2s ease-in-out}.range-field .track .range-cloud:after{position:absolute;display:block;content:\"\";transform:translateX(-50%);width:100%;height:100%;top:0;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:#1266f1;z-index:-1}.range-field .track .range-cloud.visible{transform:scale(1)}.range-field .track .range-cloud .text-transform{display:block;font-size:12px;line-height:30px;color:#fff;z-index:2}"]
            },] }
];
MdbRangeInputComponent.ctorParameters = () => [
    { type: Renderer2 },
    { type: ChangeDetectorRef }
];
MdbRangeInputComponent.propDecorators = {
    input: [{ type: ViewChild, args: ['input',] }],
    rangeCloud: [{ type: ViewChild, args: ['rangeCloud',] }],
    rangeField: [{ type: ViewChild, args: ['rangeField',] }],
    id: [{ type: Input }],
    required: [{ type: Input }],
    name: [{ type: Input }],
    value: [{ type: Input }],
    disabled: [{ type: Input }],
    min: [{ type: Input }],
    max: [{ type: Input }],
    step: [{ type: Input }],
    default: [{ type: Input }],
    defaultRangeCounterClass: [{ type: Input }],
    rangeValueChange: [{ type: Output }],
    onchange: [{ type: HostListener, args: ['change', ['$event'],] }],
    oninput: [{ type: HostListener, args: ['input', ['$event'],] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWRiLXJhbmdlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25nLXVpa2l0LXByby1zdGFuZGFyZC9zcmMvbGliL3Byby9yYW5nZS9tZGItcmFuZ2UuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBd0IsaUJBQWlCLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUN6RSxPQUFPLEVBQ0wsU0FBUyxFQUNULFNBQVMsRUFDVCxVQUFVLEVBQ1YsU0FBUyxFQUNULEtBQUssRUFDTCxZQUFZLEVBQ1osVUFBVSxFQUVWLE1BQU0sRUFDTixZQUFZLEVBQ1osaUJBQWlCLEVBQ2pCLGlCQUFpQixFQUNqQix1QkFBdUIsR0FDeEIsTUFBTSxlQUFlLENBQUM7QUFFdkIsTUFBTSxDQUFDLE1BQU0sbUJBQW1CLEdBQVE7SUFDdEMsT0FBTyxFQUFFLGlCQUFpQjtJQUMxQixrREFBa0Q7SUFDbEQsV0FBVyxFQUFFLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxzQkFBc0IsQ0FBQztJQUNyRCxLQUFLLEVBQUUsSUFBSTtDQUNaLENBQUM7QUFVRixNQUFNLE9BQU8sc0JBQXNCO0lBcUNqQyx5Q0FBeUM7SUFDekMsNEJBQTRCO0lBQzVCLElBQUk7SUFFSiwrQ0FBK0M7SUFDL0MsNEJBQTRCO0lBQzVCLElBQUk7SUFFSix5Q0FBeUM7SUFDekMsMkJBQTJCO0lBQzNCLElBQUk7SUFFSixZQUFvQixRQUFtQixFQUFVLEtBQXdCO1FBQXJELGFBQVEsR0FBUixRQUFRLENBQVc7UUFBVSxVQUFLLEdBQUwsS0FBSyxDQUFtQjtRQXZDaEUsUUFBRyxHQUFHLENBQUMsQ0FBQztRQUNSLFFBQUcsR0FBRyxHQUFHLENBQUM7UUFLVCxxQkFBZ0IsR0FBRyxJQUFJLFlBQVksRUFBTyxDQUFDO1FBRXJELFVBQUssR0FBUSxDQUFDLENBQUM7UUFHZixlQUFVLEdBQUcsQ0FBQyxDQUFDO1FB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LEVBQUUsQ0FBQztJQUNyQixDQUFDO0lBRUQsaUJBQWlCLENBQUMsRUFBYztRQUM5QixJQUFJLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztJQUN0QixDQUFDO0lBRUQsZ0JBQWdCLENBQUMsVUFBbUI7UUFDbEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxVQUFVLENBQUM7SUFDN0IsQ0FBQzs7O1lBbkpGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsaUJBQWlCO2dCQUMzQix5eENBQXlDO2dCQUV6QyxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtnQkFDckMsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07Z0JBQy9DLFNBQVMsRUFBRSxDQUFDLG1CQUFtQixDQUFDOzthQUNqQzs7O1lBMUJDLFNBQVM7WUFPVCxpQkFBaUI7OztvQkFxQmhCLFNBQVMsU0FBQyxPQUFPO3lCQUNqQixTQUFTLFNBQUMsWUFBWTt5QkFDdEIsU0FBUyxTQUFDLFlBQVk7aUJBRXRCLEtBQUs7dUJBQ0wsS0FBSzttQkFDTCxLQUFLO29CQUNMLEtBQUs7dUJBQ0wsS0FBSztrQkFDTCxLQUFLO2tCQUNMLEtBQUs7bUJBQ0wsS0FBSztzQkFDTCxLQUFLO3VDQUNMLEtBQUs7K0JBRUwsTUFBTTt1QkFRTixZQUFZLFNBQUMsUUFBUSxFQUFFLENBQUMsUUFBUSxDQUFDO3NCQUlqQyxZQUFZLFNBQUMsT0FBTyxFQUFFLENBQUMsUUFBUSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29udHJvbFZhbHVlQWNjZXNzb3IsIE5HX1ZBTFVFX0FDQ0VTU09SIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBWaWV3Q2hpbGQsXG4gIEVsZW1lbnRSZWYsXG4gIFJlbmRlcmVyMixcbiAgSW5wdXQsXG4gIEhvc3RMaXN0ZW5lcixcbiAgZm9yd2FyZFJlZixcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgT3V0cHV0LFxuICBFdmVudEVtaXR0ZXIsXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5leHBvcnQgY29uc3QgUkFOR0VfVkFMVUVfQUNDRVNPUjogYW55ID0ge1xuICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBuby11c2UtYmVmb3JlLWRlY2xhcmVcbiAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTWRiUmFuZ2VJbnB1dENvbXBvbmVudCksXG4gIG11bHRpOiB0cnVlLFxufTtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWRiLXJhbmdlLWlucHV0JyxcbiAgdGVtcGxhdGVVcmw6ICcuL21kYi1yYW5nZS5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL3JhbmdlLW1vZHVsZS5zY3NzJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBwcm92aWRlcnM6IFtSQU5HRV9WQUxVRV9BQ0NFU09SXSxcbn0pXG5leHBvcnQgY2xhc3MgTWRiUmFuZ2VJbnB1dENvbXBvbmVudCBpbXBsZW1lbnRzIENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBBZnRlclZpZXdJbml0IHtcbiAgQFZpZXdDaGlsZCgnaW5wdXQnKSBpbnB1dDogRWxlbWVudFJlZjtcbiAgQFZpZXdDaGlsZCgncmFuZ2VDbG91ZCcpIHJhbmdlQ2xvdWQ6IEVsZW1lbnRSZWY7XG4gIEBWaWV3Q2hpbGQoJ3JhbmdlRmllbGQnKSByYW5nZUZpZWxkOiBFbGVtZW50UmVmO1xuXG4gIEBJbnB1dCgpIGlkOiBzdHJpbmc7XG4gIEBJbnB1dCgpIHJlcXVpcmVkOiBib29sZWFuO1xuICBASW5wdXQoKSBuYW1lOiBzdHJpbmc7XG4gIEBJbnB1dCgpIHZhbHVlOiBzdHJpbmc7XG4gIEBJbnB1dCgpIGRpc2FibGVkOiBib29sZWFuO1xuICBASW5wdXQoKSBtaW4gPSAwO1xuICBASW5wdXQoKSBtYXggPSAxMDA7XG4gIEBJbnB1dCgpIHN0ZXA6IG51bWJlcjtcbiAgQElucHV0KCkgZGVmYXVsdDogYm9vbGVhbjtcbiAgQElucHV0KCkgZGVmYXVsdFJhbmdlQ291bnRlckNsYXNzOiBzdHJpbmc7XG5cbiAgQE91dHB1dCgpIHJhbmdlVmFsdWVDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICByYW5nZTogYW55ID0gMDtcbiAgc3RlcExlbmd0aDogbnVtYmVyO1xuICBzdGVwczogbnVtYmVyO1xuICBjbG91ZFJhbmdlID0gMDtcbiAgdmlzaWJpbGl0eSA9IGZhbHNlO1xuXG4gIEBIb3N0TGlzdGVuZXIoJ2NoYW5nZScsIFsnJGV2ZW50J10pIG9uY2hhbmdlKGV2ZW50OiBhbnkpIHtcbiAgICB0aGlzLm9uQ2hhbmdlKGV2ZW50LnRhcmdldC52YWx1ZSk7XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdpbnB1dCcsIFsnJGV2ZW50J10pIG9uaW5wdXQoZXZlbnQ6IGFueSkge1xuICAgIGNvbnN0IHZhbHVlOiBudW1iZXIgPSArZXZlbnQudGFyZ2V0LnZhbHVlO1xuICAgIHRoaXMucmFuZ2VWYWx1ZUNoYW5nZS5lbWl0KHsgdmFsdWU6IHZhbHVlIH0pO1xuICAgIHRoaXMuZm9jdXNSYW5nZUlucHV0KCk7XG4gICAgaWYgKHRoaXMuY2hlY2tJZlNhZmFyaSgpKSB7XG4gICAgICB0aGlzLmZvY3VzUmFuZ2VJbnB1dCgpO1xuICAgIH1cbiAgfVxuXG4gIC8vIEBIb3N0TGlzdGVuZXIoJ21vdXNlZG93bicpIG9uY2xpY2soKSB7XG4gIC8vICAgdGhpcy5mb2N1c1JhbmdlSW5wdXQoKTtcbiAgLy8gfVxuXG4gIC8vIEBIb3N0TGlzdGVuZXIoJ3RvdWNoc3RhcnQnKSBvblRvdWNoU3RhcnQoKSB7XG4gIC8vICAgdGhpcy5mb2N1c1JhbmdlSW5wdXQoKTtcbiAgLy8gfVxuXG4gIC8vIEBIb3N0TGlzdGVuZXIoJ21vdXNldXAnKSBvbm1vdXNldXAoKSB7XG4gIC8vICAgdGhpcy5ibHVyUmFuZ2VJbnB1dCgpO1xuICAvLyB9XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyLCBwcml2YXRlIGNkUmVmOiBDaGFuZ2VEZXRlY3RvclJlZikge31cblxuICBmb2N1c1JhbmdlSW5wdXQoKSB7XG4gICAgLy8gdGhpcy5pbnB1dC5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XG4gICAgdGhpcy52aXNpYmlsaXR5ID0gdHJ1ZTtcbiAgfVxuXG4gIGJsdXJSYW5nZUlucHV0KCkge1xuICAgIHRoaXMuaW5wdXQubmF0aXZlRWxlbWVudC5ibHVyKCk7XG4gICAgdGhpcy52aXNpYmlsaXR5ID0gZmFsc2U7XG4gIH1cblxuICBjb3ZlcmFnZShldmVudDogYW55LCB2YWx1ZT86IGFueSkge1xuICAgIGlmICh0eXBlb2YgdGhpcy5yYW5nZSA9PT0gJ3N0cmluZycgJiYgdGhpcy5yYW5nZS5sZW5ndGggIT09IDApIHtcbiAgICAgIHJldHVybiB0aGlzLnJhbmdlO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5kZWZhdWx0KSB7XG4gICAgICAvLyBpZiBgY292ZXJhZ2UoKWAgaXMgY2FsbGVkIGJ5IChpbnB1dCkgZXZlbnQgdGFrZSB2YWx1ZSBhcyBldmVudC50YXJnZXQudmFsdWUuIElmIGl0J3MgY2FsbGVkIG1hbnVhbGx5LCB0YWtlIHZhbHVlIGZyb20gcGFyYW1ldGVyLlxuICAgICAgLy8gVGhpcyBpcyBuZWVkZWQgaW4gc2l0dWF0aW9uLCB3aGVuIHNsaWRlciB2YWx1ZSBpcyBzZXQgYnkgZGVmYXVsdCBvciBSZWFjdGl2ZUZvcm1zLCBhbmQgdmFsdWUgY2xvdW5kIGlzIG5vdCBtb3ZlZCB0byBwcm9wZXIgcG9zaXRpb25cbiAgICAgIGNvbnN0IG5ld1ZhbHVlID0gZXZlbnQudGFyZ2V0ID8gZXZlbnQudGFyZ2V0LnZhbHVlIDogdmFsdWU7XG4gICAgICBjb25zdCBuZXdSZWxhdGl2ZUdhaW4gPSBuZXdWYWx1ZSAtIHRoaXMubWluO1xuICAgICAgY29uc3QgaW5wdXRXaWR0aCA9IHRoaXMuaW5wdXQubmF0aXZlRWxlbWVudC5vZmZzZXRXaWR0aDtcblxuICAgICAgbGV0IHRodW1iT2Zmc2V0OiBudW1iZXI7XG4gICAgICBjb25zdCBvZmZzZXRBbW1vdW50ID0gMTU7XG4gICAgICBjb25zdCBkaXN0YW5jZUZyb21NaWRkbGUgPSBuZXdSZWxhdGl2ZUdhaW4gLSB0aGlzLnN0ZXBzIC8gMjtcblxuICAgICAgdGhpcy5zdGVwTGVuZ3RoID0gaW5wdXRXaWR0aCAvIHRoaXMuc3RlcHM7XG5cbiAgICAgIHRodW1iT2Zmc2V0ID0gKGRpc3RhbmNlRnJvbU1pZGRsZSAvIHRoaXMuc3RlcHMpICogb2Zmc2V0QW1tb3VudDtcbiAgICAgIHRoaXMuY2xvdWRSYW5nZSA9IHRoaXMuc3RlcExlbmd0aCAqIG5ld1JlbGF0aXZlR2FpbiAtIHRodW1iT2Zmc2V0O1xuXG4gICAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMucmFuZ2VDbG91ZC5uYXRpdmVFbGVtZW50LCAnbGVmdCcsIHRoaXMuY2xvdWRSYW5nZSArICdweCcpO1xuICAgIH1cbiAgfVxuXG4gIGNoZWNrSWZTYWZhcmkoKSB7XG4gICAgY29uc3QgaXNTYWZhcmkgPSBuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoJ1NhZmFyaScpID4gLTE7XG4gICAgY29uc3QgaXNDaHJvbWUgPSBuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoJ0Nocm9tZScpID4gLTE7XG4gICAgY29uc3QgaXNGaXJlZm94ID0gbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKCdGaXJlZm94JykgPiAtMTtcbiAgICBjb25zdCBpc09wZXJhID0gbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKCdPcGVyYScpID4gLTE7XG5cbiAgICBpZiAoaXNTYWZhcmkgJiYgIWlzQ2hyb21lICYmICFpc0ZpcmVmb3ggJiYgIWlzT3BlcmEpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIHRoaXMuc3RlcHMgPSB0aGlzLm1heCAtIHRoaXMubWluO1xuXG4gICAgaWYgKHRoaXMudmFsdWUpIHtcbiAgICAgIHRoaXMucmFuZ2UgPSBOdW1iZXIodGhpcy52YWx1ZSk7XG5cbiAgICAgIC8vIGZpeChzbGlkZXIpOiByZXNvbHZlIHByb2JsZW0gd2l0aCBub3QgbW92aW5nIHNsaWRlciBjbG91ZCB3aGVuIHNldHRpbmcgdmFsdWUgd2l0aCBbdmFsdWVdIG9yIHJlYWN0aXZlIGZvcm1zXG4gICAgICAvLyBNYW51YWwgY2FsbCB0aGUgY292ZXJhZ2UgbWV0aG9kIHRvIG1vdmUgcmFuZ2UgdmFsdWUgY2xvdWQgdG8gcHJvcGVyIHBvc2l0aW9uIGJhc2VkIG9uIHRoZSBgdmFsdWVgIHZhcmlhYmxlXG4gICAgICB0aGlzLmNvdmVyYWdlKG5ldyBFdmVudCgnaW5wdXQnKSwgdGhpcy52YWx1ZSk7XG5cbiAgICAgIHRoaXMuY2RSZWYuZGV0ZWN0Q2hhbmdlcygpO1xuICAgIH1cbiAgfVxuXG4gIC8vIENvbnRyb2wgVmFsdWUgQWNjZXNzb3IgTWV0aG9kc1xuICBvbkNoYW5nZSA9IChfOiBhbnkpID0+IHt9O1xuICBvblRvdWNoZWQgPSAoKSA9PiB7fTtcblxuICB3cml0ZVZhbHVlKHZhbHVlOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgdGhpcy5yYW5nZSA9IE51bWJlcih0aGlzLnZhbHVlKTtcbiAgICB0aGlzLmNkUmVmLm1hcmtGb3JDaGVjaygpO1xuXG4gICAgLy8gZml4KHNsaWRlcik6IHJlc29sdmUgcHJvYmxlbSB3aXRoIG5vdCBtb3Zpbmcgc2xpZGVyIGNsb3VkIHdoZW4gc2V0dGluZyB2YWx1ZSB3aXRoIFt2YWx1ZV0gb3IgcmVhY3RpdmUgZm9ybXNcbiAgICAvLyBNYW51YWwgY2FsbCB0aGUgY292ZXJhZ2UgbWV0aG9kIHRvIG1vdmUgcmFuZ2UgdmFsdWUgY2xvdWQgdG8gcHJvcGVyIHBvc2l0aW9uIGJhc2VkIG9uIHRoZSBgdmFsdWVgIHZhcmlhYmxlXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLmNvdmVyYWdlKG5ldyBFdmVudCgnaW5wdXQnKSwgdmFsdWUpO1xuICAgIH0sIDApO1xuICB9XG5cbiAgcmVnaXN0ZXJPbkNoYW5nZShmbjogKF86IGFueSkgPT4gdm9pZCk6IHZvaWQge1xuICAgIHRoaXMub25DaGFuZ2UgPSBmbjtcbiAgfVxuXG4gIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiAoKSA9PiB2b2lkKTogdm9pZCB7XG4gICAgdGhpcy5vblRvdWNoZWQgPSBmbjtcbiAgfVxuXG4gIHNldERpc2FibGVkU3RhdGUoaXNEaXNhYmxlZDogYm9vbGVhbikge1xuICAgIHRoaXMuZGlzYWJsZWQgPSBpc0Rpc2FibGVkO1xuICB9XG59XG4iXX0=
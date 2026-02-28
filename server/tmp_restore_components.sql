BEGIN;
TRUNCATE component_files, components RESTART IDENTITY CASCADE;
INSERT INTO components (framework, component, version, author_name, component_number) VALUES ('angular', 'confirm-dialog', '1.0.0', 'Darrell', 'CMP-A201');
INSERT INTO component_files (component_id, filename, content) VALUES ((SELECT id FROM components WHERE framework='angular' AND component='confirm-dialog'), 'confirm-dialog.component.css', $q$.confirm-dialog {
  position: fixed;
  inset: 0;
  z-index: 1200;
  display: grid;
  place-items: center;
  background: rgba(0, 0, 0, 0.45);
  padding: 1rem;
}

.confirm-dialog__panel {
  width: min(100%, 30rem);
  background: #fff;
  border-radius: 0.75rem;
  padding: 1rem;
  box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.2);
}

.confirm-dialog__header h2 {
  margin: 0;
}

.confirm-dialog__message {
  margin: 0.9rem 0;
  color: #334155;
}

.confirm-dialog__actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.confirm-dialog__cancel, .confirm-dialog__confirm {
  border: 1px solid #cbd5e1;
  background: #fff;
  border-radius: 0.45rem;
  padding: 0.45rem 0.7rem;
  cursor: pointer;
}

.confirm-dialog__confirm {
  background: #1d4ed8;
  border-color: #1d4ed8;
  color: #fff;
}
$q$);
INSERT INTO component_files (component_id, filename, content) VALUES ((SELECT id FROM components WHERE framework='angular' AND component='confirm-dialog'), 'confirm-dialog.component.html', $q$<!-- angular/confirm-dialog | version: 1.0.0 | author: Darrell | number: CMP-A201 -->
<section *ngIf="open" class="confirm-dialog" (mousedown)="onBackdropClick($event)">
  <article class="confirm-dialog__panel" role="dialog" aria-modal="true" [attr.aria-label]="title">
    <header class="confirm-dialog__header"><h2>{{ title }}</h2></header>
    <p class="confirm-dialog__message">{{ message }}</p>
    <footer class="confirm-dialog__actions">
      <button type="button" class="confirm-dialog__cancel" (click)="onCancel()">{{ cancelLabel }}</button>
      <button type="button" class="confirm-dialog__confirm" (click)="onConfirm()">{{ confirmLabel }}</button>
    </footer>
  </article>
</section>
$q$);
INSERT INTO component_files (component_id, filename, content) VALUES ((SELECT id FROM components WHERE framework='angular' AND component='confirm-dialog'), 'confirm-dialog.component.scss', $q$.confirm-dialog {
  position: fixed;
  inset: 0;
  z-index: 1200;
  display: grid;
  place-items: center;
  background: rgba(0, 0, 0, 0.45);
  padding: 1rem;
}
.confirm-dialog__panel {
  width: min(100%, 30rem);
  background: #fff;
  border-radius: 0.75rem;
  padding: 1rem;
  box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.2);
}
.confirm-dialog__header h2 { margin: 0; }
.confirm-dialog__message { margin: 0.9rem 0; color: #334155; }
.confirm-dialog__actions { display: flex; justify-content: flex-end; gap: 0.5rem; }
.confirm-dialog__cancel, .confirm-dialog__confirm {
  border: 1px solid #cbd5e1;
  background: #fff;
  border-radius: 0.45rem;
  padding: 0.45rem 0.7rem;
  cursor: pointer;
}
.confirm-dialog__confirm { background: #1d4ed8; border-color: #1d4ed8; color: #fff; }
$q$);
INSERT INTO component_files (component_id, filename, content) VALUES ((SELECT id FROM components WHERE framework='angular' AND component='confirm-dialog'), 'confirm-dialog.component.spec.js', $q$var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
System.register("confirm-dialog.component", ["@angular/common", "@angular/core"], function (exports_1, context_1) {
    "use strict";
    var common_1, core_1, ConfirmDialogComponent;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            }
        ],
        execute: function () {
            ConfirmDialogComponent = (() => {
                let _classDecorators = [core_1.Component({
                        selector: "app-confirm-dialog",
                        standalone: true,
                        imports: [common_1.CommonModule],
                        templateUrl: "./confirm-dialog.component.html",
                        styleUrl: "./confirm-dialog.component.scss"
                    })];
                let _classDescriptor;
                let _classExtraInitializers = [];
                let _classThis;
                let _instanceExtraInitializers = [];
                let _open_decorators;
                let _open_initializers = [];
                let _open_extraInitializers = [];
                let _title_decorators;
                let _title_initializers = [];
                let _title_extraInitializers = [];
                let _message_decorators;
                let _message_initializers = [];
                let _message_extraInitializers = [];
                let _confirmLabel_decorators;
                let _confirmLabel_initializers = [];
                let _confirmLabel_extraInitializers = [];
                let _cancelLabel_decorators;
                let _cancelLabel_initializers = [];
                let _cancelLabel_extraInitializers = [];
                let _closeOnBackdrop_decorators;
                let _closeOnBackdrop_initializers = [];
                let _closeOnBackdrop_extraInitializers = [];
                let _confirmed_decorators;
                let _confirmed_initializers = [];
                let _confirmed_extraInitializers = [];
                let _cancelled_decorators;
                let _cancelled_initializers = [];
                let _cancelled_extraInitializers = [];
                let _onEscape_decorators;
                var ConfirmDialogComponent = _classThis = class {
                    onEscape() {
                        if (this.open)
                            this.cancelled.emit();
                    }
                    onBackdropClick(event) {
                        if (!this.closeOnBackdrop)
                            return;
                        if (event.target === event.currentTarget)
                            this.cancelled.emit();
                    }
                    onConfirm() {
                        this.confirmed.emit();
                    }
                    onCancel() {
                        this.cancelled.emit();
                    }
                    constructor() {
                        this.open = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _open_initializers, false));
                        this.title = (__runInitializers(this, _open_extraInitializers), __runInitializers(this, _title_initializers, "Confirm action"));
                        this.message = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _message_initializers, "Are you sure you want to continue?"));
                        this.confirmLabel = (__runInitializers(this, _message_extraInitializers), __runInitializers(this, _confirmLabel_initializers, "Confirm"));
                        this.cancelLabel = (__runInitializers(this, _confirmLabel_extraInitializers), __runInitializers(this, _cancelLabel_initializers, "Cancel"));
                        this.closeOnBackdrop = (__runInitializers(this, _cancelLabel_extraInitializers), __runInitializers(this, _closeOnBackdrop_initializers, true));
                        this.confirmed = (__runInitializers(this, _closeOnBackdrop_extraInitializers), __runInitializers(this, _confirmed_initializers, new core_1.EventEmitter()));
                        this.cancelled = (__runInitializers(this, _confirmed_extraInitializers), __runInitializers(this, _cancelled_initializers, new core_1.EventEmitter()));
                        __runInitializers(this, _cancelled_extraInitializers);
                    }
                };
                __setFunctionName(_classThis, "ConfirmDialogComponent");
                (() => {
                    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                    _open_decorators = [core_1.Input()];
                    _title_decorators = [core_1.Input()];
                    _message_decorators = [core_1.Input()];
                    _confirmLabel_decorators = [core_1.Input()];
                    _cancelLabel_decorators = [core_1.Input()];
                    _closeOnBackdrop_decorators = [core_1.Input()];
                    _confirmed_decorators = [core_1.Output()];
                    _cancelled_decorators = [core_1.Output()];
                    _onEscape_decorators = [core_1.HostListener("window:keydown.escape")];
                    __esDecorate(_classThis, null, _onEscape_decorators, { kind: "method", name: "onEscape", static: false, private: false, access: { has: obj => "onEscape" in obj, get: obj => obj.onEscape }, metadata: _metadata }, null, _instanceExtraInitializers);
                    __esDecorate(null, null, _open_decorators, { kind: "field", name: "open", static: false, private: false, access: { has: obj => "open" in obj, get: obj => obj.open, set: (obj, value) => { obj.open = value; } }, metadata: _metadata }, _open_initializers, _open_extraInitializers);
                    __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
                    __esDecorate(null, null, _message_decorators, { kind: "field", name: "message", static: false, private: false, access: { has: obj => "message" in obj, get: obj => obj.message, set: (obj, value) => { obj.message = value; } }, metadata: _metadata }, _message_initializers, _message_extraInitializers);
                    __esDecorate(null, null, _confirmLabel_decorators, { kind: "field", name: "confirmLabel", static: false, private: false, access: { has: obj => "confirmLabel" in obj, get: obj => obj.confirmLabel, set: (obj, value) => { obj.confirmLabel = value; } }, metadata: _metadata }, _confirmLabel_initializers, _confirmLabel_extraInitializers);
                    __esDecorate(null, null, _cancelLabel_decorators, { kind: "field", name: "cancelLabel", static: false, private: false, access: { has: obj => "cancelLabel" in obj, get: obj => obj.cancelLabel, set: (obj, value) => { obj.cancelLabel = value; } }, metadata: _metadata }, _cancelLabel_initializers, _cancelLabel_extraInitializers);
                    __esDecorate(null, null, _closeOnBackdrop_decorators, { kind: "field", name: "closeOnBackdrop", static: false, private: false, access: { has: obj => "closeOnBackdrop" in obj, get: obj => obj.closeOnBackdrop, set: (obj, value) => { obj.closeOnBackdrop = value; } }, metadata: _metadata }, _closeOnBackdrop_initializers, _closeOnBackdrop_extraInitializers);
                    __esDecorate(null, null, _confirmed_decorators, { kind: "field", name: "confirmed", static: false, private: false, access: { has: obj => "confirmed" in obj, get: obj => obj.confirmed, set: (obj, value) => { obj.confirmed = value; } }, metadata: _metadata }, _confirmed_initializers, _confirmed_extraInitializers);
                    __esDecorate(null, null, _cancelled_decorators, { kind: "field", name: "cancelled", static: false, private: false, access: { has: obj => "cancelled" in obj, get: obj => obj.cancelled, set: (obj, value) => { obj.cancelled = value; } }, metadata: _metadata }, _cancelled_initializers, _cancelled_extraInitializers);
                    __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                    ConfirmDialogComponent = _classThis = _classDescriptor.value;
                    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                    __runInitializers(_classThis, _classExtraInitializers);
                })();
                return ConfirmDialogComponent = _classThis;
            })();
            exports_1("ConfirmDialogComponent", ConfirmDialogComponent);
        }
    };
});
System.register("confirm-dialog.component.spec", ["@angular/core/testing", "confirm-dialog.component"], function (exports_2, context_2) {
    "use strict";
    var testing_1, confirm_dialog_component_1;
    var __moduleName = context_2 && context_2.id;
    return {
        setters: [
            function (testing_1_1) {
                testing_1 = testing_1_1;
            },
            function (confirm_dialog_component_1_1) {
                confirm_dialog_component_1 = confirm_dialog_component_1_1;
            }
        ],
        execute: function () {
            describe("ConfirmDialogComponent", () => {
                let component;
                let fixture;
                beforeEach(async () => {
                    await testing_1.TestBed.configureTestingModule({
                        imports: [confirm_dialog_component_1.ConfirmDialogComponent]
                    }).compileComponents();
                    fixture = testing_1.TestBed.createComponent(confirm_dialog_component_1.ConfirmDialogComponent);
                    component = fixture.componentInstance;
                    fixture.detectChanges();
                });
                it("creates", () => {
                    expect(component).toBeTruthy();
                });
            });
        }
    };
});
$q$);
INSERT INTO component_files (component_id, filename, content) VALUES ((SELECT id FROM components WHERE framework='angular' AND component='confirm-dialog'), 'confirm-dialog.component.spec.ts', $q$// angular/confirm-dialog | version: 1.0.0 | author: Darrell | number: CMP-A201
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ConfirmDialogComponent } from "./confirm-dialog.component";

describe("ConfirmDialogComponent", () => {
  let component: ConfirmDialogComponent;
  let fixture: ComponentFixture<ConfirmDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmDialogComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("creates", () => {
    expect(component).toBeTruthy();
  });
});
$q$);
INSERT INTO component_files (component_id, filename, content) VALUES ((SELECT id FROM components WHERE framework='angular' AND component='confirm-dialog'), 'confirm-dialog.component.ts', $q$// angular/confirm-dialog | version: 1.0.0 | author: Darrell | number: CMP-A201
import { CommonModule } from "@angular/common";
import { Component, EventEmitter, HostListener, Input, Output } from "@angular/core";

@Component({
  selector: "app-confirm-dialog",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./confirm-dialog.component.html",
  styleUrl: "./confirm-dialog.component.scss"
})
export class ConfirmDialogComponent {
  @Input() open = false;
  @Input() title = "Confirm action";
  @Input() message = "Are you sure you want to continue?";
  @Input() confirmLabel = "Confirm";
  @Input() cancelLabel = "Cancel";
  @Input() closeOnBackdrop = true;

  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  @HostListener("window:keydown.escape")
  onEscape(): void {
    if (this.open) this.cancelled.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if (!this.closeOnBackdrop) return;
    if (event.target === event.currentTarget) this.cancelled.emit();
  }

  onConfirm(): void {
    this.confirmed.emit();
  }

  onCancel(): void {
    this.cancelled.emit();
  }
}
$q$);
INSERT INTO components (framework, component, version, author_name, component_number) VALUES ('angular', 'data-table', '1.0.0', 'Darrell', 'CMP-A202');
INSERT INTO component_files (component_id, filename, content) VALUES ((SELECT id FROM components WHERE framework='angular' AND component='data-table'), 'data-table.component.css', $q$.data-table {
  display: grid;
  gap: 0.75rem;
}

.data-table__toolbar {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
}

.data-table__toolbar input {
  min-width: 12rem;
  padding: 0.5rem 0.65rem;
  border: 1px solid #d6dce4;
  border-radius: 0.45rem;
}

.data-table__wrapper {
  overflow: auto;
  border: 1px solid #d6dce4;
  border-radius: 0.5rem;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  text-align: left;
  padding: 0.65rem 0.75rem;
  border-bottom: 1px solid #e7edf3;
}

th button {
  border: 0;
  background: transparent;
  cursor: pointer;
  font: inherit;
  font-weight: 600;
}

.data-table__pagination {
  display: flex;
  justify-content: flex-end;
  gap: 0.6rem;
}
$q$);
INSERT INTO component_files (component_id, filename, content) VALUES ((SELECT id FROM components WHERE framework='angular' AND component='data-table'), 'data-table.component.html', $q$<!-- angular/data-table | version: 1.0.0 | author: Darrell | number: CMP-A202 -->
<section class="data-table">
  <header class="data-table__toolbar">
    <input type="search" [(ngModel)]="searchValue" (ngModelChange)="onSearchChange()" placeholder="Search rows..." />
    <span>{{ filteredRows.length }} rows</span>
  </header>
  <div class="data-table__wrapper">
    <table>
      <thead>
        <tr>
          <th *ngFor="let column of normalizedColumns">
            <button type="button" (click)="onSort(column.key)">{{ column.label }} <span *ngIf="sortBy === column.key">{{ sortDir === 'asc' ? '▲' : '▼' }}</span></button>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let row of pagedRows">
          <td *ngFor="let column of normalizedColumns">{{ row[column.key] }}</td>
        </tr>
        <tr *ngIf="!pagedRows.length"><td [attr.colspan]="normalizedColumns.length || 1">No records found</td></tr>
      </tbody>
    </table>
  </div>
  <footer class="data-table__pagination">
    <button type="button" (click)="prev()" [disabled]="page <= 1">Previous</button>
    <span>Page {{ page }} of {{ totalPages }}</span>
    <button type="button" (click)="next()" [disabled]="page >= totalPages">Next</button>
  </footer>
</section>
$q$);
INSERT INTO component_files (component_id, filename, content) VALUES ((SELECT id FROM components WHERE framework='angular' AND component='data-table'), 'data-table.component.scss', $q$.data-table { display: grid; gap: 0.75rem; }
.data-table__toolbar { display: flex; justify-content: space-between; gap: 0.75rem; }
.data-table__toolbar input { min-width: 12rem; padding: 0.5rem 0.65rem; border: 1px solid #d6dce4; border-radius: 0.45rem; }
.data-table__wrapper { overflow: auto; border: 1px solid #d6dce4; border-radius: 0.5rem; }
table { width: 100%; border-collapse: collapse; }
th, td { text-align: left; padding: 0.65rem 0.75rem; border-bottom: 1px solid #e7edf3; }
th button { border: 0; background: transparent; cursor: pointer; font: inherit; font-weight: 600; }
.data-table__pagination { display: flex; justify-content: flex-end; gap: 0.6rem; }
$q$);
INSERT INTO component_files (component_id, filename, content) VALUES ((SELECT id FROM components WHERE framework='angular' AND component='data-table'), 'data-table.component.spec.js', $q$var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
System.register("data-table.component", ["@angular/common", "@angular/core", "@angular/forms"], function (exports_1, context_1) {
    "use strict";
    var common_1, core_1, forms_1, DataTableComponent;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (forms_1_1) {
                forms_1 = forms_1_1;
            }
        ],
        execute: function () {
            DataTableComponent = (() => {
                let _classDecorators = [core_1.Component({
                        selector: "app-data-table",
                        standalone: true,
                        imports: [common_1.CommonModule, forms_1.FormsModule],
                        templateUrl: "./data-table.component.html",
                        styleUrl: "./data-table.component.scss"
                    })];
                let _classDescriptor;
                let _classExtraInitializers = [];
                let _classThis;
                let _rows_decorators;
                let _rows_initializers = [];
                let _rows_extraInitializers = [];
                let _columns_decorators;
                let _columns_initializers = [];
                let _columns_extraInitializers = [];
                let _pageSize_decorators;
                let _pageSize_initializers = [];
                let _pageSize_extraInitializers = [];
                var DataTableComponent = _classThis = class {
                    constructor() {
                        this.rows = __runInitializers(this, _rows_initializers, []);
                        this.columns = (__runInitializers(this, _rows_extraInitializers), __runInitializers(this, _columns_initializers, []));
                        this.pageSize = (__runInitializers(this, _columns_extraInitializers), __runInitializers(this, _pageSize_initializers, 10));
                        this.searchValue = (__runInitializers(this, _pageSize_extraInitializers), "");
                        this.page = 1;
                        this.sortBy = "";
                        this.sortDir = "asc";
                    }
                    get normalizedColumns() {
                        if (this.columns.length)
                            return this.columns;
                        return Object.keys(this.rows[0] || {}).map((key) => ({ key, label: key }));
                    }
                    get filteredRows() {
                        const needle = this.searchValue.trim().toLowerCase();
                        if (!needle)
                            return this.rows;
                        return this.rows.filter((row) => this.normalizedColumns.some((c) => { var _a; return String((_a = row[c.key]) !== null && _a !== void 0 ? _a : "").toLowerCase().includes(needle); }));
                    }
                    get sortedRows() {
                        if (!this.sortBy)
                            return this.filteredRows;
                        return [...this.filteredRows].sort((a, b) => {
                            var _a, _b;
                            const av = String((_a = a[this.sortBy]) !== null && _a !== void 0 ? _a : "").toLowerCase();
                            const bv = String((_b = b[this.sortBy]) !== null && _b !== void 0 ? _b : "").toLowerCase();
                            const cmp = av.localeCompare(bv, undefined, { numeric: true });
                            return this.sortDir === "asc" ? cmp : -cmp;
                        });
                    }
                    get totalPages() { return Math.max(1, Math.ceil(this.sortedRows.length / this.pageSize)); }
                    get pagedRows() {
                        const safePage = Math.min(this.page, this.totalPages);
                        const start = (safePage - 1) * this.pageSize;
                        return this.sortedRows.slice(start, start + this.pageSize);
                    }
                    onSort(columnKey) {
                        this.page = 1;
                        if (this.sortBy !== columnKey) {
                            this.sortBy = columnKey;
                            this.sortDir = "asc";
                            return;
                        }
                        this.sortDir = this.sortDir === "asc" ? "desc" : "asc";
                    }
                    onSearchChange() { this.page = 1; }
                    prev() { this.page = Math.max(1, this.page - 1); }
                    next() { this.page = Math.min(this.totalPages, this.page + 1); }
                };
                __setFunctionName(_classThis, "DataTableComponent");
                (() => {
                    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                    _rows_decorators = [core_1.Input()];
                    _columns_decorators = [core_1.Input()];
                    _pageSize_decorators = [core_1.Input()];
                    __esDecorate(null, null, _rows_decorators, { kind: "field", name: "rows", static: false, private: false, access: { has: obj => "rows" in obj, get: obj => obj.rows, set: (obj, value) => { obj.rows = value; } }, metadata: _metadata }, _rows_initializers, _rows_extraInitializers);
                    __esDecorate(null, null, _columns_decorators, { kind: "field", name: "columns", static: false, private: false, access: { has: obj => "columns" in obj, get: obj => obj.columns, set: (obj, value) => { obj.columns = value; } }, metadata: _metadata }, _columns_initializers, _columns_extraInitializers);
                    __esDecorate(null, null, _pageSize_decorators, { kind: "field", name: "pageSize", static: false, private: false, access: { has: obj => "pageSize" in obj, get: obj => obj.pageSize, set: (obj, value) => { obj.pageSize = value; } }, metadata: _metadata }, _pageSize_initializers, _pageSize_extraInitializers);
                    __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                    DataTableComponent = _classThis = _classDescriptor.value;
                    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                    __runInitializers(_classThis, _classExtraInitializers);
                })();
                return DataTableComponent = _classThis;
            })();
            exports_1("DataTableComponent", DataTableComponent);
        }
    };
});
System.register("data-table.component.spec", ["@angular/core/testing", "data-table.component"], function (exports_2, context_2) {
    "use strict";
    var testing_1, data_table_component_1;
    var __moduleName = context_2 && context_2.id;
    return {
        setters: [
            function (testing_1_1) {
                testing_1 = testing_1_1;
            },
            function (data_table_component_1_1) {
                data_table_component_1 = data_table_component_1_1;
            }
        ],
        execute: function () {
            describe("DataTableComponent", () => {
                let component;
                let fixture;
                beforeEach(async () => {
                    await testing_1.TestBed.configureTestingModule({
                        imports: [data_table_component_1.DataTableComponent]
                    }).compileComponents();
                    fixture = testing_1.TestBed.createComponent(data_table_component_1.DataTableComponent);
                    component = fixture.componentInstance;
                    fixture.detectChanges();
                });
                it("creates", () => {
                    expect(component).toBeTruthy();
                });
            });
        }
    };
});
$q$);
INSERT INTO component_files (component_id, filename, content) VALUES ((SELECT id FROM components WHERE framework='angular' AND component='data-table'), 'data-table.component.spec.ts', $q$// angular/data-table | version: 1.0.0 | author: Darrell | number: CMP-A202
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DataTableComponent } from "./data-table.component";

describe("DataTableComponent", () => {
  let component: DataTableComponent;
  let fixture: ComponentFixture<DataTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataTableComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("creates", () => {
    expect(component).toBeTruthy();
  });
});
$q$);
INSERT INTO component_files (component_id, filename, content) VALUES ((SELECT id FROM components WHERE framework='angular' AND component='data-table'), 'data-table.component.ts', $q$// angular/data-table | version: 1.0.0 | author: Darrell | number: CMP-A202
import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { FormsModule } from "@angular/forms";

interface TableColumn { key: string; label: string; }

@Component({
  selector: "app-data-table",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./data-table.component.html",
  styleUrl: "./data-table.component.scss"
})
export class DataTableComponent {
  @Input() rows: Record<string, unknown>[] = [];
  @Input() columns: TableColumn[] = [];
  @Input() pageSize = 10;

  searchValue = "";
  page = 1;
  sortBy = "";
  sortDir: "asc" | "desc" = "asc";

  get normalizedColumns(): TableColumn[] {
    if (this.columns.length) return this.columns;
    return Object.keys(this.rows[0] || {}).map((key) => ({ key, label: key }));
  }

  get filteredRows(): Record<string, unknown>[] {
    const needle = this.searchValue.trim().toLowerCase();
    if (!needle) return this.rows;
    return this.rows.filter((row) => this.normalizedColumns.some((c) => String(row[c.key] ?? "").toLowerCase().includes(needle)));
  }

  get sortedRows(): Record<string, unknown>[] {
    if (!this.sortBy) return this.filteredRows;
    return [...this.filteredRows].sort((a, b) => {
      const av = String(a[this.sortBy] ?? "").toLowerCase();
      const bv = String(b[this.sortBy] ?? "").toLowerCase();
      const cmp = av.localeCompare(bv, undefined, { numeric: true });
      return this.sortDir === "asc" ? cmp : -cmp;
    });
  }

  get totalPages(): number { return Math.max(1, Math.ceil(this.sortedRows.length / this.pageSize)); }

  get pagedRows(): Record<string, unknown>[] {
    const safePage = Math.min(this.page, this.totalPages);
    const start = (safePage - 1) * this.pageSize;
    return this.sortedRows.slice(start, start + this.pageSize);
  }

  onSort(columnKey: string): void {
    this.page = 1;
    if (this.sortBy !== columnKey) { this.sortBy = columnKey; this.sortDir = "asc"; return; }
    this.sortDir = this.sortDir === "asc" ? "desc" : "asc";
  }

  onSearchChange(): void { this.page = 1; }
  prev(): void { this.page = Math.max(1, this.page - 1); }
  next(): void { this.page = Math.min(this.totalPages, this.page + 1); }
}
$q$);
INSERT INTO components (framework, component, version, author_name, component_number) VALUES ('angular', 'file-uploader', '1.0.0', 'Darrell', 'CMP-A204');
INSERT INTO component_files (component_id, filename, content) VALUES ((SELECT id FROM components WHERE framework='angular' AND component='file-uploader'), 'file-uploader.component.css', $q$.file-uploader {
  display: grid;
  gap: 0.8rem;
}

.file-uploader__dropzone {
  display: grid;
  gap: 0.35rem;
  justify-items: center;
  text-align: center;
  border: 2px dashed #c3cfdd;
  border-radius: 0.65rem;
  background: #f7f9fc;
  padding: 1.2rem;
  cursor: pointer;
}

.file-uploader__dropzone input {
  display: none;
}

.file-uploader__dropzone.is-active {
  border-color: #1655d1;
  background: #eef3ff;
}

.file-uploader__error {
  margin: 0;
  color: #ba1a1a;
}

.file-uploader__list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 0.4rem;
}

.file-uploader__list li {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 0.6rem;
  align-items: center;
  border: 1px solid #dde4ec;
  border-radius: 0.45rem;
  padding: 0.5rem 0.6rem;
}

.file-uploader__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
$q$);
INSERT INTO component_files (component_id, filename, content) VALUES ((SELECT id FROM components WHERE framework='angular' AND component='file-uploader'), 'file-uploader.component.html', $q$<!-- angular/file-uploader | version: 1.0.0 | author: Darrell | number: CMP-A204 -->
<section class="file-uploader">
  <label class="file-uploader__dropzone" [class.is-active]="dragActive" (dragover)="onDragOver($event)" (dragleave)="onDragLeave($event)" (drop)="onDrop($event)">
    <input type="file" [accept]="accept" [multiple]="multiple" (change)="onSelect($event)" />
    <strong>Drop files here or click to browse</strong>
    <small>Max file size: {{ maxSizeMb }} MB</small>
  </label>
  <p *ngIf="error" class="file-uploader__error">{{ error }}</p>
  <ul class="file-uploader__list">
    <li *ngFor="let file of files">
      <span>{{ file.name }}</span>
      <small>{{ toMb(file.size) }}</small>
      <button type="button" (click)="remove(file.name)">Remove</button>
    </li>
  </ul>
  <footer class="file-uploader__footer">
    <span>{{ files.length }} file(s)</span>
    <button type="button" [disabled]="!files.length" (click)="emitUpload()">Upload</button>
  </footer>
</section>
$q$);
INSERT INTO component_files (component_id, filename, content) VALUES ((SELECT id FROM components WHERE framework='angular' AND component='file-uploader'), 'file-uploader.component.scss', $q$.file-uploader { display: grid; gap: 0.8rem; }
.file-uploader__dropzone {
  display: grid;
  gap: 0.35rem;
  justify-items: center;
  text-align: center;
  border: 2px dashed #c3cfdd;
  border-radius: 0.65rem;
  background: #f7f9fc;
  padding: 1.2rem;
  cursor: pointer;
}
.file-uploader__dropzone input { display: none; }
.file-uploader__dropzone.is-active { border-color: #1655d1; background: #eef3ff; }
.file-uploader__error { margin: 0; color: #ba1a1a; }
.file-uploader__list { margin: 0; padding: 0; list-style: none; display: grid; gap: 0.4rem; }
.file-uploader__list li {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 0.6rem;
  align-items: center;
  border: 1px solid #dde4ec;
  border-radius: 0.45rem;
  padding: 0.5rem 0.6rem;
}
.file-uploader__footer { display: flex; align-items: center; justify-content: space-between; }
$q$);
INSERT INTO component_files (component_id, filename, content) VALUES ((SELECT id FROM components WHERE framework='angular' AND component='file-uploader'), 'file-uploader.component.spec.js', $q$var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
System.register("file-uploader.component", ["@angular/common", "@angular/core"], function (exports_1, context_1) {
    "use strict";
    var common_1, core_1, FileUploaderComponent;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            }
        ],
        execute: function () {
            FileUploaderComponent = (() => {
                let _classDecorators = [core_1.Component({
                        selector: "app-file-uploader",
                        standalone: true,
                        imports: [common_1.CommonModule],
                        templateUrl: "./file-uploader.component.html",
                        styleUrl: "./file-uploader.component.scss"
                    })];
                let _classDescriptor;
                let _classExtraInitializers = [];
                let _classThis;
                let _maxSizeMb_decorators;
                let _maxSizeMb_initializers = [];
                let _maxSizeMb_extraInitializers = [];
                let _multiple_decorators;
                let _multiple_initializers = [];
                let _multiple_extraInitializers = [];
                let _accept_decorators;
                let _accept_initializers = [];
                let _accept_extraInitializers = [];
                let _filesChange_decorators;
                let _filesChange_initializers = [];
                let _filesChange_extraInitializers = [];
                let _upload_decorators;
                let _upload_initializers = [];
                let _upload_extraInitializers = [];
                var FileUploaderComponent = _classThis = class {
                    constructor() {
                        this.maxSizeMb = __runInitializers(this, _maxSizeMb_initializers, 5);
                        this.multiple = (__runInitializers(this, _maxSizeMb_extraInitializers), __runInitializers(this, _multiple_initializers, true));
                        this.accept = (__runInitializers(this, _multiple_extraInitializers), __runInitializers(this, _accept_initializers, ""));
                        this.filesChange = (__runInitializers(this, _accept_extraInitializers), __runInitializers(this, _filesChange_initializers, new core_1.EventEmitter()));
                        this.upload = (__runInitializers(this, _filesChange_extraInitializers), __runInitializers(this, _upload_initializers, new core_1.EventEmitter()));
                        this.files = (__runInitializers(this, _upload_extraInitializers), []);
                        this.dragActive = false;
                        this.error = "";
                    }
                    get maxBytes() { return this.maxSizeMb * 1024 * 1024; }
                    onDragOver(event) { event.preventDefault(); this.dragActive = true; }
                    onDragLeave(event) { event.preventDefault(); this.dragActive = false; }
                    onDrop(event) {
                        var _a;
                        event.preventDefault();
                        this.dragActive = false;
                        const list = (_a = event.dataTransfer) === null || _a === void 0 ? void 0 : _a.files;
                        if (list)
                            this.addFiles(Array.from(list));
                    }
                    onSelect(event) {
                        const input = event.target;
                        if (!input.files)
                            return;
                        this.addFiles(Array.from(input.files));
                        input.value = "";
                    }
                    remove(name) {
                        this.files = this.files.filter((file) => file.name !== name);
                        this.filesChange.emit(this.files);
                    }
                    emitUpload() { this.upload.emit(this.files); }
                    toMb(bytes) { return (bytes / (1024 * 1024)).toFixed(2) + " MB"; }
                    addFiles(incoming) {
                        const tooLarge = incoming.find((file) => file.size > this.maxBytes);
                        if (tooLarge) {
                            this.error = tooLarge.name + " exceeds " + this.maxSizeMb + " MB";
                            return;
                        }
                        this.error = "";
                        this.files = this.multiple ? [...this.files, ...incoming] : incoming.slice(0, 1);
                        this.filesChange.emit(this.files);
                    }
                };
                __setFunctionName(_classThis, "FileUploaderComponent");
                (() => {
                    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                    _maxSizeMb_decorators = [core_1.Input()];
                    _multiple_decorators = [core_1.Input()];
                    _accept_decorators = [core_1.Input()];
                    _filesChange_decorators = [core_1.Output()];
                    _upload_decorators = [core_1.Output()];
                    __esDecorate(null, null, _maxSizeMb_decorators, { kind: "field", name: "maxSizeMb", static: false, private: false, access: { has: obj => "maxSizeMb" in obj, get: obj => obj.maxSizeMb, set: (obj, value) => { obj.maxSizeMb = value; } }, metadata: _metadata }, _maxSizeMb_initializers, _maxSizeMb_extraInitializers);
                    __esDecorate(null, null, _multiple_decorators, { kind: "field", name: "multiple", static: false, private: false, access: { has: obj => "multiple" in obj, get: obj => obj.multiple, set: (obj, value) => { obj.multiple = value; } }, metadata: _metadata }, _multiple_initializers, _multiple_extraInitializers);
                    __esDecorate(null, null, _accept_decorators, { kind: "field", name: "accept", static: false, private: false, access: { has: obj => "accept" in obj, get: obj => obj.accept, set: (obj, value) => { obj.accept = value; } }, metadata: _metadata }, _accept_initializers, _accept_extraInitializers);
                    __esDecorate(null, null, _filesChange_decorators, { kind: "field", name: "filesChange", static: false, private: false, access: { has: obj => "filesChange" in obj, get: obj => obj.filesChange, set: (obj, value) => { obj.filesChange = value; } }, metadata: _metadata }, _filesChange_initializers, _filesChange_extraInitializers);
                    __esDecorate(null, null, _upload_decorators, { kind: "field", name: "upload", static: false, private: false, access: { has: obj => "upload" in obj, get: obj => obj.upload, set: (obj, value) => { obj.upload = value; } }, metadata: _metadata }, _upload_initializers, _upload_extraInitializers);
                    __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                    FileUploaderComponent = _classThis = _classDescriptor.value;
                    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                    __runInitializers(_classThis, _classExtraInitializers);
                })();
                return FileUploaderComponent = _classThis;
            })();
            exports_1("FileUploaderComponent", FileUploaderComponent);
        }
    };
});
System.register("file-uploader.component.spec", ["@angular/core/testing", "file-uploader.component"], function (exports_2, context_2) {
    "use strict";
    var testing_1, file_uploader_component_1;
    var __moduleName = context_2 && context_2.id;
    return {
        setters: [
            function (testing_1_1) {
                testing_1 = testing_1_1;
            },
            function (file_uploader_component_1_1) {
                file_uploader_component_1 = file_uploader_component_1_1;
            }
        ],
        execute: function () {
            describe("FileUploaderComponent", () => {
                let component;
                let fixture;
                beforeEach(async () => {
                    await testing_1.TestBed.configureTestingModule({
                        imports: [file_uploader_component_1.FileUploaderComponent]
                    }).compileComponents();
                    fixture = testing_1.TestBed.createComponent(file_uploader_component_1.FileUploaderComponent);
                    component = fixture.componentInstance;
                    fixture.detectChanges();
                });
                it("creates", () => {
                    expect(component).toBeTruthy();
                });
            });
        }
    };
});
$q$);
INSERT INTO component_files (component_id, filename, content) VALUES ((SELECT id FROM components WHERE framework='angular' AND component='file-uploader'), 'file-uploader.component.spec.ts', $q$// angular/file-uploader | version: 1.0.0 | author: Darrell | number: CMP-A204
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FileUploaderComponent } from "./file-uploader.component";

describe("FileUploaderComponent", () => {
  let component: FileUploaderComponent;
  let fixture: ComponentFixture<FileUploaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileUploaderComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(FileUploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("creates", () => {
    expect(component).toBeTruthy();
  });
});
$q$);
INSERT INTO component_files (component_id, filename, content) VALUES ((SELECT id FROM components WHERE framework='angular' AND component='file-uploader'), 'file-uploader.component.ts', $q$// angular/file-uploader | version: 1.0.0 | author: Darrell | number: CMP-A204
import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "app-file-uploader",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./file-uploader.component.html",
  styleUrl: "./file-uploader.component.scss"
})
export class FileUploaderComponent {
  @Input() maxSizeMb = 5;
  @Input() multiple = true;
  @Input() accept = "";
  @Output() filesChange = new EventEmitter<File[]>();
  @Output() upload = new EventEmitter<File[]>();

  files: File[] = [];
  dragActive = false;
  error = "";

  private get maxBytes(): number { return this.maxSizeMb * 1024 * 1024; }

  onDragOver(event: DragEvent): void { event.preventDefault(); this.dragActive = true; }
  onDragLeave(event: DragEvent): void { event.preventDefault(); this.dragActive = false; }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragActive = false;
    const list = event.dataTransfer?.files;
    if (list) this.addFiles(Array.from(list));
  }

  onSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;
    this.addFiles(Array.from(input.files));
    input.value = "";
  }

  remove(name: string): void {
    this.files = this.files.filter((file) => file.name !== name);
    this.filesChange.emit(this.files);
  }

  emitUpload(): void { this.upload.emit(this.files); }

  toMb(bytes: number): string { return (bytes / (1024 * 1024)).toFixed(2) + " MB"; }

  private addFiles(incoming: File[]): void {
    const tooLarge = incoming.find((file) => file.size > this.maxBytes);
    if (tooLarge) {
      this.error = tooLarge.name + " exceeds " + this.maxSizeMb + " MB";
      return;
    }
    this.error = "";
    this.files = this.multiple ? [...this.files, ...incoming] : incoming.slice(0, 1);
    this.filesChange.emit(this.files);
  }
}
$q$);
INSERT INTO components (framework, component, version, author_name, component_number) VALUES ('angular', 'pagination-controls', '1.0.0', 'Darrell', 'CMP-A203');
INSERT INTO component_files (component_id, filename, content) VALUES ((SELECT id FROM components WHERE framework='angular' AND component='pagination-controls'), 'pagination-controls.component.css', $q$.pagination-controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35rem;
}

.pagination-controls button {
  border: 1px solid #c9d2dd;
  background: #fff;
  border-radius: 0.45rem;
  padding: 0.35rem 0.6rem;
  cursor: pointer;
}

.pagination-controls button.is-active {
  background: #1655d1;
  border-color: #1655d1;
  color: #fff;
}

.pagination-controls__dots {
  padding: 0 0.25rem;
  color: #64748b;
}
$q$);
INSERT INTO component_files (component_id, filename, content) VALUES ((SELECT id FROM components WHERE framework='angular' AND component='pagination-controls'), 'pagination-controls.component.html', $q$<!-- angular/pagination-controls | version: 1.0.0 | author: Darrell | number: CMP-A203 -->
<nav *ngIf="totalPages > 1" class="pagination-controls" aria-label="Pagination">
  <button type="button" [disabled]="page <= 1" (click)="emitPage(page - 1)">Previous</button>
  <button *ngIf="pages[0] > 1" type="button" (click)="emitPage(1)">1</button>
  <span *ngIf="pages[0] > 2" class="pagination-controls__dots">...</span>
  <button *ngFor="let n of pages" type="button" [class.is-active]="n === page" [attr.aria-current]="n === page ? 'page' : null" (click)="emitPage(n)">{{ n }}</button>
  <span *ngIf="pages[pages.length - 1] < totalPages - 1" class="pagination-controls__dots">...</span>
  <button *ngIf="pages[pages.length - 1] < totalPages" type="button" (click)="emitPage(totalPages)">{{ totalPages }}</button>
  <button type="button" [disabled]="page >= totalPages" (click)="emitPage(page + 1)">Next</button>
</nav>
$q$);
INSERT INTO component_files (component_id, filename, content) VALUES ((SELECT id FROM components WHERE framework='angular' AND component='pagination-controls'), 'pagination-controls.component.scss', $q$.pagination-controls { display: flex; flex-wrap: wrap; align-items: center; gap: 0.35rem; }
.pagination-controls button { border: 1px solid #c9d2dd; background: #fff; border-radius: 0.45rem; padding: 0.35rem 0.6rem; cursor: pointer; }
.pagination-controls button.is-active { background: #1655d1; border-color: #1655d1; color: #fff; }
.pagination-controls__dots { padding: 0 0.25rem; color: #64748b; }
$q$);
INSERT INTO component_files (component_id, filename, content) VALUES ((SELECT id FROM components WHERE framework='angular' AND component='pagination-controls'), 'pagination-controls.component.spec.js', $q$var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
System.register("pagination-controls.component", ["@angular/common", "@angular/core"], function (exports_1, context_1) {
    "use strict";
    var common_1, core_1, PaginationControlsComponent;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            }
        ],
        execute: function () {
            PaginationControlsComponent = (() => {
                let _classDecorators = [core_1.Component({
                        selector: "app-pagination-controls",
                        standalone: true,
                        imports: [common_1.CommonModule],
                        templateUrl: "./pagination-controls.component.html",
                        styleUrl: "./pagination-controls.component.scss"
                    })];
                let _classDescriptor;
                let _classExtraInitializers = [];
                let _classThis;
                let _page_decorators;
                let _page_initializers = [];
                let _page_extraInitializers = [];
                let _totalPages_decorators;
                let _totalPages_initializers = [];
                let _totalPages_extraInitializers = [];
                let _maxVisible_decorators;
                let _maxVisible_initializers = [];
                let _maxVisible_extraInitializers = [];
                let _pageChange_decorators;
                let _pageChange_initializers = [];
                let _pageChange_extraInitializers = [];
                var PaginationControlsComponent = _classThis = class {
                    get pages() {
                        const visible = Math.max(3, this.maxVisible);
                        const half = Math.floor(visible / 2);
                        const start = Math.max(1, Math.min(this.page - half, Math.max(1, this.totalPages - visible + 1)));
                        const end = Math.min(this.totalPages, start + visible - 1);
                        const out = [];
                        for (let i = start; i <= end; i += 1)
                            out.push(i);
                        return out;
                    }
                    emitPage(next) {
                        const safe = Math.max(1, Math.min(this.totalPages, next));
                        this.pageChange.emit(safe);
                    }
                    constructor() {
                        this.page = __runInitializers(this, _page_initializers, 1);
                        this.totalPages = (__runInitializers(this, _page_extraInitializers), __runInitializers(this, _totalPages_initializers, 1));
                        this.maxVisible = (__runInitializers(this, _totalPages_extraInitializers), __runInitializers(this, _maxVisible_initializers, 7));
                        this.pageChange = (__runInitializers(this, _maxVisible_extraInitializers), __runInitializers(this, _pageChange_initializers, new core_1.EventEmitter()));
                        __runInitializers(this, _pageChange_extraInitializers);
                    }
                };
                __setFunctionName(_classThis, "PaginationControlsComponent");
                (() => {
                    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                    _page_decorators = [core_1.Input()];
                    _totalPages_decorators = [core_1.Input()];
                    _maxVisible_decorators = [core_1.Input()];
                    _pageChange_decorators = [core_1.Output()];
                    __esDecorate(null, null, _page_decorators, { kind: "field", name: "page", static: false, private: false, access: { has: obj => "page" in obj, get: obj => obj.page, set: (obj, value) => { obj.page = value; } }, metadata: _metadata }, _page_initializers, _page_extraInitializers);
                    __esDecorate(null, null, _totalPages_decorators, { kind: "field", name: "totalPages", static: false, private: false, access: { has: obj => "totalPages" in obj, get: obj => obj.totalPages, set: (obj, value) => { obj.totalPages = value; } }, metadata: _metadata }, _totalPages_initializers, _totalPages_extraInitializers);
                    __esDecorate(null, null, _maxVisible_decorators, { kind: "field", name: "maxVisible", static: false, private: false, access: { has: obj => "maxVisible" in obj, get: obj => obj.maxVisible, set: (obj, value) => { obj.maxVisible = value; } }, metadata: _metadata }, _maxVisible_initializers, _maxVisible_extraInitializers);
                    __esDecorate(null, null, _pageChange_decorators, { kind: "field", name: "pageChange", static: false, private: false, access: { has: obj => "pageChange" in obj, get: obj => obj.pageChange, set: (obj, value) => { obj.pageChange = value; } }, metadata: _metadata }, _pageChange_initializers, _pageChange_extraInitializers);
                    __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                    PaginationControlsComponent = _classThis = _classDescriptor.value;
                    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                    __runInitializers(_classThis, _classExtraInitializers);
                })();
                return PaginationControlsComponent = _classThis;
            })();
            exports_1("PaginationControlsComponent", PaginationControlsComponent);
        }
    };
});
System.register("pagination-controls.component.spec", ["@angular/core/testing", "pagination-controls.component"], function (exports_2, context_2) {
    "use strict";
    var testing_1, pagination_controls_component_1;
    var __moduleName = context_2 && context_2.id;
    return {
        setters: [
            function (testing_1_1) {
                testing_1 = testing_1_1;
            },
            function (pagination_controls_component_1_1) {
                pagination_controls_component_1 = pagination_controls_component_1_1;
            }
        ],
        execute: function () {
            describe("PaginationControlsComponent", () => {
                let component;
                let fixture;
                beforeEach(async () => {
                    await testing_1.TestBed.configureTestingModule({
                        imports: [pagination_controls_component_1.PaginationControlsComponent]
                    }).compileComponents();
                    fixture = testing_1.TestBed.createComponent(pagination_controls_component_1.PaginationControlsComponent);
                    component = fixture.componentInstance;
                    fixture.detectChanges();
                });
                it("creates", () => {
                    expect(component).toBeTruthy();
                });
            });
        }
    };
});
$q$);
INSERT INTO component_files (component_id, filename, content) VALUES ((SELECT id FROM components WHERE framework='angular' AND component='pagination-controls'), 'pagination-controls.component.spec.ts', $q$// angular/pagination-controls | version: 1.0.0 | author: Darrell | number: CMP-A203
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { PaginationControlsComponent } from "./pagination-controls.component";

describe("PaginationControlsComponent", () => {
  let component: PaginationControlsComponent;
  let fixture: ComponentFixture<PaginationControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginationControlsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PaginationControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("creates", () => {
    expect(component).toBeTruthy();
  });
});
$q$);
INSERT INTO component_files (component_id, filename, content) VALUES ((SELECT id FROM components WHERE framework='angular' AND component='pagination-controls'), 'pagination-controls.component.ts', $q$// angular/pagination-controls | version: 1.0.0 | author: Darrell | number: CMP-A203
import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "app-pagination-controls",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./pagination-controls.component.html",
  styleUrl: "./pagination-controls.component.scss"
})
export class PaginationControlsComponent {
  @Input() page = 1;
  @Input() totalPages = 1;
  @Input() maxVisible = 7;
  @Output() pageChange = new EventEmitter<number>();

  get pages(): number[] {
    const visible = Math.max(3, this.maxVisible);
    const half = Math.floor(visible / 2);
    const start = Math.max(1, Math.min(this.page - half, Math.max(1, this.totalPages - visible + 1)));
    const end = Math.min(this.totalPages, start + visible - 1);
    const out: number[] = [];
    for (let i = start; i <= end; i += 1) out.push(i);
    return out;
  }

  emitPage(next: number): void {
    const safe = Math.max(1, Math.min(this.totalPages, next));
    this.pageChange.emit(safe);
  }
}
$q$);
INSERT INTO components (framework, component, version, author_name, component_number) VALUES ('angular', 'test', '1.0.0', 'Darrell Parkhouse', 'N/A');
INSERT INTO component_files (component_id, filename, content) VALUES ((SELECT id FROM components WHERE framework='angular' AND component='test'), 'test.component.html', $q$<!-- angular/test | version: 1.0.0 | author: Darrell Parkhouse | number: N/A -->
<section class="test">
  <h2>Test</h2>
  <p>Angular Test template.</p>
  <small>v1.0.0 - Darrell Parkhouse - N/A</small>
</section>
$q$);
INSERT INTO component_files (component_id, filename, content) VALUES ((SELECT id FROM components WHERE framework='angular' AND component='test'), 'test.component.scss', $q$.test {
  display: grid;
  gap: 0.5rem;
}
$q$);
INSERT INTO component_files (component_id, filename, content) VALUES ((SELECT id FROM components WHERE framework='angular' AND component='test'), 'test.component.spec.ts', $q$// angular/test | version: 1.0.0 | author: Darrell Parkhouse | number: N/A
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { TestComponent } from "./test.component";

describe("TestComponent", () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("creates", () => {
    expect(component).toBeTruthy();
  });
});
$q$);
INSERT INTO component_files (component_id, filename, content) VALUES ((SELECT id FROM components WHERE framework='angular' AND component='test'), 'test.component.ts', $q$// angular/test | version: 1.0.0 | author: Darrell Parkhouse | number: N/A
import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";

@Component({
  selector: "app-test",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./test.component.html",
  styleUrl: "./test.component.scss"
})
export class TestComponent {}
$q$);
INSERT INTO components (framework, component, version, author_name, component_number) VALUES ('angular', 'toast-notification', '1.0.0', 'Darrell', 'CMP-A205');
INSERT INTO component_files (component_id, filename, content) VALUES ((SELECT id FROM components WHERE framework='angular' AND component='toast-notification'), 'toast-notification.component.css', $q$.toast-notification {
  position: fixed;
  z-index: 1300;
  display: grid;
  gap: 0.55rem;
  width: min(100vw - 2rem, 22rem);
}

.toast-notification--top-right {
  top: 1rem;
  right: 1rem;
}

.toast-notification--top-left {
  top: 1rem;
  left: 1rem;
}

.toast-notification--bottom-right {
  bottom: 1rem;
  right: 1rem;
}

.toast-notification--bottom-left {
  bottom: 1rem;
  left: 1rem;
}

.toast-notification__item {
  border: 1px solid #d8e1ec;
  background: #ffffff;
  border-radius: 0.6rem;
  padding: 0.75rem 0.8rem;
  box-shadow: 0 0.5rem 1.2rem rgba(19, 32, 55, 0.12);
}

.toast-notification__item h4 {
  margin: 0 0 0.35rem;
}

.toast-notification__item p {
  margin: 0 0 0.55rem;
}

.toast-notification__item--success {
  border-color: #6fbf8d;
}

.toast-notification__item--warning {
  border-color: #d9b166;
}

.toast-notification__item--error {
  border-color: #d18383;
}
$q$);
INSERT INTO component_files (component_id, filename, content) VALUES ((SELECT id FROM components WHERE framework='angular' AND component='toast-notification'), 'toast-notification.component.html', $q$<!-- angular/toast-notification | version: 1.0.0 | author: Darrell | number: CMP-A205 -->
<aside *ngIf="toasts.length" class="toast-notification" [class]="'toast-notification toast-notification--' + position" role="status" aria-live="polite">
  <article *ngFor="let toast of toasts" class="toast-notification__item" [class]="'toast-notification__item toast-notification__item--' + (toast.type || 'info')">
    <h4 *ngIf="toast.title">{{ toast.title }}</h4>
    <p>{{ toast.message }}</p>
    <button type="button" (click)="onDismiss(toast.id)">Dismiss</button>
  </article>
</aside>
$q$);
INSERT INTO component_files (component_id, filename, content) VALUES ((SELECT id FROM components WHERE framework='angular' AND component='toast-notification'), 'toast-notification.component.scss', $q$.toast-notification {
  position: fixed;
  z-index: 1300;
  display: grid;
  gap: 0.55rem;
  width: min(100vw - 2rem, 22rem);
}
.toast-notification--top-right { top: 1rem; right: 1rem; }
.toast-notification--top-left { top: 1rem; left: 1rem; }
.toast-notification--bottom-right { bottom: 1rem; right: 1rem; }
.toast-notification--bottom-left { bottom: 1rem; left: 1rem; }
.toast-notification__item {
  border: 1px solid #d8e1ec;
  background: #ffffff;
  border-radius: 0.6rem;
  padding: 0.75rem 0.8rem;
  box-shadow: 0 0.5rem 1.2rem rgba(19, 32, 55, 0.12);
}
.toast-notification__item h4 { margin: 0 0 0.35rem; }
.toast-notification__item p { margin: 0 0 0.55rem; }
.toast-notification__item--success { border-color: #6fbf8d; }
.toast-notification__item--warning { border-color: #d9b166; }
.toast-notification__item--error { border-color: #d18383; }
$q$);
INSERT INTO component_files (component_id, filename, content) VALUES ((SELECT id FROM components WHERE framework='angular' AND component='toast-notification'), 'toast-notification.component.spec.js', $q$var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
System.register("toast-notification.component", ["@angular/common", "@angular/core"], function (exports_1, context_1) {
    "use strict";
    var common_1, core_1, ToastNotificationComponent;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            }
        ],
        execute: function () {
            ToastNotificationComponent = (() => {
                let _classDecorators = [core_1.Component({
                        selector: "app-toast-notification",
                        standalone: true,
                        imports: [common_1.CommonModule],
                        templateUrl: "./toast-notification.component.html",
                        styleUrl: "./toast-notification.component.scss"
                    })];
                let _classDescriptor;
                let _classExtraInitializers = [];
                let _classThis;
                let _toasts_decorators;
                let _toasts_initializers = [];
                let _toasts_extraInitializers = [];
                let _position_decorators;
                let _position_initializers = [];
                let _position_extraInitializers = [];
                let _autoCloseMs_decorators;
                let _autoCloseMs_initializers = [];
                let _autoCloseMs_extraInitializers = [];
                let _dismiss_decorators;
                let _dismiss_initializers = [];
                let _dismiss_extraInitializers = [];
                var ToastNotificationComponent = _classThis = class {
                    constructor() {
                        this.toasts = __runInitializers(this, _toasts_initializers, []);
                        this.position = (__runInitializers(this, _toasts_extraInitializers), __runInitializers(this, _position_initializers, "top-right"));
                        this.autoCloseMs = (__runInitializers(this, _position_extraInitializers), __runInitializers(this, _autoCloseMs_initializers, 4000));
                        this.dismiss = (__runInitializers(this, _autoCloseMs_extraInitializers), __runInitializers(this, _dismiss_initializers, new core_1.EventEmitter()));
                        this.timers = (__runInitializers(this, _dismiss_extraInitializers), new Map());
                    }
                    ngOnChanges(changes) {
                        if (changes["toasts"] || changes["autoCloseMs"])
                            this.resetTimers();
                    }
                    ngOnDestroy() { this.clearTimers(); }
                    onDismiss(id) { this.dismiss.emit(id); }
                    resetTimers() {
                        this.clearTimers();
                        if (!Number.isFinite(this.autoCloseMs) || this.autoCloseMs <= 0)
                            return;
                        for (const toast of this.toasts) {
                            if ((toast === null || toast === void 0 ? void 0 : toast.id) == null)
                                continue;
                            const timer = setTimeout(() => this.dismiss.emit(toast.id), this.autoCloseMs);
                            this.timers.set(toast.id, timer);
                        }
                    }
                    clearTimers() {
                        for (const timer of this.timers.values())
                            clearTimeout(timer);
                        this.timers.clear();
                    }
                };
                __setFunctionName(_classThis, "ToastNotificationComponent");
                (() => {
                    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                    _toasts_decorators = [core_1.Input()];
                    _position_decorators = [core_1.Input()];
                    _autoCloseMs_decorators = [core_1.Input()];
                    _dismiss_decorators = [core_1.Output()];
                    __esDecorate(null, null, _toasts_decorators, { kind: "field", name: "toasts", static: false, private: false, access: { has: obj => "toasts" in obj, get: obj => obj.toasts, set: (obj, value) => { obj.toasts = value; } }, metadata: _metadata }, _toasts_initializers, _toasts_extraInitializers);
                    __esDecorate(null, null, _position_decorators, { kind: "field", name: "position", static: false, private: false, access: { has: obj => "position" in obj, get: obj => obj.position, set: (obj, value) => { obj.position = value; } }, metadata: _metadata }, _position_initializers, _position_extraInitializers);
                    __esDecorate(null, null, _autoCloseMs_decorators, { kind: "field", name: "autoCloseMs", static: false, private: false, access: { has: obj => "autoCloseMs" in obj, get: obj => obj.autoCloseMs, set: (obj, value) => { obj.autoCloseMs = value; } }, metadata: _metadata }, _autoCloseMs_initializers, _autoCloseMs_extraInitializers);
                    __esDecorate(null, null, _dismiss_decorators, { kind: "field", name: "dismiss", static: false, private: false, access: { has: obj => "dismiss" in obj, get: obj => obj.dismiss, set: (obj, value) => { obj.dismiss = value; } }, metadata: _metadata }, _dismiss_initializers, _dismiss_extraInitializers);
                    __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                    ToastNotificationComponent = _classThis = _classDescriptor.value;
                    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                    __runInitializers(_classThis, _classExtraInitializers);
                })();
                return ToastNotificationComponent = _classThis;
            })();
            exports_1("ToastNotificationComponent", ToastNotificationComponent);
        }
    };
});
System.register("toast-notification.component.spec", ["@angular/core/testing", "toast-notification.component"], function (exports_2, context_2) {
    "use strict";
    var testing_1, toast_notification_component_1;
    var __moduleName = context_2 && context_2.id;
    return {
        setters: [
            function (testing_1_1) {
                testing_1 = testing_1_1;
            },
            function (toast_notification_component_1_1) {
                toast_notification_component_1 = toast_notification_component_1_1;
            }
        ],
        execute: function () {
            describe("ToastNotificationComponent", () => {
                let component;
                let fixture;
                beforeEach(async () => {
                    await testing_1.TestBed.configureTestingModule({
                        imports: [toast_notification_component_1.ToastNotificationComponent]
                    }).compileComponents();
                    fixture = testing_1.TestBed.createComponent(toast_notification_component_1.ToastNotificationComponent);
                    component = fixture.componentInstance;
                    fixture.detectChanges();
                });
                it("creates", () => {
                    expect(component).toBeTruthy();
                });
            });
        }
    };
});
$q$);
INSERT INTO component_files (component_id, filename, content) VALUES ((SELECT id FROM components WHERE framework='angular' AND component='toast-notification'), 'toast-notification.component.spec.ts', $q$// angular/toast-notification | version: 1.0.0 | author: Darrell | number: CMP-A205
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ToastNotificationComponent } from "./toast-notification.component";

describe("ToastNotificationComponent", () => {
  let component: ToastNotificationComponent;
  let fixture: ComponentFixture<ToastNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastNotificationComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ToastNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("creates", () => {
    expect(component).toBeTruthy();
  });
});
$q$);
INSERT INTO component_files (component_id, filename, content) VALUES ((SELECT id FROM components WHERE framework='angular' AND component='toast-notification'), 'toast-notification.component.ts', $q$// angular/toast-notification | version: 1.0.0 | author: Darrell | number: CMP-A205
import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from "@angular/core";

interface ToastItem {
  id: string | number;
  title?: string;
  message: string;
  type?: "info" | "success" | "warning" | "error";
}

@Component({
  selector: "app-toast-notification",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./toast-notification.component.html",
  styleUrl: "./toast-notification.component.scss"
})
export class ToastNotificationComponent implements OnChanges, OnDestroy {
  @Input() toasts: ToastItem[] = [];
  @Input() position: "top-right" | "top-left" | "bottom-right" | "bottom-left" = "top-right";
  @Input() autoCloseMs = 4000;
  @Output() dismiss = new EventEmitter<string | number>();

  private timers = new Map<string | number, ReturnType<typeof setTimeout>>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["toasts"] || changes["autoCloseMs"]) this.resetTimers();
  }

  ngOnDestroy(): void { this.clearTimers(); }

  onDismiss(id: string | number): void { this.dismiss.emit(id); }

  private resetTimers(): void {
    this.clearTimers();
    if (!Number.isFinite(this.autoCloseMs) || this.autoCloseMs <= 0) return;
    for (const toast of this.toasts) {
      if (toast?.id == null) continue;
      const timer = setTimeout(() => this.dismiss.emit(toast.id), this.autoCloseMs);
      this.timers.set(toast.id, timer);
    }
  }

  private clearTimers(): void {
    for (const timer of this.timers.values()) clearTimeout(timer);
    this.timers.clear();
  }
}
$q$);
INSERT INTO components (framework, component, version, author_name, component_number) VALUES ('react', 'data-table', '1.0.0', 'Darrell', 'CMP-202');
INSERT INTO component_files (component_id, filename, content) VALUES ((SELECT id FROM components WHERE framework='react' AND component='data-table'), 'data-table.css', $q$.data-table {
  display: grid;
  gap: 0.75rem;
}

.data-table__toolbar {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
}

.data-table__search {
  flex: 1;
  min-width: 12rem;
  padding: 0.55rem 0.65rem;
  border: 1px solid #d6dce4;
  border-radius: 0.45rem;
}

.data-table__count {
  font-size: 0.9rem;
  color: #4d5b70;
}

.data-table__wrapper {
  overflow: auto;
  border: 1px solid #d6dce4;
  border-radius: 0.5rem;
}

.data-table table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  text-align: left;
  padding: 0.7rem 0.8rem;
  border-bottom: 1px solid #e7edf3;
}

.data-table__sort {
  border: 0;
  background: transparent;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
}

.data-table__pagination {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
}

.data-table__pagination button {
  border: 1px solid #c9d2dd;
  background: #fff;
  border-radius: 0.4rem;
  padding: 0.35rem 0.6rem;
  cursor: pointer;
}

.data-table__pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
$q$);
INSERT INTO component_files (component_id, filename, content) VALUES ((SELECT id FROM components WHERE framework='react' AND component='data-table'), 'data-table.jsx', $q$// react/data-table | version: 1.0.0 | author: Darrell | number: CMP-202
import React, { useMemo, useState } from "react";

function normalizeColumns(columns, rows) {
  if (Array.isArray(columns) && columns.length) return columns;
  const sample = rows[0] || {};
  return Object.keys(sample).map((key) => ({ key, label: key }));
}

export default function DataTableComponent({
  rows = [],
  columns = [],
  pageSize = 10,
  emptyText = "No records found",
  searchable = true
}) {
  const normalizedColumns = useMemo(() => normalizeColumns(columns, rows), [columns, rows]);
  const [searchValue, setSearchValue] = useState("");
  const [sortBy, setSortBy] = useState(normalizedColumns[0]?.key || null);
  const [sortDir, setSortDir] = useState("asc");
  const [page, setPage] = useState(1);

  const filteredRows = useMemo(() => {
    const needle = searchValue.trim().toLowerCase();
    if (!needle) return rows;
    return rows.filter((row) =>
      normalizedColumns.some((column) => String(row[column.key] ?? "").toLowerCase().includes(needle))
    );
  }, [rows, normalizedColumns, searchValue]);

  const sortedRows = useMemo(() => {
    if (!sortBy) return filteredRows;
    return [...filteredRows].sort((a, b) => {
      const aValue = String(a[sortBy] ?? "").toLowerCase();
      const bValue = String(b[sortBy] ?? "").toLowerCase();
      const base = aValue.localeCompare(bValue, undefined, { numeric: true });
      return sortDir === "asc" ? base : -base;
    });
  }, [filteredRows, sortBy, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pagedRows = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return sortedRows.slice(start, start + pageSize);
  }, [sortedRows, safePage, pageSize]);

  function toggleSort(columnKey) {
    setPage(1);
    if (sortBy !== columnKey) {
      setSortBy(columnKey);
      setSortDir("asc");
      return;
    }
    setSortDir((current) => (current === "asc" ? "desc" : "asc"));
  }

  function changePage(nextPage) {
    setPage(Math.max(1, Math.min(totalPages, nextPage)));
  }

  return (
    <section className="data-table">
      {searchable ? (
        <div className="data-table__toolbar">
          <input
            className="data-table__search"
            type="search"
            value={searchValue}
            onChange={(event) => {
              setSearchValue(event.target.value);
              setPage(1);
            }}
            placeholder="Search rows..."
          />
          <span className="data-table__count">{filteredRows.length} rows</span>
        </div>
      ) : null}

      <div className="data-table__wrapper">
        <table>
          <thead>
            <tr>
              {normalizedColumns.map((column) => (
                <th key={column.key}>
                  <button type="button" onClick={() => toggleSort(column.key)} className="data-table__sort">
                    {column.label}
                    {sortBy === column.key ? <span>{sortDir === "asc" ? " ▲" : " ▼"}</span> : null}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pagedRows.length ? (
              pagedRows.map((row, index) => (
                <tr key={row.id || `${safePage}-${index}`}>
                  {normalizedColumns.map((column) => (
                    <td key={column.key}>{String(row[column.key] ?? "")}</td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={Math.max(1, normalizedColumns.length)}>{emptyText}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <footer className="data-table__pagination">
        <button type="button" disabled={safePage <= 1} onClick={() => changePage(safePage - 1)}>
          Previous
        </button>
        <span>
          Page {safePage} of {totalPages}
        </span>
        <button type="button" disabled={safePage >= totalPages} onClick={() => changePage(safePage + 1)}>
          Next
        </button>
      </footer>
    </section>
  );
}
$q$);
INSERT INTO component_files (component_id, filename, content) VALUES ((SELECT id FROM components WHERE framework='react' AND component='data-table'), 'data-table.scss', $q$.data-table {
  display: grid;
  gap: 0.75rem;
}

.data-table__toolbar {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
}

.data-table__search {
  flex: 1;
  min-width: 12rem;
  padding: 0.55rem 0.65rem;
  border: 1px solid #d6dce4;
  border-radius: 0.45rem;
}

.data-table__count {
  font-size: 0.9rem;
  color: #4d5b70;
}

.data-table__wrapper {
  overflow: auto;
  border: 1px solid #d6dce4;
  border-radius: 0.5rem;
}

.data-table table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  text-align: left;
  padding: 0.7rem 0.8rem;
  border-bottom: 1px solid #e7edf3;
}

.data-table__sort {
  border: 0;
  background: transparent;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
}

.data-table__pagination {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
}

.data-table__pagination button {
  border: 1px solid #c9d2dd;
  background: #fff;
  border-radius: 0.4rem;
  padding: 0.35rem 0.6rem;
  cursor: pointer;
}

.data-table__pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
$q$);
INSERT INTO components (framework, component, version, author_name, component_number) VALUES ('react', 'file-uploader', '1.0.0', 'Darrell', 'CMP-204');
INSERT INTO component_files (component_id, filename, content) VALUES ((SELECT id FROM components WHERE framework='react' AND component='file-uploader'), 'file-uploader.css', $q$.file-uploader {
  display: grid;
  gap: 0.8rem;
}

.file-uploader__dropzone {
  display: grid;
  gap: 0.35rem;
  justify-items: center;
  text-align: center;
  border: 2px dashed #c3cfdd;
  border-radius: 0.65rem;
  background: #f7f9fc;
  padding: 1.2rem;
  cursor: pointer;
}

.file-uploader__dropzone.is-active {
  border-color: #1655d1;
  background: #eef3ff;
}

.file-uploader__input {
  display: none;
}

.file-uploader__error {
  margin: 0;
  color: #ba1a1a;
}

.file-uploader__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.4rem;
}

.file-uploader__list li {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 0.6rem;
  align-items: center;
  border: 1px solid #dde4ec;
  border-radius: 0.45rem;
  padding: 0.5rem 0.6rem;
}

.file-uploader__list button {
  border: 1px solid #c9d2dd;
  background: #fff;
  border-radius: 0.4rem;
  padding: 0.2rem 0.5rem;
  cursor: pointer;
}

.file-uploader__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.file-uploader__footer button {
  border: 1px solid #1655d1;
  background: #1655d1;
  color: #fff;
  border-radius: 0.45rem;
  padding: 0.35rem 0.75rem;
  cursor: pointer;
}

.file-uploader__footer button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
$q$);
INSERT INTO component_files (component_id, filename, content) VALUES ((SELECT id FROM components WHERE framework='react' AND component='file-uploader'), 'file-uploader.jsx', $q$// react/file-uploader | version: 1.0.0 | author: Darrell | number: CMP-204
import React, { useMemo, useState } from "react";

function toMb(bytes) {
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function FileUploaderComponent({
  accept = "",
  multiple = true,
  maxSizeMb = 5,
  onFilesChange,
  onUpload
}) {
  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");
  const maxBytes = maxSizeMb * 1024 * 1024;

  const totalSize = useMemo(
    () => files.reduce((sum, file) => sum + file.size, 0),
    [files]
  );

  function addFiles(fileList) {
    const nextFiles = Array.from(fileList || []);
    const oversized = nextFiles.find((file) => file.size > maxBytes);
    if (oversized) {
      setError(`${oversized.name} exceeds ${maxSizeMb} MB`);
      return;
    }
    setError("");
    setFiles((current) => {
      const merged = multiple ? [...current, ...nextFiles] : nextFiles.slice(0, 1);
      onFilesChange?.(merged);
      return merged;
    });
  }

  function removeFile(targetName) {
    setFiles((current) => {
      const next = current.filter((file) => file.name !== targetName);
      onFilesChange?.(next);
      return next;
    });
  }

  return (
    <section className="file-uploader">
      <label
        className={`file-uploader__dropzone${dragActive ? " is-active" : ""}`}
        onDragEnter={(event) => {
          event.preventDefault();
          setDragActive(true);
        }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={(event) => {
          event.preventDefault();
          setDragActive(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setDragActive(false);
          addFiles(event.dataTransfer.files);
        }}
      >
        <input
          type="file"
          className="file-uploader__input"
          accept={accept}
          multiple={multiple}
          onChange={(event) => addFiles(event.target.files)}
        />
        <strong>Drop files here or click to browse</strong>
        <small>Max file size: {maxSizeMb} MB</small>
      </label>

      {error ? <p className="file-uploader__error">{error}</p> : null}

      <ul className="file-uploader__list">
        {files.map((file) => (
          <li key={file.name}>
            <span>{file.name}</span>
            <small>{toMb(file.size)}</small>
            <button type="button" onClick={() => removeFile(file.name)}>
              Remove
            </button>
          </li>
        ))}
      </ul>

      <footer className="file-uploader__footer">
        <span>{files.length} file(s), {toMb(totalSize)} total</span>
        <button type="button" disabled={!files.length} onClick={() => onUpload?.(files)}>
          Upload
        </button>
      </footer>
    </section>
  );
}
$q$);
INSERT INTO component_files (component_id, filename, content) VALUES ((SELECT id FROM components WHERE framework='react' AND component='file-uploader'), 'file-uploader.scss', $q$.file-uploader {
  display: grid;
  gap: 0.8rem;
}

.file-uploader__dropzone {
  display: grid;
  gap: 0.35rem;
  justify-items: center;
  text-align: center;
  border: 2px dashed #c3cfdd;
  border-radius: 0.65rem;
  background: #f7f9fc;
  padding: 1.2rem;
  cursor: pointer;
}

.file-uploader__dropzone.is-active {
  border-color: #1655d1;
  background: #eef3ff;
}

.file-uploader__input {
  display: none;
}

.file-uploader__error {
  margin: 0;
  color: #ba1a1a;
}

.file-uploader__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.4rem;
}

.file-uploader__list li {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 0.6rem;
  align-items: center;
  border: 1px solid #dde4ec;
  border-radius: 0.45rem;
  padding: 0.5rem 0.6rem;
}

.file-uploader__list button {
  border: 1px solid #c9d2dd;
  background: #fff;
  border-radius: 0.4rem;
  padding: 0.2rem 0.5rem;
  cursor: pointer;
}

.file-uploader__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.file-uploader__footer button {
  border: 1px solid #1655d1;
  background: #1655d1;
  color: #fff;
  border-radius: 0.45rem;
  padding: 0.35rem 0.75rem;
  cursor: pointer;
}

.file-uploader__footer button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
$q$);
INSERT INTO components (framework, component, version, author_name, component_number) VALUES ('react', 'modal-dialog', '1.0.0', 'Darrell', 'CMP-201');
INSERT INTO component_files (component_id, filename, content) VALUES ((SELECT id FROM components WHERE framework='react' AND component='modal-dialog'), 'modal-dialog.css', $q$.modal-dialog {
  position: fixed;
  inset: 0;
  z-index: 1200;
  display: grid;
  place-items: center;
  background: rgba(0, 0, 0, 0.48);
  padding: 1.5rem;
}

.modal-dialog__panel {
  width: min(100%, 40rem);
  background: #ffffff;
  border-radius: 0.75rem;
  box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.24);
  outline: none;
}

.modal-dialog__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #eceff3;
  padding: 1rem 1.25rem;
}

.modal-dialog__title {
  margin: 0;
  font-size: 1.1rem;
}

.modal-dialog__close {
  border: 0;
  background: transparent;
  font-size: 1rem;
  cursor: pointer;
}

.modal-dialog__body {
  padding: 1.25rem;
}

.modal-dialog__footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  border-top: 1px solid #eceff3;
  padding: 0.9rem 1.25rem;
}
$q$);
INSERT INTO component_files (component_id, filename, content) VALUES ((SELECT id FROM components WHERE framework='react' AND component='modal-dialog'), 'modal-dialog.jsx', $q$// react/modal-dialog | version: 1.0.0 | author: Darrell | number: CMP-201
import React, { useEffect, useRef } from "react";

export default function ModalDialogComponent({
  isOpen,
  title = "Dialog",
  children,
  onClose,
  actions = null,
  closeOnBackdrop = true,
  closeOnEsc = true
}) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!isOpen || !closeOnEsc) return undefined;

    function onKeyDown(event) {
      if (event.key === "Escape") onClose?.();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, closeOnEsc, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    dialogRef.current?.focus();
  }, [isOpen]);

  if (!isOpen) return null;

  function handleBackdropClick(event) {
    if (!closeOnBackdrop) return;
    if (event.target === event.currentTarget) onClose?.();
  }

  return (
    <div className="modal-dialog" onMouseDown={handleBackdropClick}>
      <section
        className="modal-dialog__panel"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        ref={dialogRef}
      >
        <header className="modal-dialog__header">
          <h2 className="modal-dialog__title">{title}</h2>
          <button type="button" className="modal-dialog__close" onClick={() => onClose?.()} aria-label="Close">
            x
          </button>
        </header>
        <div className="modal-dialog__body">{children}</div>
        {actions ? <footer className="modal-dialog__footer">{actions}</footer> : null}
      </section>
    </div>
  );
}
$q$);
INSERT INTO component_files (component_id, filename, content) VALUES ((SELECT id FROM components WHERE framework='react' AND component='modal-dialog'), 'modal-dialog.scss', $q$.modal-dialog {
  position: fixed;
  inset: 0;
  z-index: 1200;
  display: grid;
  place-items: center;
  background: rgba(0, 0, 0, 0.48);
  padding: 1.5rem;
}

.modal-dialog__panel {
  width: min(100%, 40rem);
  background: #ffffff;
  border-radius: 0.75rem;
  box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.24);
  outline: none;
}

.modal-dialog__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #eceff3;
  padding: 1rem 1.25rem;
}

.modal-dialog__title {
  margin: 0;
  font-size: 1.1rem;
}

.modal-dialog__close {
  border: 0;
  background: transparent;
  font-size: 1rem;
  cursor: pointer;
}

.modal-dialog__body {
  padding: 1.25rem;
}

.modal-dialog__footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  border-top: 1px solid #eceff3;
  padding: 0.9rem 1.25rem;
}
$q$);
INSERT INTO components (framework, component, version, author_name, component_number) VALUES ('react', 'my-component', '1.0.0', 'Darrell', 'cmp-001');
INSERT INTO component_files (component_id, filename, content) VALUES ((SELECT id FROM components WHERE framework='react' AND component='my-component'), 'my-component.jsx', $q$// react/my-component | version: 1.0.0 | author: Darrell | number: cmp-001
import React from "react";

export default function MyComponentComponent() {
  return (
    <section className="my-component">
      <h2>My Component</h2>
      <p>React My Component scaffold.</p>
      <small>v1.0.0 - Darrell - cmp-001</small>
    </section>
  );
}
$q$);
INSERT INTO component_files (component_id, filename, content) VALUES ((SELECT id FROM components WHERE framework='react' AND component='my-component'), 'my-component.scss', $q$.my-component {
  display: grid;
  gap: 0.5rem;
}
$q$);
INSERT INTO components (framework, component, version, author_name, component_number) VALUES ('react', 'pagination-controls', '1.0.0', 'Darrell', 'CMP-203');
INSERT INTO component_files (component_id, filename, content) VALUES ((SELECT id FROM components WHERE framework='react' AND component='pagination-controls'), 'pagination-controls.css', $q$.pagination-controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35rem;
}

.pagination-controls button {
  border: 1px solid #c9d2dd;
  background: #ffffff;
  border-radius: 0.45rem;
  padding: 0.35rem 0.6rem;
  cursor: pointer;
}

.pagination-controls button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.pagination-controls button.is-active {
  border-color: #1655d1;
  background: #1655d1;
  color: #ffffff;
}

.pagination-controls__dots {
  padding: 0 0.3rem;
  color: #627286;
}
$q$);
INSERT INTO component_files (component_id, filename, content) VALUES ((SELECT id FROM components WHERE framework='react' AND component='pagination-controls'), 'pagination-controls.jsx', $q$// react/pagination-controls | version: 1.0.0 | author: Darrell | number: CMP-203
import React from "react";

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function buildPageWindow(page, totalPages, maxVisible) {
  const visible = Math.max(3, maxVisible);
  const half = Math.floor(visible / 2);
  const start = clamp(page - half, 1, Math.max(1, totalPages - visible + 1));
  const end = Math.min(totalPages, start + visible - 1);
  return { start, end };
}

export default function PaginationControlsComponent({
  page = 1,
  totalPages = 1,
  maxVisible = 7,
  onPageChange
}) {
  if (totalPages <= 1) return null;

  const { start, end } = buildPageWindow(page, totalPages, maxVisible);
  const pageNumbers = [];
  for (let current = start; current <= end; current += 1) {
    pageNumbers.push(current);
  }

  return (
    <nav className="pagination-controls" aria-label="Pagination">
      <button type="button" disabled={page <= 1} onClick={() => onPageChange?.(page - 1)}>
        Previous
      </button>
      {start > 1 ? <button type="button" onClick={() => onPageChange?.(1)}>1</button> : null}
      {start > 2 ? <span className="pagination-controls__dots">...</span> : null}
      {pageNumbers.map((pageNumber) => (
        <button
          key={pageNumber}
          type="button"
          className={pageNumber === page ? "is-active" : ""}
          onClick={() => onPageChange?.(pageNumber)}
          aria-current={pageNumber === page ? "page" : undefined}
        >
          {pageNumber}
        </button>
      ))}
      {end < totalPages - 1 ? <span className="pagination-controls__dots">...</span> : null}
      {end < totalPages ? <button type="button" onClick={() => onPageChange?.(totalPages)}>{totalPages}</button> : null}
      <button type="button" disabled={page >= totalPages} onClick={() => onPageChange?.(page + 1)}>
        Next
      </button>
    </nav>
  );
}
$q$);
INSERT INTO component_files (component_id, filename, content) VALUES ((SELECT id FROM components WHERE framework='react' AND component='pagination-controls'), 'pagination-controls.scss', $q$.pagination-controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35rem;
}

.pagination-controls button {
  border: 1px solid #c9d2dd;
  background: #ffffff;
  border-radius: 0.45rem;
  padding: 0.35rem 0.6rem;
  cursor: pointer;
}

.pagination-controls button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.pagination-controls button.is-active {
  border-color: #1655d1;
  background: #1655d1;
  color: #ffffff;
}

.pagination-controls__dots {
  padding: 0 0.3rem;
  color: #627286;
}
$q$);
INSERT INTO components (framework, component, version, author_name, component_number) VALUES ('react', 'searchable-tag-picker', '0.0.3', 'Darrell Parkhouse', 'cmp-005');
INSERT INTO component_files (component_id, filename, content) VALUES ((SELECT id FROM components WHERE framework='react' AND component='searchable-tag-picker'), 'searchable-tag-picker.jsx', $q$// react/searchable-tag-picker | version: 0.0.3 | author: Darrell Parkhouse | number: cmp-005
import React from "react";

export default function SearchableTagPickerComponent() {
  return (
    <section className="searchable-tag-picker">
      <h2>Searchable Tag Picker</h2>
      <p>React Searchable Tag Picker scaffold.</p>
      <small>v0.0.3 - Darrell Parkhouse - cmp-005</small>
    </section>
  );
}
$q$);
INSERT INTO component_files (component_id, filename, content) VALUES ((SELECT id FROM components WHERE framework='react' AND component='searchable-tag-picker'), 'searchable-tag-picker.scss', $q$.searchable-tag-picker {
  display: grid;
  gap: 0.5rem;
}
$q$);
INSERT INTO components (framework, component, version, author_name, component_number) VALUES ('react', 'test', '1.0.0', 'Darrell Parkhouse', 'N/A');
INSERT INTO component_files (component_id, filename, content) VALUES ((SELECT id FROM components WHERE framework='react' AND component='test'), 'test.html', $q$<!-- react/test | version: 1.0.0 | author: Darrell Parkhouse | number: N/A -->
<section class="test">
  <h2>Test</h2>
  <p>react Test scaffold.</p>
  <small>v1.0.0 - Darrell Parkhouse - N/A</small>
</section>
$q$);
INSERT INTO component_files (component_id, filename, content) VALUES ((SELECT id FROM components WHERE framework='react' AND component='test'), 'test.js', $q$// react/test | version: 1.0.0 | author: Darrell Parkhouse | number: N/A
export function test() {
  return "react:test";
}
$q$);
INSERT INTO component_files (component_id, filename, content) VALUES ((SELECT id FROM components WHERE framework='react' AND component='test'), 'test.scss', $q$.test {
  display: grid;
  gap: 0.5rem;
}
$q$);
INSERT INTO components (framework, component, version, author_name, component_number) VALUES ('react', 'test-component', '0.0.4', 'olivia-rhye', 'cmp-001');
INSERT INTO component_files (component_id, filename, content) VALUES ((SELECT id FROM components WHERE framework='react' AND component='test-component'), 'test-component.jsx', $q$// react/test-component | version: 0.0.4 | author: olivia-rhye | number: cmp-001
import React from "react";

export default function TestComponentComponent() {
  return (
    <section className="test-component">
      <h2>Test Component</h2>
      <p>React Test Component scaffold.</p>
      <small>v0.0.4 - olivia-rhye - cmp-001</small>
    </section>
  );
}
$q$);
INSERT INTO component_files (component_id, filename, content) VALUES ((SELECT id FROM components WHERE framework='react' AND component='test-component'), 'test-component.scss', $q$.test-component {
  display: grid;
  gap: 0.5rem;
}
$q$);
INSERT INTO components (framework, component, version, author_name, component_number) VALUES ('react', 'toast-notification', '1.0.0', 'Darrell', 'CMP-205');
INSERT INTO component_files (component_id, filename, content) VALUES ((SELECT id FROM components WHERE framework='react' AND component='toast-notification'), 'toast-notification.css', $q$.toast-notification {
  position: fixed;
  z-index: 1300;
  display: grid;
  gap: 0.55rem;
  width: min(100vw - 2rem, 22rem);
}

.toast-notification--top-right {
  top: 1rem;
  right: 1rem;
}

.toast-notification--top-left {
  top: 1rem;
  left: 1rem;
}

.toast-notification--bottom-right {
  bottom: 1rem;
  right: 1rem;
}

.toast-notification--bottom-left {
  bottom: 1rem;
  left: 1rem;
}

.toast-notification__item {
  border: 1px solid #d8e1ec;
  background: #ffffff;
  border-radius: 0.6rem;
  padding: 0.75rem 0.8rem;
  box-shadow: 0 0.5rem 1.2rem rgba(19, 32, 55, 0.12);
}

.toast-notification__item h4 {
  margin: 0 0 0.35rem;
  font-size: 0.96rem;
}

.toast-notification__item p {
  margin: 0 0 0.55rem;
}

.toast-notification__item button {
  border: 1px solid #c9d2dd;
  background: #fff;
  border-radius: 0.4rem;
  padding: 0.2rem 0.55rem;
  cursor: pointer;
}

.toast-notification__item--success {
  border-color: #6fbf8d;
}

.toast-notification__item--warning {
  border-color: #d9b166;
}

.toast-notification__item--error {
  border-color: #d18383;
}
$q$);
INSERT INTO component_files (component_id, filename, content) VALUES ((SELECT id FROM components WHERE framework='react' AND component='toast-notification'), 'toast-notification.jsx', $q$// react/toast-notification | version: 1.0.0 | author: Darrell | number: CMP-205
import React, { useEffect } from "react";

export default function ToastNotificationComponent({
  toasts = [],
  onDismiss,
  autoCloseMs = 4000,
  position = "top-right"
}) {
  useEffect(() => {
    if (!toasts.length || !Number.isFinite(autoCloseMs) || autoCloseMs <= 0) return undefined;

    const timers = toasts
      .filter((toast) => toast?.id != null)
      .map((toast) =>
        window.setTimeout(() => {
          onDismiss?.(toast.id);
        }, autoCloseMs)
      );

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [toasts, autoCloseMs, onDismiss]);

  if (!toasts.length) return null;

  return (
    <aside className={`toast-notification toast-notification--${position}`} role="status" aria-live="polite">
      {toasts.map((toast) => {
        const tone = toast.type || "info";
        return (
          <article key={toast.id} className={`toast-notification__item toast-notification__item--${tone}`}>
            {toast.title ? <h4>{toast.title}</h4> : null}
            <p>{toast.message}</p>
            <button type="button" onClick={() => onDismiss?.(toast.id)} aria-label="Dismiss notification">
              Dismiss
            </button>
          </article>
        );
      })}
    </aside>
  );
}
$q$);
INSERT INTO component_files (component_id, filename, content) VALUES ((SELECT id FROM components WHERE framework='react' AND component='toast-notification'), 'toast-notification.scss', $q$.toast-notification {
  position: fixed;
  z-index: 1300;
  display: grid;
  gap: 0.55rem;
  width: min(100vw - 2rem, 22rem);
}

.toast-notification--top-right {
  top: 1rem;
  right: 1rem;
}

.toast-notification--top-left {
  top: 1rem;
  left: 1rem;
}

.toast-notification--bottom-right {
  bottom: 1rem;
  right: 1rem;
}

.toast-notification--bottom-left {
  bottom: 1rem;
  left: 1rem;
}

.toast-notification__item {
  border: 1px solid #d8e1ec;
  background: #ffffff;
  border-radius: 0.6rem;
  padding: 0.75rem 0.8rem;
  box-shadow: 0 0.5rem 1.2rem rgba(19, 32, 55, 0.12);
}

.toast-notification__item h4 {
  margin: 0 0 0.35rem;
  font-size: 0.96rem;
}

.toast-notification__item p {
  margin: 0 0 0.55rem;
}

.toast-notification__item button {
  border: 1px solid #c9d2dd;
  background: #fff;
  border-radius: 0.4rem;
  padding: 0.2rem 0.55rem;
  cursor: pointer;
}

.toast-notification__item--success {
  border-color: #6fbf8d;
}

.toast-notification__item--warning {
  border-color: #d9b166;
}

.toast-notification__item--error {
  border-color: #d18383;
}
$q$);
INSERT INTO components (framework, component, version, author_name, component_number) VALUES ('vanilla', 'another-simple-test', '1.0.0', 'Darrell Parkhouse', 'N/A');
INSERT INTO component_files (component_id, filename, content) VALUES ((SELECT id FROM components WHERE framework='vanilla' AND component='another-simple-test'), 'another-simple-test.html', $q$<!-- vanilla/another-simple-test | version: 1.0.0 | author: Darrell Parkhouse | number: N/A -->
<section class="another-simple-test">
  <h2>Another Simple Test</h2>
  <p>vanilla Another Simple Test scaffold.</p>
  <small>v1.0.0 - Darrell Parkhouse - N/A</small>
</section>
$q$);
INSERT INTO component_files (component_id, filename, content) VALUES ((SELECT id FROM components WHERE framework='vanilla' AND component='another-simple-test'), 'another-simple-test.js', $q$// vanilla/another-simple-test | version: 1.0.0 | author: Darrell Parkhouse | number: N/A
export function another_simple_test() {
  return "vanilla:another-simple-test";
}
$q$);
INSERT INTO component_files (component_id, filename, content) VALUES ((SELECT id FROM components WHERE framework='vanilla' AND component='another-simple-test'), 'another-simple-test.scss', $q$.another-simple-test {
  display: grid;
  gap: 0.5rem;
}
$q$);
INSERT INTO components (framework, component, version, author_name, component_number) VALUES ('vanilla', 'simple-component', '1.0.0', 'Darrell Parkhouse', 'N/A');
INSERT INTO component_files (component_id, filename, content) VALUES ((SELECT id FROM components WHERE framework='vanilla' AND component='simple-component'), 'simple-component.html', $q$<!-- vanilla/simple-component | version: 1.0.0 | author: Darrell Parkhouse | number: N/A -->
<section class="simple-component">
  <h2>Simple Component</h2>
  <p>vanilla Simple Component scaffold.</p>
  <small>v1.0.0 - Darrell Parkhouse - N/A</small>
</section>
$q$);
INSERT INTO component_files (component_id, filename, content) VALUES ((SELECT id FROM components WHERE framework='vanilla' AND component='simple-component'), 'simple-component.js', $q$// vanilla/simple-component | version: 1.0.0 | author: Darrell Parkhouse | number: N/A
export function simple_component() {
  return "vanilla:simple-component";
}
$q$);
INSERT INTO component_files (component_id, filename, content) VALUES ((SELECT id FROM components WHERE framework='vanilla' AND component='simple-component'), 'simple-component.scss', $q$.simple-component {
  display: grid;
  gap: 0.5rem;
}
$q$);
INSERT INTO components (framework, component, version, author_name, component_number) VALUES ('vanilla', 'user-table', '1.0.0', 'Unknown', 'N/A');
INSERT INTO component_files (component_id, filename, content) VALUES ((SELECT id FROM components WHERE framework='vanilla' AND component='user-table'), 'user-table-min.js', $q$const USERS=[{name:"Ava Martinez",role:"Frontend Engineer",email:"ava@kaylios.dev",status:"Active"},{name:"Noah Patel",role:"Backend Engineer",email:"noah@kaylios.dev",status:"Active"},{name:"Mia Johnson",role:"Product Designer",email:"mia@kaylios.dev",status:"Away"},{name:"Liam Chen",role:"QA Engineer",email:"liam@kaylios.dev",status:"Active"},{name:"Emma Wilson",role:"Product Manager",email:"emma@kaylios.dev",status:"Offline"},{name:"Lucas Rivera",role:"DevOps Engineer",email:"lucas@kaylios.dev",status:"Active"}];function compareValues(e,t){return e.localeCompare(t,void 0,{sensitivity:"base"})}function createRow(e){const t=document.createElement("tr");return t.innerHTML=`\n    <td>${e.name}</td>\n    <td>${e.role}</td>\n    <td><a href="mailto:${e.email}">${e.email}</a></td>\n    <td><span class="user-table__status user-table__status--${e.status.toLowerCase()}">${e.status}</span></td>\n  `,t}export function mountUserTable(e=document.querySelector("[data-user-table]")){if(!e)return;const t=e.querySelector("[data-user-table-search]"),a=e.querySelector("[data-user-table-body]"),n=e.querySelector("[data-user-table-empty]"),r=Array.from(e.querySelectorAll("[data-sort-key]"));if(!(t&&a&&n&&r.length))return;let s="",o="name",i="asc";function l(){const e=function(){const e=USERS.filter((e=>`${e.name} ${e.role} ${e.email} ${e.status}`.toLowerCase().includes(s)));return e.sort(((e,t)=>{const a=compareValues(String(e[o]),String(t[o]));return"asc"===i?a:-a})),e}();a.textContent="",e.forEach((e=>a.appendChild(createRow(e)))),n.hidden=e.length>0,r.forEach((e=>{const t=e.dataset.sortKey===o,a=t?i:"none";e.setAttribute("aria-sort",a),e.dataset.active=String(t)}))}t.addEventListener("input",(()=>{s=t.value.trim().toLowerCase(),l()})),r.forEach((e=>{e.addEventListener("click",(()=>{const t=e.dataset.sortKey;t&&(t===o?i="asc"===i?"desc":"asc":(o=t,i="asc"),l())}))})),l()}export function user_table(){return mountUserTable(),"mounted:user-table"}$q$);
INSERT INTO component_files (component_id, filename, content) VALUES ((SELECT id FROM components WHERE framework='vanilla' AND component='user-table'), 'user-table.css', $q$.user-table {
  display: grid;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  background: #ffffff;
  color: #0f172a;
}

.user-table__header {
  display: grid;
  gap: 0.5rem;
}

.user-table__title {
  margin: 0;
  font-size: 1.1rem;
}

.user-table__subtitle {
  margin: 0;
  color: #64748b;
  font-size: 0.9rem;
}

.user-table__search-label {
  font-size: 0.8rem;
  color: #334155;
}

.user-table__search {
  width: 100%;
  border: 1px solid #cbd5e1;
  border-radius: 0.5rem;
  padding: 0.55rem 0.7rem;
  font-size: 0.9rem;
}

.user-table__wrap {
  overflow-x: auto;
}

.user-table__table {
  width: 100%;
  border-collapse: collapse;
  min-width: 40rem;
}

.user-table__table th,
.user-table__table td {
  text-align: left;
  padding: 0.65rem 0.6rem;
  border-bottom: 1px solid #e2e8f0;
  font-size: 0.9rem;
}

.user-table__sort {
  border: 0;
  background: transparent;
  padding: 0;
  font: inherit;
  font-weight: 700;
  color: #1e293b;
  cursor: pointer;
}

.user-table__sort[data-active=true] {
  color: #1d4ed8;
}

.user-table__status {
  display: inline-block;
  padding: 0.2rem 0.5rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
}

.user-table__status--active {
  background: #dcfce7;
  color: #166534;
}

.user-table__status--away {
  background: #fef9c3;
  color: #854d0e;
}

.user-table__status--offline {
  background: #e2e8f0;
  color: #334155;
}

.user-table__empty {
  margin: 0;
  color: #64748b;
  font-size: 0.9rem;
}
$q$);
INSERT INTO component_files (component_id, filename, content) VALUES ((SELECT id FROM components WHERE framework='vanilla' AND component='user-table'), 'user-table.html', $q$<!-- vanilla/user-table | production-ready interactive table -->
<section class="user-table" data-user-table>
  <header class="user-table__header">
    <div>
      <h2 class="user-table__title">Team Directory</h2>
      <p class="user-table__subtitle">Search and sort active users.</p>
    </div>
    <label class="user-table__search-label" for="user-table-search">Search</label>
    <input
      id="user-table-search"
      class="user-table__search"
      type="search"
      placeholder="Search name, role, or email"
      autocomplete="off"
      data-user-table-search
    >
  </header>

  <div class="user-table__wrap">
    <table class="user-table__table" aria-label="User directory table">
      <thead>
        <tr>
          <th scope="col"><button type="button" class="user-table__sort" data-sort-key="name">Name</button></th>
          <th scope="col"><button type="button" class="user-table__sort" data-sort-key="role">Role</button></th>
          <th scope="col"><button type="button" class="user-table__sort" data-sort-key="email">Email</button></th>
          <th scope="col"><button type="button" class="user-table__sort" data-sort-key="status">Status</button></th>
        </tr>
      </thead>
      <tbody data-user-table-body></tbody>
    </table>
  </div>

  <p class="user-table__empty" data-user-table-empty hidden>No users match your search.</p>
</section>
$q$);
INSERT INTO component_files (component_id, filename, content) VALUES ((SELECT id FROM components WHERE framework='vanilla' AND component='user-table'), 'user-table.js', $q$const USERS = [
  { name: "Ava Martinez", role: "Frontend Engineer", email: "ava@kaylios.dev", status: "Active" },
  { name: "Noah Patel", role: "Backend Engineer", email: "noah@kaylios.dev", status: "Active" },
  { name: "Mia Johnson", role: "Product Designer", email: "mia@kaylios.dev", status: "Away" },
  { name: "Liam Chen", role: "QA Engineer", email: "liam@kaylios.dev", status: "Active" },
  { name: "Emma Wilson", role: "Product Manager", email: "emma@kaylios.dev", status: "Offline" },
  { name: "Lucas Rivera", role: "DevOps Engineer", email: "lucas@kaylios.dev", status: "Active" }
];

function compareValues(a, b) {
  return a.localeCompare(b, undefined, { sensitivity: "base" });
}

function createRow(user) {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td>${user.name}</td>
    <td>${user.role}</td>
    <td><a href="mailto:${user.email}">${user.email}</a></td>
    <td><span class="user-table__status user-table__status--${user.status.toLowerCase()}">${user.status}</span></td>
  `;
  return tr;
}

export function mountUserTable(root = document.querySelector("[data-user-table]")) {
  if (!root) return;

  const searchInput = root.querySelector("[data-user-table-search]");
  const body = root.querySelector("[data-user-table-body]");
  const emptyState = root.querySelector("[data-user-table-empty]");
  const sortButtons = Array.from(root.querySelectorAll("[data-sort-key]"));

  if (!searchInput || !body || !emptyState || !sortButtons.length) return;

  let query = "";
  let sortKey = "name";
  let sortDirection = "asc";

  function getVisibleUsers() {
    const filtered = USERS.filter((user) => {
      const haystack = `${user.name} ${user.role} ${user.email} ${user.status}`.toLowerCase();
      return haystack.includes(query);
    });

    filtered.sort((left, right) => {
      const keyA = String(left[sortKey]);
      const keyB = String(right[sortKey]);
      const result = compareValues(keyA, keyB);
      return sortDirection === "asc" ? result : -result;
    });

    return filtered;
  }

  function render() {
    const users = getVisibleUsers();
    body.textContent = "";
    users.forEach((user) => body.appendChild(createRow(user)));
    emptyState.hidden = users.length > 0;

    sortButtons.forEach((button) => {
      const key = button.dataset.sortKey;
      const active = key === sortKey;
      const dir = active ? sortDirection : "none";
      button.setAttribute("aria-sort", dir);
      button.dataset.active = String(active);
    });
  }

  searchInput.addEventListener("input", () => {
    query = searchInput.value.trim().toLowerCase();
    render();
  });

  sortButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const nextKey = button.dataset.sortKey;
      if (!nextKey) return;
      if (nextKey === sortKey) {
        sortDirection = sortDirection === "asc" ? "desc" : "asc";
      } else {
        sortKey = nextKey;
        sortDirection = "asc";
      }
      render();
    });
  });

  render();
}

// Backward-compatible export used by previous scaffolds.
export function user_table() {
  mountUserTable();
  return "mounted:user-table";
}
$q$);
INSERT INTO component_files (component_id, filename, content) VALUES ((SELECT id FROM components WHERE framework='vanilla' AND component='user-table'), 'user-table.scss', $q$.user-table {
  display: grid;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  background: #ffffff;
  color: #0f172a;
}

.user-table__header {
  display: grid;
  gap: 0.5rem;
}

.user-table__title {
  margin: 0;
  font-size: 1.1rem;
}

.user-table__subtitle {
  margin: 0;
  color: #64748b;
  font-size: 0.9rem;
}

.user-table__search-label {
  font-size: 0.8rem;
  color: #334155;
}

.user-table__search {
  width: 100%;
  border: 1px solid #cbd5e1;
  border-radius: 0.5rem;
  padding: 0.55rem 0.7rem;
  font-size: 0.9rem;
}

.user-table__wrap {
  overflow-x: auto;
}

.user-table__table {
  width: 100%;
  border-collapse: collapse;
  min-width: 40rem;
}

.user-table__table th,
.user-table__table td {
  text-align: left;
  padding: 0.65rem 0.6rem;
  border-bottom: 1px solid #e2e8f0;
  font-size: 0.9rem;
}

.user-table__sort {
  border: 0;
  background: transparent;
  padding: 0;
  font: inherit;
  font-weight: 700;
  color: #1e293b;
  cursor: pointer;
}

.user-table__sort[data-active="true"] {
  color: #1d4ed8;
}

.user-table__status {
  display: inline-block;
  padding: 0.2rem 0.5rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
}

.user-table__status--active {
  background: #dcfce7;
  color: #166534;
}

.user-table__status--away {
  background: #fef9c3;
  color: #854d0e;
}

.user-table__status--offline {
  background: #e2e8f0;
  color: #334155;
}

.user-table__empty {
  margin: 0;
  color: #64748b;
  font-size: 0.9rem;
}
$q$);
COMMIT;
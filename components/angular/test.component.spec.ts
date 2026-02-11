// angular/test | version: 1.0.0 | author: Darrell Parkhouse | number: N/A
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

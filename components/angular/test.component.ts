// angular/test | version: 1.0.0 | author: Darrell Parkhouse | number: N/A
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

import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AppComponent } from "./app.component";
import { SubmitRequestComponent } from "./submit-request/submit-request.component";
import { SearchRequestComponent } from "./search-request/search-request.component";
import { MainComponentComponent } from "./main-component/main-component.component";

const routes: Routes = [
  { path: "", redirectTo: "/main/submit", pathMatch: "full" },
  // { path: "", component: MainComponentComponent }, //clutter
  {
    path: "main",
    component: MainComponentComponent,
    children: [
      { path: "submit", component: SubmitRequestComponent },
      { path: "search", component: SearchRequestComponent }
    ]
  }
  //{ path: "main/submit", component: SubmitRequestComponent }, //clutter
  //{ path: "main/search", component: SubmitRequestComponent } //clutter
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

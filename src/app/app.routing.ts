import { NativeScriptRouterModule } from "nativescript-angular/router";
import { Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { SpeechOutputComponent } from "./speechoutput/speechoutput.component";

const routes: Routes = [
    {path: "", component: SpeechOutputComponent, pathMatch: "full"}
]

@NgModule({
    imports: [
        NativeScriptRouterModule.forRoot(routes)
    ],
    exports: [
        NativeScriptRouterModule
    ]
})
export class RouterModule {}
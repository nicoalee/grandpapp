import { Injectable } from "@angular/core";
import * as Permissions from "nativescript-permissions";
import { Observable, from } from 'rxjs';

declare var android

@Injectable({
    providedIn: "root"
})
export class PermissionService {

    public getAudioPermission(): Observable<any> {

        return from(
            Permissions.requestPermission(
                android.Manifest.permission.RECORD_AUDIO,
                "Need to record audio"
            )
        )
    }

    
}
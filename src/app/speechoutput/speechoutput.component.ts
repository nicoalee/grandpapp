import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import {SpeechRecognitionService} from './speechRecognition.service'
import { PermissionService } from './permission.service'
import { ScrollView } from "tns-core-modules/ui/scroll-view";

@Component({ 
    selector: "app-speech-output",
    templateUrl: "./speechoutput.component.html",
    styleUrls: ["./speechoutput.component.css"
    ]
})
export class SpeechOutputComponent implements OnInit {

    @ViewChild("scrollView", {static: false}) scrollView: ElementRef
    @ViewChild("textView", {static: false}) textView: ElementRef

    ngOnInit(): void {
        
        this._speechService._subject$.subscribe(
            (data) => {
                this.textInput = data
                this.scrollView.nativeElement.scrollToVerticalOffset(this.textView.nativeElement.getMeasuredHeight(), true)

            }
        )

        this._speechService._micSubject$.subscribe(
            (data: boolean) => {
                this._micOn$ = data
            }
        )
    }



    public _micOn$: boolean = false

    fontSize: number = 20

    textInput = "Text output here...";

    constructor(
        private _speechService: SpeechRecognitionService,
        private _permission: PermissionService) {

    }

    onListen() {
        this._permission.getAudioPermission()
            .subscribe(
            (data) => {
                console.log("GOT PERMISSION!");
                
                this._speechService.checkAvailability()
                    .subscribe(
                        (data) => {

                            console.log("AVAILABLE!");
                            
                            if(!this._micOn$) {
                                this._speechService.startListening()
                                    .subscribe(
                                        (data) => {
                                            this._micOn$ = true
                                            console.log("NOW LISTENING: " + data);
                                        },
                                        (err) => {
                                            this._micOn$ = false
                                            console.error("COULDN'T LISTEN");
                                            throw new Error(err)
                                        }
                                    )
                            } else {
                                this._speechService.stopListening()
                                    .subscribe(
                                        (data) => {
                                            this._micOn$ = false
                                            console.log("NOW LISTENING: " + data);
                                        },
                                        (err) => {
                                            this._micOn$ = false
                                            console.error("COULDNT STOP LISTENING");
                                            throw new Error(err)
                                        }
                                    )
                            }
                        },
                        (err) => {
                            this._micOn$ = false
                            console.error("NOT AVAILABLE");
                            throw new Error(err)
                        }
                    )
            }, 
            (err) => {
                this._micOn$ = false
                console.error("DID NOT GET PERMISSION");
                
                throw new Error(err)
            })
    }

    fontSmaller(): void {
        if(this.fontSize > 10) {
            this.fontSize -= 5
        }
    }

    fontBigger(): void {
        if(this.fontSize < 90) {
            this.fontSize += 5
        }
    }
}
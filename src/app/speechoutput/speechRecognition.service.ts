import { Injectable, NgZone } from "@angular/core";
import { SpeechRecognition, SpeechRecognitionTranscription } from "nativescript-speech-recognition"
import { Observable, from, Subject, BehaviorSubject } from "rxjs"

@Injectable({
    providedIn: "root"
})
export class SpeechRecognitionService {

    constructor(private _zone: NgZone) {

    }

    public _subject$: Subject<string> = new Subject<string>();
    public _micSubject$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    private _speechRecognition = new SpeechRecognition()

    public checkAvailability(): Observable<boolean> {
        return from(this._speechRecognition.available())
    }

    public startListening(): Observable<boolean> {
        return from(this._speechRecognition.startListening({
            returnPartialResults: true,
            onResult: (transcription: SpeechRecognitionTranscription) => {
                this._zone.run(() => {
                    this._subject$.next(transcription.text)
                })
                if (transcription.finished) {
                    this.stopListening()
                        .subscribe(
                            (data) => {
                                this._zone.run(() => {
                                    this._micSubject$.next(false)
                                })
                            },
                            (err) => {
                                throw new Error(err)
                            }
                    )
                }
            }
        }))
    }

    public stopListening(): Observable<any> {
        return from(this._speechRecognition.stopListening())
    }

}
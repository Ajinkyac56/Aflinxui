import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GlobalConstants } from 'src/app/config/GlobalConstants';
import * as SockJS from 'sockjs-client';
import * as StompTemp from '@stomp/stompjs';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private _stompB2bClient: StompTemp.Client;
  private isConnected$ = new BehaviorSubject<boolean>(false);
  private B2B_WS_BROKER_URL: string = GlobalConstants.B2B_WS_BROKER_URL;
  private SOCKJS_ENDPOINT: string = GlobalConstants.SOCKJS_ENDPOINT;
  private dataArray: any[] = [];
  private dataSubject = new BehaviorSubject<any[]>(this.dataArray);
  notification = this.dataSubject.asObservable();
  notificationApi = GlobalConstants.API_SERVER_URL + GlobalConstants.API_BASE_URL + GlobalConstants.NOTIFICATION;

  constructor(private http: HttpClient) {
    this.connect();
    console.log('WebSocketService created');
  }
  public get stompB2bClient() {
    return this._stompB2bClient;
  }
  // Initialize WebSocket connection
  connect() {
    // Create a new STOMP client
    if (!this._stompB2bClient) {
      this._stompB2bClient = new StompTemp.Client({
        brokerURL: this.B2B_WS_BROKER_URL, // Change this to your WebSocket endpoint
        webSocketFactory: () => new SockJS(this.SOCKJS_ENDPOINT), // For SockJS fallback
        reconnectDelay: 30000, // Attempt reconnect every 5 seconds
        debug: (msg: string) => {
          console.log(msg); // Log messages for debugging
        },
      });
      // Connection success callback
      this._stompB2bClient.onConnect = frame => {
        console.log('Connected: ', frame);
        this.isConnected$.next(true);
      };

      // Handle errors (e.g., broker errors)
      this._stompB2bClient.onStompError = frame => {
        console.error('STOMP error: ', frame);
      };

      // Activate the connection
      this._stompB2bClient.activate();
    }
  }

  public subscribeToTopic(topic: string): Observable<any> {
    return new Observable(observer => {
      this.isConnected$.subscribe(value => {
        if (value) {
          const subscription = this.stompB2bClient.subscribe(topic, message => {
            // console.error('subscribe Message Received: ', message);
            observer.next(message.body);
          });
          // Clean up subscription when the observable is unsubscribed
          return () => subscription.unsubscribe();
        } else {
          return () => '';
        }
      });
    });
  }

  // Send message to a specific destination
  sendMessage(destination: string, body: any) {
    if (this.isConnected$.value) {
      this._stompB2bClient.publish({
        destination,
        body: JSON.stringify(body),
      });
    } else {
      console.error('Not connected to WebSocket server');
    }
  }

  pushNotification(obj: any): void {
    this.dataArray.push(obj);
    this.dataSubject.next(this.dataArray); // Emit the updated array
  }

  getNotifications(userId) {
    return this.http.get<any>(this.notificationApi + '?userId=' + userId);
  }

  // Disconnect the WebSocket connection
  disconnect() {
    if (this._stompB2bClient) {
      this._stompB2bClient.deactivate();
    }
  }
}

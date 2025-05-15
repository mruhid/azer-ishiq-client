import * as signalR from "@microsoft/signalr";

// Function to create and return the SignalR connection
export const createSignalRConnection = (token: string) => {
  return new signalR.HubConnectionBuilder()
    .withUrl("http://192.168.137.152:5252/chathub", {
      accessTokenFactory: () => token, // Use the provided token
    })
    .configureLogging(signalR.LogLevel.Information)
    .withAutomaticReconnect()
    .build();
};

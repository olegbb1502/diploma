#include <ESP8266WiFi.h>
#include <FirebaseArduino.h>
#include <DNSServer.h>
#include <ESP8266WebServer.h>
#include "WiFiManager.h"

#define FIREBASE_HOST "macro-anchor-227911.firebaseio.com"
#define FIREBASE_AUTH "gF1JFEfJ0C3AkWzc3pd4V6akmBbUh4B2ExrDgHrX"

void configModeCallback (WiFiManager *myWiFiManager) {
  Serial.println("Entered config mode");
  Serial.println(WiFi.softAPIP());
  //if you used auto generated SSID, print it
  Serial.println(myWiFiManager->getConfigPortalSSID());
}

bool resetBoard;
int BPM = 0;
int beat_old = 0;
float beats[500];
int beatIndex;
String boardName = "ESP ";

void calculateBPM () 
{  
  int beat_new = millis();    // get the current millisecond
  int diff = beat_new - beat_old;    // find the time between the last two beats
  float currentBPM = 60000 / diff;    // convert to beats per minute
  beats[beatIndex] = currentBPM;  // store to array to convert the average
  float total = 0.0;
  for (int i = 0; i < 500; i++){
    total += beats[i];
  }
  BPM = int(total / 500);
  beat_old = beat_new;
  beatIndex = (beatIndex + 1) % 500;  // cycle through the array instead of using FIFO queue
}

void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);
  
//  pinMode(10, INPUT); // Setup for leads off detection LO +
//  pinMode(11, INPUT); // Setup for leads off detection LO - 
  
  //WiFiManager
  //Local intialization. Once its business is done, there is no need to keep it around
  WiFiManager wifiManager;
  //reset settings - for testing
  //wifiManager.resetSettings();

  //set callback that gets called when connecting to previous WiFi fails, and enters Access Point mode
  wifiManager.setAPCallback(configModeCallback);

  //fetches ssid and pass and tries to connect
  //if it does not connect it starts an access point with the specified name
  //here  "AutoConnectAP"
  //and goes into a blocking loop awaiting configuration
  if(!wifiManager.autoConnect()) {
    Serial.println("failed to connect and hit timeout");
    //reset and try again, or maybe put it to deep sleep
    ESP.reset();
    delay(1000);
  } 

  //if you get here you have connected to the WiFi
  Serial.print("connected");

  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  randomSeed(42);  
  Firebase.set("data/", NULL);
}


int count = 0, value = 0;

StaticJsonBuffer<50> jsonBuffer;
JsonObject& root = jsonBuffer.createObject();
  
void loop() {
  // put your main code here, to run repeatedly:
  
  String boardNameFirebase = Firebase.getString("info/name");
  boardName += ESP.getCoreVersion();
  if(boardNameFirebase == ""){
    Firebase.setString("info/name", boardName);
  }
    
  if((digitalRead(10) == 1)||(digitalRead(11) == 1)){
    Serial.print("!");
    Firebase.set("info/connect", false);
  }

  Firebase.set("info/connect", false);
    
  resetBoard = Firebase.getBool("info/reset");
  
//  value = analogRead(A0);
  root["value"] = analogRead(A0);

  if(root["value"] > 25){
    calculateBPM();
    Firebase.set("data/bpm", BPM);
  }
  else{
    Firebase.set("data/bpm", 0);
  }
  
  if(count < 60){
    Firebase.push("data/ecg", root);
    if (Firebase.failed()) {
      Serial.println("error: ");
      Serial.println(Firebase.error());
      return;
    }
    count++;
  }
  else{
    delay(20000);
    Firebase.set("data/", NULL);
    delay(5000);
    count=0;
  }

  if(resetBoard){
    Firebase.set("info/reset", false);
    ESP.reset();
  }
  
  delay(1000);
}

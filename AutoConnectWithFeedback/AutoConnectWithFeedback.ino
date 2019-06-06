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
  int beat_new = millis();
  int diff = beat_new - beat_old;
  float currentBPM = 60000 / diff;
  beats[beatIndex] = currentBPM;
  float total = 0.0;
  for (int i = 0; i < 500; i++){
    total += beats[i];
  }
  BPM = int(total / 500);
  beat_old = beat_new;
  beatIndex = (beatIndex + 1) % 500;
}

void setup() {
  Serial.begin(115200);
  
//  pinMode(10, INPUT); // Setup for leads off detection LO +
//  pinMode(11, INPUT); // Setup for leads off detection LO - 
  WiFiManager wifiManager;

  wifiManager.setAPCallback(configModeCallback);
  if(!wifiManager.autoConnect()) {
    Serial.println("failed to connect and hit timeout");
    ESP.reset();
    delay(1000);
  }
  Serial.print("connected");

  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  randomSeed(42);  
  Firebase.set("data/", NULL);
}


int count = 0, value = 0;

StaticJsonBuffer<50> jsonBuffer;
JsonObject& root = jsonBuffer.createObject();
  
void loop() {  
  String boardNameFirebase = Firebase.getString("info/name");
  boardName += ESP.getCoreVersion();
  if(boardNameFirebase == ""){
    Firebase.setString("info/name", boardName);
  }
    
//  if((digitalRead(10) == 1)||(digitalRead(11) == 1)){
//    Serial.print("!");
//    Firebase.set("info/connect", false);
//  }

  Firebase.set("info/connect", true);
    
  resetBoard = Firebase.getBool("info/board/reset");
  
//  value = analogRead(A0);
  root["value"] = analogRead(A0);
  float voltage = analogRead(A0) * (5.00 / 1023.00) * 2;
  int battery = 100;
  if(voltage>4.2){
       battery =  100;
   }
   if(voltage<=4.2 && voltage>4.1){
       battery = 90;
   }
    else if(voltage<=4.1 && voltage>4.0){
        battery =  80;
    }
    else if(voltage<=4.0 && voltage>3.9){
        battery = 60;
    }
    else if(voltage<=3.9 && voltage>3.8){
        battery =  40;
    }
    else if(voltage<=3.8 && voltage>3.6){
        battery = 20;
    }
    else if(voltage<=3.6){
        battery =  0;
    }
  
  Firebase.set("info/board/battery", battery);

  if(root["value"] > 25){
    calculateBPM();
    Firebase.set("data/bpm", BPM);
  }
  else{
    Firebase.set("data/bpm", 0);
  }
  
  if(count < 3600){
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
    Firebase.set("info/board/reset", false);
    ESP.reset();
  }
  
  delay(200);
}

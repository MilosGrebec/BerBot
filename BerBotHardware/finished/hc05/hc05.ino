#include <Servo.h>
#define ledPin 13
int state=0;
String input, j,z;
Servo myservo;
float x,y;
int ComaIndex, end;
int motorpin1 =7;
int motorpin2 =6;
int controlpinA=9;
void setup() {
  // put your setup code here, to run once:
  pinMode(ledPin,OUTPUT);
  digitalWrite(ledPin,LOW);
  Serial.begin(9600);
  myservo.attach(10);
  pinMode(6,OUTPUT);
  pinMode(7,OUTPUT);
  pinMode(3,OUTPUT);
}

void loop() {
  // put your main code here, to run repeatedly:
  if (Serial.available()>0){
    input = Serial.readStringUntil('\n');
    ComaIndex=input.indexOf(",");
    j=input.substring(0,ComaIndex);
    x=j.toFloat();
    end=input.length();
    z=input.substring(ComaIndex+1,end-1);
    y=z.toFloat();
  }
  Serial.println("y: ");
  Serial.println(y);
  Serial.println(z);
  if(x>0.2){
    myservo.write(0);
    Serial.println("idem u desno");
    Serial.println(x);
  }
  else if(x<-0.2){
    myservo.write(180);
    // Serial.println("idem u levo");
    // Serial.println(x);
  }
  else{
    myservo.write(90);
    // Serial.println("ne idem nigde");
    // Serial.println(x);
  }
   if (y>0.2){
    Serial.println("idem nazad");
    analogWrite(3, 150);  
    digitalWrite(7, HIGH);
    digitalWrite(6, LOW);
  }
  else if (y<-0.2){
    Serial.println("idem pravo");
    analogWrite(3, 200);  
    digitalWrite(7, LOW);
    digitalWrite(6, HIGH);
  }
  else{
    analogWrite(3, 0);
    digitalWrite(7, LOW);
    digitalWrite(6, LOW);
  }
  delay(10);
}

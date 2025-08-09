#include <Servo.h>
#define VRX_PIN A1;
#define VRY_PIN A0;
Servo myservo;

int pos=0;
int xValue=0;
int yValue=0;

void setup() {
  // put your setup code here, to run once:
  myservo.attach(9);
  Serial.begin(9600);

  Serial.println("Input for servo motor");
}

void loop() {
  xValue=analogRead(A1);
  yValue=analogRead(A0);
  Serial.print("x=");
  Serial.print(xValue);
  Serial.print(", y=");
  Serial.println(yValue);
  delay(200);
  int servoP = yValue;
  if (servoP==516 || servoP==515){
    myservo.write(90);
  }
  else{
    if (servoP>520){    
      myservo.write(180);
    }
    else {
      myservo.write(0);
    }

  }
  /*
    if (x>90){
    myservo.attach(9);
    myservo.write(1);
    
  }
  else{
    Serial.println("nije ostar");
    myservo.write(0);
    myservo.detach();
  }
  */

}

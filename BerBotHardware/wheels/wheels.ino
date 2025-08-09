int motor2pin1 = 7;  // IN3
int motor2pin2 = 6;  // IN4

void setup() {
  pinMode(motor2pin1, OUTPUT);
  pinMode(motor2pin2, OUTPUT);
  pinMode(9,OUTPUT);

}

void loop() {
analogWrite(9, 200);  // Full speed
digitalWrite(7, HIGH);
digitalWrite(6, LOW);
delay(50);
}

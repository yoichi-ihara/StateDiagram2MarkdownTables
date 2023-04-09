```plantuml
[*] --> state1 : start1
state1 --> [*] : end1
state1 -right-> state2 : change1
[*] --> state2 : start2
state2 -left-> state1 : change2
state2 --> [*] : end2
```

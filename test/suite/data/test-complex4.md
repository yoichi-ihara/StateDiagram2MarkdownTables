``` plantuml
state "accept" as accept
[*] -right-> accept 
accept -right-> dateInput : b-member
accept -down-> memberRegist : b-nonMember
memberRegist -up-> dateInput : b-submit
memberRegist -up-> accept : b-back
dateInput -left-> accept : b-back 
dateInput -right-> infoInput : b-submit
infoInput -left-> dateInput : b-back
infoInput -right-> confirm : b-submit
confirm -left-> infoInput : b-back
confirm -right-> done : b-submit
done -right-> [*] : b-close
```
reference : https://sqripts.com/2023/02/14/34507/
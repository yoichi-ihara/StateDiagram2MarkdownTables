``` plantuml
state "stop" as stop
stop -right-> running_low : run stop
stop -down-> stop : switch mode
running_low -> stop : run stop
running_low -down-> running_mid : switch mode
running_mid -> stop : run stop
running_mid -down-> running_high : switch mode
running_high -> stop : run stop
running_high -up-> running_low : switch mode
```
reference : https://speakerdeck.com/gihoz_support/ming-ri-karashi-erutesutoji-fa-mian-qiang-hui-5-zhuang-tai-qian-yi-tesuto?slide=37
``` plantuml
state "stop" as stop
stop -right-> running_low : run_stop
stop -down-> stop : switch_mode
running_low -> stop : run_stop
running_low -down-> running_mid : switch_mode
running_mid -> stop : run_stop
running_mid -down-> running_high : switch_mode
running_high -> stop : run_stop
running_high -up-> running_low : switch_mode
```
reference : https://speakerdeck.com/gihoz_support/ming-ri-karashi-erutesutoji-fa-mian-qiang-hui-5-zhuang-tai-qian-yi-tesuto?slide=37
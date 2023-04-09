``` plantuml
[*]  -> State1 
State1 ----> 作成 : cancel
作成 --> State1 : apply
作成 -> [*] : hoge
```

``` plantuml
state "ステート1" as State1

State1 -up-> State1 : loop

State1 -right> State2 : apply
State1 : this is a string
State1 : this is another string

State1 ----> State3 : cancel

State2 -left[#bule]-> State1 : cancel
State2 --right[#bule]> State3 : apply

State2_1 -> State2 : apply


[*] -> State1 : start
State3 -> [*] : commit

State2 -> State2_1 : stage

State3 --> State2 : cancel
State3 --> State1 : apply
```
```plantuml
State S1
State S2
S1 -[#DD00AA]-> S2: accept1
S1 -left[#yellow]-> S3 :accept2
S1 -up[#red,dashed]-> S4:S4 : accept3
S1 -right[dotted,#blue]-> S5 : accept4

X1 -[dashed]-> X2:not_accept
Z1 -[dotted]-> Z2:Z2: accept
Y1 -[#blue,bold]-> Y2:Y2 :accept
```

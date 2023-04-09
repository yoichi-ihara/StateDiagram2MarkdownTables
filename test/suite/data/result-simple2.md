## Transition Table

| |start1|start2|change1|change2|end1|end2|
| :----: | :----: | :----: | :----: | :----: | :----: | :----: |
|[*]|state1|state2|N/A|N/A|N/A|N/A|
|state1|N/A|N/A|state2|N/A|[*]|N/A|
|state2|N/A|N/A|N/A|state1|N/A|[*]|

## 0 Switch Coverage

|state|event|state|
| :----: | :----: | :----: |
|[*]|start1|state1|
|[*]|start2|state2|
|state1|change1|state2|
|state2|change2|state1|
|state1|end1|[*]|
|state2|end2|[*]|

## 1 Switch Coverage

|state|event|state|event|state|
| :----: | :----: | :----: | :----: | :----: |
|[*]|start1|state1|change1|state2|
|[*]|start1|state1|end1|[*]|
|[*]|start2|state2|change2|state1|
|[*]|start2|state2|end2|[*]|
|state1|change1|state2|change2|state1|
|state1|change1|state2|end2|[*]|
|state2|change2|state1|change1|state2|
|state2|change2|state1|end1|[*]|

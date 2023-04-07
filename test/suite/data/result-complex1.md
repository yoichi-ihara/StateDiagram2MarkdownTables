## Transition Table

| |start|loop|apply|cancel|stage|commit|
| :----: | :----: | :----: | :----: | :----: | :----: | :----: |
|[*]|ステート1|N/A|N/A|N/A|N/A|N/A|
|ステート1|N/A|ステート1|State2|State3|N/A|N/A|
|State2|N/A|N/A|State3|ステート1|State2_1|N/A|
|State2_1|N/A|N/A|State2|N/A|N/A|N/A|
|State3|N/A|N/A|ステート1|State2|N/A|[*]|

## 0 Switch Coverage

|state|event|state|
| :----: | :----: | :----: |
|[*]|start|ステート1|
|ステート1|loop|ステート1|
|ステート1|apply|State2|
|ステート1|cancel|State3|
|State2|apply|State3|
|State2|cancel|ステート1|
|State2|stage|State2_1|
|State2_1|apply|State2|
|State3|apply|ステート1|
|State3|cancel|State2|
|State3|commit|[*]|

## 1 Switch Coverage

|state|event|state|event|state|
| :----: | :----: | :----: | :----: | :----: |
|[*]|start|ステート1|loop|ステート1|
|[*]|start|ステート1|apply|State2|
|[*]|start|ステート1|cancel|State3|
|ステート1|loop|ステート1|loop|ステート1|
|ステート1|loop|ステート1|apply|State2|
|ステート1|loop|ステート1|cancel|State3|
|ステート1|apply|State2|apply|State3|
|ステート1|apply|State2|cancel|ステート1|
|ステート1|apply|State2|stage|State2_1|
|ステート1|cancel|State3|apply|ステート1|
|ステート1|cancel|State3|cancel|State2|
|ステート1|cancel|State3|commit|[*]|
|State2|apply|State3|apply|ステート1|
|State2|apply|State3|cancel|State2|
|State2|apply|State3|commit|[*]|
|State2|cancel|ステート1|loop|ステート1|
|State2|cancel|ステート1|apply|State2|
|State2|cancel|ステート1|cancel|State3|
|State2|stage|State2_1|apply|State2|
|State2_1|apply|State2|apply|State3|
|State2_1|apply|State2|cancel|ステート1|
|State2_1|apply|State2|stage|State2_1|
|State3|apply|ステート1|loop|ステート1|
|State3|apply|ステート1|apply|State2|
|State3|apply|ステート1|cancel|State3|
|State3|cancel|State2|apply|State3|
|State3|cancel|State2|cancel|ステート1|
|State3|cancel|State2|stage|State2_1|

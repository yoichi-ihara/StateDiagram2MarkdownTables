## Transition Table

| |cancel|apply|hoge|
| :----: | :----: | :----: | :----: |
|State1|作成|N/A|N/A|
|作成|N/A|State1|[*]|

## 0 Switch Coverage

|state|event|state|
| :----: | :----: | :----: |
|State1|cancel|作成|
|作成|apply|State1|
|作成|hoge|[*]|

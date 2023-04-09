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

## 1 Switch Coverage

|state|event|state|event|state|
| :----: | :----: | :----: | :----: | :----: |
|State1|cancel|作成|apply|State1|
|State1|cancel|作成|hoge|[*]|
|作成|apply|State1|cancel|作成|

## 2 Switch Coverage

|state|event|state|event|state|event|state|
| :----: | :----: | :----: | :----: | :----: | :----: | :----: |
|State1|cancel|作成|apply|State1|cancel|作成|
|作成|apply|State1|cancel|作成|apply|State1|
|作成|apply|State1|cancel|作成|hoge|[*]|

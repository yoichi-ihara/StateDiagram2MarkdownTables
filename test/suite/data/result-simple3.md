## Transition Table

| |c|d|e|
| :----: | :----: | :----: | :----: |
|a|b|N/A|N/A|
|b|N/A|a|c|

## 0 Switch Coverage

|state|event|state|
| :----: | :----: | :----: |
|a|c|b|
|b|d|a|
|b|e|c|

## 1 Switch Coverage

|state|event|state|event|state|
| :----: | :----: | :----: | :----: | :----: |
|a|c|b|d|a|
|a|c|b|e|c|
|b|d|a|c|b|

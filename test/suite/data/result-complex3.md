## Transition Table

| |run stop|switch mode|
| :----: | :----: | :----: |
|stop|running_low|stop|
|running_low|stop|running_mid|
|running_mid|stop|running_high|
|running_high|stop|running_low|

## 0 Switch Coverage

|state|event|state|
| :----: | :----: | :----: |
|stop|run stop|running_low|
|stop|switch mode|stop|
|running_low|run stop|stop|
|running_low|switch mode|running_mid|
|running_mid|run stop|stop|
|running_mid|switch mode|running_high|
|running_high|run stop|stop|
|running_high|switch mode|running_low|

## 1 Switch Coverage

|state|event|state|event|state|
| :----: | :----: | :----: | :----: | :----: |
|stop|run stop|running_low|run stop|stop|
|stop|run stop|running_low|switch mode|running_mid|
|stop|switch mode|stop|run stop|running_low|
|stop|switch mode|stop|switch mode|stop|
|running_low|run stop|stop|run stop|running_low|
|running_low|run stop|stop|switch mode|stop|
|running_low|switch mode|running_mid|run stop|stop|
|running_low|switch mode|running_mid|switch mode|running_high|
|running_mid|run stop|stop|run stop|running_low|
|running_mid|run stop|stop|switch mode|stop|
|running_mid|switch mode|running_high|run stop|stop|
|running_mid|switch mode|running_high|switch mode|running_low|
|running_high|run stop|stop|run stop|running_low|
|running_high|run stop|stop|switch mode|stop|
|running_high|switch mode|running_low|run stop|stop|
|running_high|switch mode|running_low|switch mode|running_mid|

## Transition Table

| |run_stop|switch_mode|
| :----: | :----: | :----: |
|stop|running_low|stop|
|running_low|stop|running_mid|
|running_mid|stop|running_high|
|running_high|stop|running_low|

## 0 Switch Coverage

|state|event|state|
| :----: | :----: | :----: |
|stop|run_stop|running_low|
|stop|switch_mode|stop|
|running_low|run_stop|stop|
|running_low|switch_mode|running_mid|
|running_mid|run_stop|stop|
|running_mid|switch_mode|running_high|
|running_high|run_stop|stop|
|running_high|switch_mode|running_low|

## 1 Switch Coverage

|state|event|state|event|state|
| :----: | :----: | :----: | :----: | :----: |
|stop|run_stop|running_low|run_stop|stop|
|stop|run_stop|running_low|switch_mode|running_mid|
|stop|switch_mode|stop|run_stop|running_low|
|stop|switch_mode|stop|switch_mode|stop|
|running_low|run_stop|stop|run_stop|running_low|
|running_low|run_stop|stop|switch_mode|stop|
|running_low|switch_mode|running_mid|run_stop|stop|
|running_low|switch_mode|running_mid|switch_mode|running_high|
|running_mid|run_stop|stop|run_stop|running_low|
|running_mid|run_stop|stop|switch_mode|stop|
|running_mid|switch_mode|running_high|run_stop|stop|
|running_mid|switch_mode|running_high|switch_mode|running_low|
|running_high|run_stop|stop|run_stop|running_low|
|running_high|run_stop|stop|switch_mode|stop|
|running_high|switch_mode|running_low|run_stop|stop|
|running_high|switch_mode|running_low|switch_mode|running_mid|

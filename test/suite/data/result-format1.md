## Transition Table

| |accept1|accept2|accept3|accept4|accept|
| :----: | :----: | :----: | :----: | :----: | :----: |
|S1|S2|S3|S4:S4|S5|N/A|
|Z1|N/A|N/A|N/A|N/A|Z2:Z2|
|Y1|N/A|N/A|N/A|N/A|Y2:Y2|

## 0 Switch Coverage

|state|event|state|
| :----: | :----: | :----: |
|S1|accept1|S2|
|S1|accept2|S3|
|S1|accept3|S4:S4|
|S1|accept4|S5|
|Z1|accept|Z2:Z2|
|Y1|accept|Y2:Y2|

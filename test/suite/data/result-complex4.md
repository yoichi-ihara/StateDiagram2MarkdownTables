## Transition Table

| |b-member|b-nonMember|b-submit|b-back|b-close|
| :----: | :----: | :----: | :----: | :----: | :----: |
|accept|dateInput|memberRegist|N/A|N/A|N/A|
|dateInput|N/A|N/A|infoInput|accept|N/A|
|memberRegist|N/A|N/A|dateInput|accept|N/A|
|infoInput|N/A|N/A|confirm|dateInput|N/A|
|confirm|N/A|N/A|done|infoInput|N/A|
|done|N/A|N/A|N/A|N/A|[*]|

## 0 Switch Coverage

|state|event|state|
| :----: | :----: | :----: |
|accept|b-member|dateInput|
|accept|b-nonMember|memberRegist|
|dateInput|b-submit|infoInput|
|dateInput|b-back|accept|
|memberRegist|b-submit|dateInput|
|memberRegist|b-back|accept|
|infoInput|b-submit|confirm|
|infoInput|b-back|dateInput|
|confirm|b-submit|done|
|confirm|b-back|infoInput|
|done|b-close|[*]|

## 1 Switch Coverage

|state|event|state|event|state|
| :----: | :----: | :----: | :----: | :----: |
|accept|b-member|dateInput|b-submit|infoInput|
|accept|b-member|dateInput|b-back|accept|
|accept|b-nonMember|memberRegist|b-submit|dateInput|
|accept|b-nonMember|memberRegist|b-back|accept|
|dateInput|b-submit|infoInput|b-submit|confirm|
|dateInput|b-submit|infoInput|b-back|dateInput|
|dateInput|b-back|accept|b-member|dateInput|
|dateInput|b-back|accept|b-nonMember|memberRegist|
|memberRegist|b-submit|dateInput|b-submit|infoInput|
|memberRegist|b-submit|dateInput|b-back|accept|
|memberRegist|b-back|accept|b-member|dateInput|
|memberRegist|b-back|accept|b-nonMember|memberRegist|
|infoInput|b-submit|confirm|b-submit|done|
|infoInput|b-submit|confirm|b-back|infoInput|
|infoInput|b-back|dateInput|b-submit|infoInput|
|infoInput|b-back|dateInput|b-back|accept|
|confirm|b-submit|done|b-close|[*]|
|confirm|b-back|infoInput|b-submit|confirm|
|confirm|b-back|infoInput|b-back|dateInput|

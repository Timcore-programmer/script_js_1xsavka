Фрагмент скрипта теннис 1хstavka

//***********************************************************************************************************************

// Секция BODY

//***********************************************************************************************************************

picture_load(0)

iimPlayCode("CLEAR")

iimPlayCode("TAB CLOSEALLOTHERS")

iimPlayCode("URL GOTO="+url_live+"live/Tennis/")

//!!! ошибки javascript Отключены

window.onerror=null; // отключаем ошибки javascript обратить внимание

iimPlayCode("SET !ERRORIGNORE YES")

iimPlayCode("SET !ERRORCONTINUE YES")

while (1==1) // Бесконечный цикл, можно в последствии заменить на таймер

{

try

{

iimPlayCode("CLEAR")

// делаем паузу 5 минут, если секция теннис недоступна

if (GetClass("c-events_not_text").length != 0) // Пишет нет активных событий появляется класс, если теннис пустой

{

iimPlayCode("WAIT SECONDS = 50")

}

//***************************************************

// Блок проверки на активную секцию Тенниса, раз в десять минут час перегружаем страницу чтобы не выкинули из аккаунта

if (time_start == 5) // каждые 10 циклов перегружаем главную

{

Tabs.go(1)

iimPlayCode("URL GOTO="+url_live+"live/Tennis/")

time_start = 0;

}

time_start++

// Конец блока проверки на активную секцию волейбола

//*******************************************

// Конец блока проверки на активную секцию волейбола

//*******************************************

// Начальный блок проверки всех матчей на ITF, DOUBLE, Woomen, 1/2 - 1/64 и т.д.

st = GetClass("c-events__item c-events__item_col") // имена конкретных матчей

iimPlayCode("WAIT SECONDS=1")

if (st.length == 0) // если не доступна страничка

{

continue

}

// Цикл по всем матчам (не лигам)

temp_count = 0 // счётчик ходов

for (i=0;i<st.length;i++)

{

st1 = st[i].innerHTML.match(/href="live\/Tennis\/(.+?)"/) // берём всё подряд из href ссылка

st2 = st1[0].replace(/,(.+?)/,"") // удаляем всё после запятой, остаётся только ссылка + href="

st2 = st2.replace(/"/,"") // удаляем ковычки

st2 = st2.replace(/"/,"") // удаляем ковычки

temp1 = st2.match(/\d{6}/) // вычленяем номер лиги

temp2 = st2.match(/\d{9}/) // вычленяем номер матча

st3 = st2.match(/ITF/) // категория ITF

st4 = st2.match(/Double/) // пары есть есть в url

st5 = st2.match(/Women/) // женщины если есть в url

// ###############################################################################################

id[count] = temp1

id_liga[count] = temp2

url[count] = st2.replace(/href=/,"")

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

// Блок проверки был ли матч уже сыгран, и сработало ли событие

//if (GetClass("c-events__fullScore").textContent.match(/\[.{1,30}/) != undefined)

if (i < GetClass("c-events__fullScore").length) // только если матч есть в списке

{

temp101 = GetClass("c-events__fullScore")[i].textContent.match(/\[.{1,30}/)

temp102 = temp101[0].match(/\d{1,2}-\d{1,2}/g)

if (temp102[1] != undefined)

{

// начало проверки первого сета

temp201 = temp102[0].match(/\d{1,2}/g) // счёт первого сета [0] - первого игрока, [1] - второго

d1 = +temp201[0] + +temp201[1] // общий счёт первого сета

if (temp201[0] >= 6 || temp201[1] >= 6) // записываем результат игры

{

for (ik=0;ik<count2;ik++) // проверяем все матчи где были события

{

if ((first_set[ik]-id_liga[count]) == 0) // тут надо проверить

{

if (first_end[ik] == undefined)

{

if (first_result[ik] > d1) // матч проходит

{

first_end[ik] = true // матч выйгран

}

if (first_result[ik] < d1)

{

first_end[ik] = false // матч проигран

}

save(first_end[ik] + "; Ставка была: " + first_result[ik] + "; Сумма счёта первого сета: " + d1 + "<BR>",file_output_telegram)

get_telegram(1) // вызываем телеграмм для отправки результата, первый сет

break; // запись закончена выходим из цикла i, от ошибки

}

}

}

}// конец проверки первого сета

temp202 = temp102[1].match(/\d{1,2}/g) // счёт второго сета

d2 = +temp202[0] + +temp202[1] // общий счёт второго сета ещё +1 так как ещё нет 6.

if (temp202[0] >= 6 || temp202[1] >= 6) // записываем результат игры

// if (1==1)

{

for (ik=0;ik<count2;ik++) // проверяем все матчи где были события

{

if ((second_set[ik]-id_liga[count]) == 0) // тут надо проверить

{

if (second_end[ik] == undefined)

{

// save(first_end[ik],file_output)

if (second_result[ik] > d2) // матч проходит

{

second_end[ik] = true // матч выйгран

}

if (second_result[ik] < d2)

{

second_end[ik] = false // матч проигран

}

save(second_end[ik] + "; " + "Ставка была: " + second_result[ik] + "; Сумма счёта первого сета: " + d2 + "<BR>",file_output_telegram)

get_telegram(2) // вызываем телеграмм для отправки результата, второй сет

break; // запись закончена выходим из цикла, от ошибки

}

}

}

}

}

} // конец проверки undefined счёта

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

// Конец Блока проверки был ли матч уже сыгран, и сработало ли событие

if (st3 == "ITF") // проверка что матч из серии ITF

// if (1==1)

{

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

// Блок проверки открытия новой вкладки для ОД и ПЖ, ITF, 1/8, 1/16, 1/32, Qualification

if (st5 == "Women") // Женщины ITF без разницы пары или не пары ОЖ и ПЖ

// if (1==1)

{

// проверка стоит ли следить за матчем, до перехода на вкладку матча

// перескакиваем на следующую итерацию, если игра уже в топке

checking1 = false // временный параметр, совпадений не найдено с ненужными матчами для ОЖ и ПЖ

for (l=0;l<game_lost.length;l++)

{

if ((game_lost[l] - id_liga[count])==0)

{

checking1 = true // совпадение найдено для ОЖ и ПЖ

}

}

if (checking1)

{

continue // переходим на следующую итерацию цикла i

}

iimPlayCode("TAB OPEN")

Tabs.go(2) // вкладка открытая с игрой ITF будет номером 2

iimPlayCode("WAIT SECONDS = 1")

iimPlayCode("URL GOTO="+url_live+url[count])

window.onerror=null; // отключаем ошибки javascript обратить внимание

// if (GetClass("loading").length != 0)

// {

// t_temp = loading_check() // ждём загрузки матча

loading_check()

// if (t_temp >= 20)

// {

// iimPlayCode("TAB CLOSE")

// Tabs.go(1);

// continue // заканчиваем этот цикл, игра не доступна

// }

// }

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

// Блок проверки ошибок матчей

// проверяем существует игра или нет

// Ошибка 404 страница не доступна

if (GetClass("error_bottom").length !=0)

{

if (GetClass("error_bottom")[0].textContent.match(/Вы можете вернуться назад/) == "Вы можете вернуться назад")

{

// game_lost[count1] = id_liga[count] // потерянная для анализа игра, не подходит по параметру 1/4 и т.д.

// count1++ // увеличиваем счётчик запоротых игр

iimPlayCode("TAB CLOSE")

Tabs.go(1);

continue // заканчиваем этот цикл, игра не доступна

}

}

if (GetClass("no_bets").length != 0) // если нет ставок

{

if (GetClass("no_bets")[0].innerHTML.match(/Нет ставок для выбранного события\. Пожалуйста\, выберите другое событие\./) == "Нет ставок для выбранного события. Пожалуйста, выберите другое событие.")

{

game_lost[count1] = id_liga[count] // потерянная для анализа игра, не подходит по параметру 1/4 и т.д.

count1++ // увеличиваем счётчик запоротых игр

iimPlayCode("TAB CLOSE")

Tabs.go(1);

continue // заканчиваем этот цикл, ставок на данный момент нет

}

} // в классе "no_bets" align="center">Нет ставок для выбранного события. Пожалуйста, выберите другое событие.</p>

if (GetClass("db-sport__linkTime").length != 0)

{

if (GetClass("db-sport__linkTime")[0].innerHTML.match(/Игра завершена/) == "Игра завершена" || GetClass("db-sport__linkTime")[0].innerHTML.match(/Игра завершена/) == "Игра завершена" || GetClass("db-sport__linkTime")[0].innerHTML.match(/3-й Сет/) == "3-й Сет")

{

game_lost[count1] = id_liga[count] // потерянная для анализа игра, не подходит по параметру 1/4 и т.д.

count1++ // увеличиваем счётчик запоротых игр

iimPlayCode("TAB CLOSE")

Tabs.go(1);

continue // заканчиваем этот цикл, игра закончена

}

}

if (GetClass("db-sport__top").length !=0)

{

if (GetClass("db-sport__top")[0].textContent.match(/Игра завершена/) == "Игра завершена")

{

game_lost[count1] = id_liga[count] // потерянная для анализа игра, не подходит по параметру 1/4 и т.д.

count1++ // увеличиваем счётчик запоротых игр

iimPlayCode("TAB CLOSE")

Tabs.go(1);

continue // заканчиваем этот цикл, игры уже нет

}

}

if (GetClass("gameLoadingErr_main a-events__msg").length != 0) // если есть класс ошибки

{

if (GetClass("gameLoadingErr_main a-events__msg")[0].innerHTML.match(/Выбранная игра уже завершена/) == "Выбранная игра уже завершена") // проверяем первую ошибку, игры уже нет

{

game_lost[count1] = id_liga[count] // потерянная для анализа игра, не подходит по параметру 1/4 и т.д.

count1++ // увеличиваем счётчик запоротых игр

iimPlayCode("TAB CLOSE")

Tabs.go(1);

continue // заканчиваем этот цикл, игры уже нет

}

}

if (GetClass("item").length == 0) // если страница не подгрузилась, не видим вид матча 1/16 и т.д. пропускаем текущий матч

{

iimPlayCode("TAB CLOSE")

Tabs.go(1);

continue // заканчиваем этот цикл, игры уже нет

}

// проверяем был ли этот матч зарегестрирован

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

// Конец блока ошибок матчей

// Проверка матча чтобы это был 1/16, 1/32 или 1/64, Qualification

temp3 = null;

temp3 = GetClass("item")[0].innerHTML.match(/\d{1}\/\d{1,2}/) // вычленяем тур например 1/16

temp4 = url[count].match(/Qualification/) // вычленяем из Урла квалификацию

if (temp3 == "1/8" || temp3 == "1/16" || temp3 == "1/32" || temp3 == "1/64" || temp4 == "Qualification" ) // всё остальное не подходит, ещё поискать Квалификацию или матч до 1/64, также обратить внимание на выщип Квалификация

// if (1==1)

{ // мониторим матч дальше он подходит, убрать далее 1/8 для женщин

// Мониторим сеты temp6 - счёт первого счёта, temp7 = счёт второго сета, temp8 - счёт третьего сета

if (GetClass("db-sport__periods-item").length == 0) // если нет периодов и сэтов

{

iimPlayCode("TAB CLOSE")

Tabs.go(1);

continue // заканчиваем этот цикл, игра закончена

}

temp6 = GetClass("db-sport__periods-item")[0].innerHTML.match(/\d{1}-\d{1}/) // вычленяем счёт первого сета

if (GetClass("db-sport__periods-item").length >= 2)

{temp7 = GetClass("db-sport__periods-item")[1].innerHTML.match(/\d{1}-\d{1}/)} // else {temp7 = null} // вычленяем счёт второго сета если есть

if (GetClass("db-sport__periods-item").length >= 3)

{temp8 = GetClass("db-sport__periods-item")[2].innerHTML.match(/\d{1}-\d{1}/)} // else {temp8 = null} // вычленяем счёт третьего сета если есть

// Мониторим счёт в каждом сете текущий

temp9 = GetClass("db-sport__score-con")[0].textContent.match(/\d{1,2}/g) // вычленяем счёт в массив temp9[0] первого игрока, в массив temp9[1] - счёт второго

// Блок определения кто подаёт в данный момент

temp10_1 = GetClass("db-sport__ball sport_icons p1 sport_icon_4")[0] // подача первого

temp10_2 = GetClass("db-sport__ball sport_icons p2 sport_icon_4")[0] // подача второго

if (temp10_1 != undefined) {podacha [count] = 1}

if (temp10_2 != undefined) {podacha [count] = 2}

// Собираем коэффициенты

// Открываем вкладку сета текущего для сбора всех коэффициентов

if (GetClass("db-sport__periods-item").length >= 1) // только если 1-й сет или 2-й сет

{

iimPlayCode('EVENT TYPE=CLICK SELECTOR="#dopEvsWrap_select_chosen>A>DIV>B" BUTTON=0')

iimPlayCode('EVENT TYPE=CLICK SELECTOR="#dopEvsWrap_select_chosen>DIV>UL>LI:nth-of-type(2)" BUTTON=0')

iimPlayCode('WAIT SECONDS = 1')

}

// Определяем коэффициенты на победу в П1 и П2 чтобы выделить фаворита

temp11_1 = null; temp11_2 = null // принимаем временное значение коэффициентов

if (GetClass("koeff").length != 0) // проверяем есть ли коэффициенты

{

temp11_1 = GetClass("koeff")[0].textContent.match(/\d{1,2}\.\d{1,2}/) // коэффициент на первого игрока temp11_1

temp11_2 = GetClass("koeff")[1].textContent.match(/\d{1,2}\.\d{1,2}/) // коэффициент на второго игрока temp11_2

// если коэффициент целое число, тогда вычленяем целое число

if (temp11_1 == null)

{

temp11_1 = GetClass("koeff")[0].textContent.match(/\d{1,2}/)

}

if (temp11_2 == null)

{

temp11_2 = GetClass("koeff")[1].textContent.match(/\d{1,2}/)

}

}

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

//2.2 по ТЗ Начало проверки условий попадания матча в избранные

// Определяем фаворита

favorite[count] = null // изначально нет фаворита

if (temp11_1 => 1.3 && temp11_1 < temp11_2)

{

if (temp11_1 <= 1.7)

{

favorite[count] = 1

}

}

if (temp11_2 => 1.3 && temp11_2 < temp11_1)

{

if (temp11_2 <= 1.7)

{

favorite[count] = 2

}

}

// Берём коэффициент на 7.5М

k7_5M = null // изначально

if (GetClass("db-sport__periods-item").length >= 1 && GetClass("db-sport__periods-item")[0].textContent != " Игра завершена ") // только если 1-й сет или 2-й сет

{

for (j=0;j<GetClass("bets betCols2").length;j++) // ставки на Тотал на текущий сет проверить на 7.5

{

p1 = GetClass("bets betCols2")[j].textContent

if (p1.match(/7\.5 М /) != null)

{

p1 = p1.match(/7\.5 М (.{1,5})/) // оставляем весь коэффициент

k7_5M = p1[0].replace(/7\.5 М /,"") // вычленяем коэффициент

}

}

} // конец проверки коэффициента ТОТАЛЫ 7.5М

//------------------------------------------------------

// Определяем текущий коэффициент на фору - 4,5 (Можно вычленения коэффициента 7,5М сделать подобным образом супер работает

k4_5M2 = null; k4_5M1 = null

if (favorite[count]==1)

{

p1 = 0

for (j=0;j<GetClass("bets betCols2").length;j++) // ставки на Тотал 1-й сет проверить на 7.5

{

p1 = GetClass("bets betCols2")[j].textContent

if (p1.match(/1 -4\.5 /) == "1 -4.5 ")

{

p1 = p1.match(/1 -4\.5 (.{1,5})/) // оставляем коэффициент (первую цифру)

k4_5M1 = p1[0].replace(/1 -4\.5 /,"") // вычленяем коэффициентв форы -4,5 для первого игрока

}

}

}

if (favorite[count]==2)

{

p1 = 0

for (j=0;j<GetClass("bets betCols2").length;j++) // ставки на Тотал 1-й сет проверить на 7.5

{

p1 = GetClass("bets betCols2")[j].textContent

if (p1.match(/2 -4\.5 /) == "2 -4.5 ")

{

p1 = p1.match(/2 -4\.5 (.{1,5})/) // оставляем коэффициент (первую цифру)

k4_5M2 = p1[0].replace(/2 -4\.5 /,"") // вычленяем коэффициентв форы -4,5 для первого игрока

}

}

}

//------------------------------------------------------

// - анализ ставки при при счете х3:1 (1:3х и счет 00:30 или 15:40),ставим меньше 8.5 геймов. Если нет ставки на 8.5 меньше, берем фору фаворита -3,5, если нет форы-берем победу в гейме.

// Берём коэффициент на 8.5М

k8_5M = null // изначально

if (GetClass("db-sport__periods-item").length >= 1) // только если 1-й сет или 2-й сет

{

for (j=0;j<GetClass("bets betCols2").length;j++) // ставки на Тотал на текущий сет проверить на 7.5

{

p1 = GetClass("bets betCols2")[j].textContent

if (p1.match(/8\.5 М /) != null)

{

p1 = p1.match(/8\.5 М (.{1,5})/) // оставляем коэффициент (первую цифру)

k8_5M = p1[0].replace(/8\.5 М /,"") // текущий коэффициент, только целое до точки коэффициент

}

}

} // конец проверки коэффициента ТОТАЛЫ 8.5М

//------------------------------------------------------

// Определяем текущий коэффициент на фору - 3,5 либо на первого либо на второго игрока, выход коэффициенты k3_5M1 и k3_5M2

k3_5M2 = null; k3_5M1 = null

if (favorite[count]==1)

{

p1 = 0

for (j=0;j<GetClass("bets betCols2").length;j++)

{

p1 = GetClass("bets betCols2")[j].textContent

if (p1.match(/1 -3\.5 /) == "1 -3.5 ")

{

p1 = p1.match(/1 -3\.5 (.{1,5})/) // оставляем коэффициент (первую цифру)

k3_5M1 = p1[0].replace(/1 -3\.5 /,"") // вычленяем коэффициентв форы -3,5 для первого игрока

}

}

}

if (favorite[count]==2)

{

p1 = 0

for (j=0;j<GetClass("bets betCols2").length;j++)

{

p1 = GetClass("bets betCols2")[j].textContent

if (p1.match(/2 -3\.5 /) == "2 -3.5 ")

{

p1 = p1.match(/2 -3\.5 (.{1,5})/) // оставляем коэффициент (первую цифру)

k3_5M2 = p1[0].replace(/2 -3\.5 /,"") // вычленяем коэффициентв форы -3,5 для второго игрока

}

}

}

//------------------------------------------------------

// Конец блока сбора коэффициентов ОЖ

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

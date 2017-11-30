# dantist

CRM(Customer Relationship Management app) Модуль\приложение предназначен для автоматизации основных процессов клинического обследования в работе дантистов(ортодонта).


***
dental app v.2
  -UI дизайн макет для модуля "Дантист"
  -front-end логика работы
  _____________________________
  В разработке. 
  
Мои линки - вам бесполезно, мсье:
http://cwbuecheler.com/web/tutorials/2013/node-express-mongo/
http://ciar.org/ttk/public/apigee.web_api.pdf 
http://sahatyalkabov.com/jsrecipes/#!/backend/building-a-rest-api
________

todo:
2.0. Зубы в svg - готово
2.1 Детская челюсть(реализовать смену вьюхи для взрослой челюсти и детской)
2.2. Настройки (список видов лечения в getJSON) 
2.3. Localstorage для userid:'###' пока нет данных с сервака или не пришли но есть в локалсторедже.
** фичи: Анкета 
как здесь http://cityblank.ru/upload/iblock/419/419a6dd3fc0334bdac50a8a2fe8bfcfc.png
3.Рентген снимки.

________________________________________________
ПРЕДМЕТНАЯ ОБЛАСТЬ:

Нотация(Системы нумерации зубов) статичные: link(http://stomanet.ru/terapevticheskaya-stomatologiya/sistemy-numeratsii-zubov-iso-fdi-universalnaya-zigmondi-palmera-naglyadnye-illyustratsii/)

1. FDI World Dental Federation notation (Fédération Dentaire Internationale) Система нумерации зубов ISO (FDI) ISO 3950.

                Международная двух цифровая система Виола: зубы делятся на 4 сегмента по сагиттальной и окклюзионной плоскостям. Верхний правый сегмент обозначается как  1, левый верхний —  2, левый нижний —  3, правый нижний —  4. При обозначении сегмента на первое место ставиться номер сегмента, затем порядковый номер зуба.

                Взрослый человек
                1 квадрант
                (правая сторона, верхняя челюсть)           |   2 квадрант (левая сторона, верхняя челюсть)

                18	17	16	15	14	13	12	11	            |  21	22	23	24	25	26	27	28
                ____________________________________________________________________________________________
                3 квадрант(правая сторона, нижняя челюсть)  |   4 квадрант (левая сторона, нижняя челюсть)
                48	47	46	45	44	43	42	41	            |    31	32	33	34	35	36	37	38
                ____________________________________________________________________________________________
                Номера квадрантов для детей – 5, 6, 7 и 8, расстановка цифр также производится по часовой стрелке.

                Ребенок
                5 квадрант(правая сторона, верхняя челюсть) |   6 квадрант(левая сторона, верхняя челюсть)
                55	54	53	52	51                          |	61	62	63	64	65
                __________________________________________________________________________________________
                7 квадрант(правая сторона, нижняя челюсть)  | 8 квадрант(правая сторона, нижняя челюсть)
                85	84	83	82	81	                        |   71	72	73	74	75
                ___________________________________________________________________________________________

2. Универсальная система нумерации зубов("Американская") - Универсальную систему нумерации зубов также называют «Американской» ввиду ее особенной распространенности в США. В рамках этой системы, постоянные зубы обозначаются цифрами, от 1 до 32, начиная с правого третьего моляра на верхней челюсти.

                Таблица зубов взрослого человека, посчитанных по универсальной (американской) системе:

                Левая сторона, верхняя челюсть      |   Правая сторона, верхняя челюсть
                16	15	14	13	12	11	10	9	    |   8   7	6	5	4	3	2	1
                ________________________________________________________________________
                Левая сторона,нижняя челюсть        |   Правая сторона, нижняя челюсть
                17	18	19	20	21	22	23	24	25	26	27	28	29	30	31	31

________________________________________________________________________________________________________________
                Таблица детских зубов, посчитанных по универсальной (американской) системе:

                Левая сторона, верхняя челюсть        |   Правая сторона, верхняя челюсть
                J	I	H	G	F	                  |     E	D	C	B	A 
                ________________________________________________________________________________
                Левая сторона,нижняя челюсть          |   Правая сторона, нижняя челюсть
                K	L	M	N	O	                  |     P	Q	R	S	T
                ______________________________________________________________________________________
            2.1 Альтернативная нотация детских зубов в универсальной системе 

            Левая сторона,верхняя челюсть           Правая сторона,верхняя челюсть
                10d	9d	8d	7d	6d	                        5d	4d	3d	2d	1d
                11d	12d	13d	14d	15d	                        16d	17d	18d	19d	20d
            Левая сторона,нижняя челюсть            Правая сторона,нижняя челюсть

****
3. Система Палмера
Система Палмера, или система нумерации зубов Палмера-Зигмонди, активно используется в Великобритании. Второе название этой системы – «Военная».

Обозначение зуба по Палмеру содержит символ (┘└ ┐┌) и номер/букву, отсчет ведется от срединной линии. Так, левый и правый центральные резцы взрослого человека имею номер 1, но за правым следует знак ┘, а перед левым стоит └.

                    Таблица зубов взрослого человека, обозначенных по системе Палмера:

                    Правая сторона,верхняя челюсть              Левая сторона, верхняя челюсть
                    8┘	7┘	6┘	5┘	4┘	3┘	2┘	1┘	                └1	└2	└3	└4	└5	└6	└7	└8
                    8┐	7┐	6┐	5┐	4┐	3┐	2┐	1┐	                ┌1	┌2	┌3	┌4	┌5	┌6	┌7	┌8
                    Правая сторона,нижняя челюсть               Левая сторона, нижняя челюсть
                    ___________________________________________________________________________
                    
                    Таблица зубов ребенка по системе Палмера:
                    
                    Правая сторона,верхняя челюсть      Левая сторона,верхняя челюсть
                    E┘	D┘	C┘	B┘	A┘              	└A	└B	└C	└D	└E
                    E┐	D┐	C┐	B┐	A┐	                ┌A	┌B	┌C	┌D	┌E
                    Правая сторона,нижняя челюсть       Левая сторона,нижняя челюсть
                    __________________________________________________________________

***
Статичные данные для View :

    Заболевания зубов (статические) - 
    Абсцесс зуба
    Абфракция
    Амелобластома
    Апикальный периодонтит
    Гиперестезия зубов
    Гипоплазия зубов
    Гипофосфатазия
    Кариес зубов
    Клиновидный дефект
    Некариозные поражения зубов
    Патологическая стираемость зубов
    Пульпит
    Стоматологическая травма
    Флюороз (стоматология)
    Цементома
    Эрозия эмали зубов

Состояния (выводятся на анамнез-таблицу):
Данные обозначения вносятся в карту над или под соответствующим зубом:(у нас в графу зуб)

' '   - Здоров
С     —     кариес
Р     —     пульпит
Pt    —     периодонтит
П - пломбированный
А - Парадантоз
К - коронка
И - искусственный зуб
Им - имплант
Ш - Штифт
Г - гранулема
Гк - Кистогранулема
Ки - Киста
R     —     корень
Ф     —     флюороз
Г      —    гипоплазия
Кл    —     клиновидный дефект
О     —     отсутствующий зуб

Подвижность: 
1 - подвижность
2 - подвижность
3 - подвижность

Запись производится в нотации "State-Подвижность" 
Пример: "С-1" - означает Карьес с подвижностью зуба = 1
        "Им" - без указания подвижности

___________________
Процедуры:
Зондирование-
Данная процедура осуществляют при помощи зубоврачебного зонда. Это позволяет составить суждение о характере эмали, выявить дефекты на ней. Зондом определяют плотность дна и стенок полости в твердых тканях зубов, а также их болевую чувствительность. Зондирование дает возможность судить о глубине кариозной полости, состояние ее краев.

Перкуссия-
Метод позволяет определить, имеет ли место воспалительный процесс в околоверхушечных тканях, а так же как осложнения после пломбирования апроксимальной поверхности зуба.

Пальпация-
Метод используется для выявления отечности, наличие инфильтрата на альвеолярном отростке или по переходной складке.
# dantist
dental app v.2
  -UI дизайн макет для модуля "Дантист"
  -front-end логика работы
  _____________________________
  В разработке. http://cwbuecheler.com/web/tutorials/2013/node-express-mongo/

http://ciar.org/ttk/public/apigee.web_api.pdf 


http://sahatyalkabov.com/jsrecipes/#!/backend/building-a-rest-api
________

Нотация:
 Международная двух цифровая система Виола: зубы делятся на 4 сегмента по сагиттальной и окклюзионной плоскостям. Верхний правый сегмент обозначается как  1, левый верхний —  2, левый нижний —  3, правый нижний —  4. При обозначении сегмента на первое место ставиться номер сегмента, затем порядковый номер зуба.

18  17  16  15  14  13  12  11	21  22  23  24  25  26  27  28
48  47  46  45  44  43  42  41	31  32  33  34  35  36  37  38
____________________________

  Обозначения  различных  видов  поражений  зубов.
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
____________________
<p class="dental-legend-item" >\
                            <span data-state="heal" data-legendabbr=" " data-color="white"> </span> - Здоров</p>\
                        <p class="dental-legend-item" >\
                            <span data-state="O" data-legendabbr="О" data-color="light-gray">О</span> - Отсутствующий зуб</p>\
                        <p class="dental-legend-item">\
                            <span data-state="disease" data-legendabbr="К" data-color="red">К</span> - кариес</p>\
                        <p class="dental-legend-item">\
                            <span data-state="disease" data-legendabbr="Pt" data-color="red">Pt</span> - периодонтит</p>\
                        <p class="dental-legend-item">\
                            <span data-state="plomb" data-legendabbr="П" data-color="lighter-blue">П</span> - Пломбирован</p>\
                        <p class="dental-legend-item">\
                            <span data-state="disease" data-legendabbr="A" data-color="red">A</span> - Парадантоз</p>\
                        <p class="dental-legend-item">\
                            <span data-state="koronka" data-legendabbr="К" data-color="lighter-blue">K</span> - Коронка</p>\
                        <p class="dental-legend-item">\
                            <span data-state="implant" data-legendabbr="И" data-color="light-blue">И</span> - Имплант</p>\
                        <p class="dental-legend-item">\
                            <span data-state="implant" data-legendabbr="Им" data-color="light-blue">Им</span> - Искусственный зуб</p>\
                        </div>\
                        <div  class="d-flex flex-column">\
                        <p class="dental-legend-item">\
                            <span data-state="shtift" data-legendabbr="Ш" data-color="lighter-blue">Ш</span> - Штифт</p>\
                        <p class="dental-legend-item">\
                            <span data-state="disease" data-legendabbr="Г" data-color="red">Г</span> - Гранулема</p>\
                        <p class="dental-legend-item">\
                            <span data-state="disease" data-legendabbr="Гк" data-color="red">Гк</span> - Кистогранулема</p>\
                        <p class="dental-legend-item">\
                            <span data-state="disease" data-legendabbr="Ки" data-color="red">Ки</span> - Киста</p>\
                        <p class="dental-legend-item">\
                            <span data-state="disease" data-legendabbr="Ки" data-color="red">Ки</span> - Киста</p>\
                        <p class="dental-legend-item">\
                            <span data-state="disease" data-legendabbr="К" data-color="red">R</span> - Корень</p>\
                        <p class="dental-legend-item">\
                            <span data-state="disease" data-legendabbr="Гп" data-color="red">Гп</span> - Гипоплазия</p>\
                        <p class="dental-legend-item">\
                            <span data-state="disease" data-legendabbr="Кл" data-color="red">Кл</span> - Клиновидный дефект</p> \
___________________
Процедуры:
Зондирование-
Данная процедура осуществляют при помощи зубоврачебного зонда. Это позволяет составить суждение о характере эмали, выявить дефекты на ней. Зондом определяют плотность дна и стенок полости в твердых тканях зубов, а также их болевую чувствительность. Зондирование дает возможность судить о глубине кариозной полости, состояние ее краев.

Перкуссия-
Метод позволяет определить, имеет ли место воспалительный процесс в околоверхушечных тканях, а так же как осложнения после пломбирования апроксимальной поверхности зуба.

Пальпация-
Метод используется для выявления отечности, наличие инфильтрата на альвеолярном отростке или по переходной складке.
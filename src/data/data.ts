import Planet from "../model/Planet.js";
type TaskData = {
    id: string;
    title: string;
    init: string;
    cond: string;
    help: string;
    solv: string;
    final: string;
}

export const data: TaskData[] = [
    {
        id: 'task1',
        title: 'Зірка з планетою на круговій орбіті',
        init:
            `[{"name":"Sun","m":10000,"r":25,"x":0,"y":0,"vx":0,"vy":0,"color":"yellow"},
            {"name":"Earth","m":10,"r":8,"x":400,"y":0,"vx":0,"vy":0,"color":"lightblue"}]`,
        cond:
            `Є система «зірка-планета» і планета знаходиться на заданій відстані від зірки. 
Надайте планеті таку швидкість, щоб вона почала рухатись навколо зірки по круговій орбіті.`,
        help:
            `І зірка, і планета будуть обертатися навкруги центра мас системи. 
<p>Якщо маса планети є малою відносно маси зірки, центр мас і центр зірки майже співпадають і можна казати про обертання планети навкруги зірки.
<p>Рух по колу потребує щоб відцентрова сила врівноважувалася силою тяжіння, тобто
<p>\\( {mv^2 \\over r} = {G Mm \\over r^2} \\) 
<p>З цієї формули можна вирахувати необхідну швидкість.`,
        solv:
            `Виводимо швидкість із попередньої формули
<p>\\( v=\\sqrt{GM \\over r} \\)
<p>З вихідних даних \\( M = 10^4, G = 1, r=400 \\) обчислюємо швидкість планети: \\(v = 5\\).
<p>В моделі швидкості задаються x і y компонентами, тому в заданому положенні планети v = (0, 5).`,
        final:
            `[{"name":"Sun","m":10000,"r":25,"x":0,"y":0,"vx":0,"vy":0,"color":"yellow"},
 {"name":"Earth","m":10,"r":8,"x":400,"y":0,"vx":0,"vy":5,"color":"lightblue"}]`,
    },


    {
        id: 'task2',
        title: 'Зірка з планетою на еліптичній орбіті',
        init:
            `[{"name":"Sun","m":10000,"r":25,"x":0,"y":0,"vx":0,"vy":0,"color":"yellow"},
    {"name":"Earth","m":10,"r":8,"x":400,"y":0,"vx":0,"vy":5,"color":"lightblue"}]`,
        cond:
            `Є система «зірка-планета» і планета знаходиться на заданій відстані від зірки. 
Надайте планеті таку швидкість, щоб вона почала рухатись навколо зірки по еліпсу з великою віссю d.`,
        help:
            `Найпростіше вирішення буде, якщо в початковому стані планета знаходиться в афелію чи в перигелію своєї орбіти.
<p>Спершу визначимо, де саме. Якщо r < d/2, це перигелій, інакше, це афелій.
<p>За законом тяжіння Ньютона потенційна енергія планети масою m на відстані від зірки r дорівнює
 \\( -GMm \\over r \\).
<p>За законом збереження енергії сума кінетичної і потенційної енергії планети в афелії і в перигелії однакові.
<p>\\( {mv_a^2 \\over 2}-{GMm \\over r_a} = {mv_p^2 \\over 2}-{GMm \\over r_p}  \\)
<p>З цієї формули и закону збереження кутового моменту можна отримати початкову швидкість планети.
`,
        solv:
            `За законом збереження кутового моменту \\( mv_a r_a=mv_p r_p  \\),
<p>тобто \\( v_p = {r_a \\over r_p}v_a \\)
<p>Знаходимо \\(v_a\\) з огляду на те, що \\(r_p=d-r_a \\)
<p>                           \\( v_a=\\sqrt{ 2GMr_p \\over dr_a  }  \\)
<p>Так само виводиться і \\( v_p=\\sqrt{ 2GMr_a \\over dr_p  }  \\)
<p>Приклад. 
<p>\\( M = 10^4;    G = 1;    r_a=300;    d=400.   v_a≈ 3.162  \\)
`,
        final:
            `[{"name":"Sun","m":10000,"r":25,"x":0,"y":0,"vx":0,"vy":0,"color":"yellow"},
    {"name":"Earth","m":10,"r":8,"x":400,"y":0,"vx":0,"vy":3.162,"color":"lightblue"}]`,
    },

    {
        id: 'task3',
        title: 'Подвійна зірка',
        init: `[{"name":"Sun1","m":10000,"r":20,"x":-300,"y":0,"vx":0,"vy":0,"color":"yellow"},
                  {"name":"Sun2","m":10000,"r":20,"x": 300,"y":0,"vx":0,"vy":0,"color":"coral"}]`,
        cond:
            `Створити систему подвійної зірки.Обидві зірки мають однакові маси m, відстанню між їх центрами – r.
Обрати таку швидкість окремих зірок, яка забезпечить існування системи подвійної зірки.`,

        help:
            `Подвійна зірка буде існувати, коли зірки будуть обертатися навколо центра мас, 
а не розлетяться на нескінченну відстань і не впадуть одна на одну.
<p>В будь-який момент часу система має потенційну енергію тяжіння \\( -{Gm^2}\\over r \\)   
і кінетичну енергію \\( mv^2 \\).
<p>Надали зірки можуть зближуватися, розходитися або зберігати початкову відстань, якщо траєкторія кожної зірки коло (рис а). 
В цьому випадку доцентрова сила \\(mv^2 \\over r/2 \\) є силою тяжіння до протилежної зірки \\( Gm^2 \\over r^2 \\).`,

        solv:
            `Прирівняємо силу тяжіння до доцентрової сили 
\\( {mv^2 \\over r/2}={Gm^2 \\over r^2}  \\) 
і знайдемо початкову швидкість.
<p>\\( v= √{Gm \\over 2r} \\)
<p>Приклад. \\( m=10000;  r=600;  v ≈ 2.888 \\) `,

        final:
            `[{"name":"Sun1","m":10000,"r":20,"x":-300,"y":0,"vx":0,"vy":-2.888,"color":"yellow"},
    {"name":"Sun2","m":10000,"r":20,"x": 300,"y":0,"vx":0,"vy":2.888,"color":"coral"}]`,

    },


    {
        id: 'task4',
        title: 'Зірка - планета - супутник',
        init: `[{"name":"Sun","m":10000,"r":25,"x":0,"y":0,"vx":0,"vy":0,"color":"yellow"},
            {"name":"Earth","m":10,"r":5,"x":400,"y":0,"vx":0,"vy":0,"color":"lightblue"},
            {"name":"Moon","m":0.1,"r":2,"x":410,"y":0,"vx":0,"vy":0,"color":"white"}]` ,
        cond:
            `Створити систему зірка-планета-супутник. Планета обертається навкруги зірки, а супутник - навкруги планети.`,
        help:
            `В цьому завданні перед нами повстає славнозвісна проблема трьох тіл, але в окремих випадках ця проблема вирішується просто.  
Зараз «окремість» полягає в тому, що \\( M ≫ m_p ≫ m_s \\),  де \\(M\\) - маса зірки, \\(m_p\\) - маса планети, \\(m_s\\) - маса супутника. 
<p>Спочатку змусимо планету обертатися навкруги зірки без супутника. 
Швидкість планети вирахуємо за формулою \\( v=\\sqrt{GM \\over r_p} \\) , тут \\( r_p \\) - відстань від планети до зірки.
<p>Потім, дамо планеті супутник, який буде кружляти навкруги планети, як планета кружляє навкруги зірки.`,
        solv:
            `При визначенні швидкості супутника врахуємо, що планета, на відміну від зірки, рухається.
<p> \\( v_s=\\sqrt{{G m_p}\\over r_s} + v_p  \\)
<p>Приклад. \\( M=10000;  m_p=100;   m_s=0.1;  \\) \\(   r_p=400; r_s=10;   v_p=5;   v_s=1+5=6 \\)`,
        final: `[{"name":"Sun","m":10000,"r":25,"x":0,"y":0,"vx":0,"vy":0,"color":"yellow"},
    {"name":"Earth","m":10,"r":5,"x":400,"y":0,"vx":0,"vy":5,"color":"lightblue"},
    {"name":"Moon","m":0.1,"r":2,"x":410,"y":0,"vx":0,"vy":6,"color":"white"}]`

    },

    {
        id: 'task5',
        title: 'Перша космічна швидкість',
        init: `[{"name":"Earth","m":10000,"r":300,"x":0,"y":0,"vx":0,"vy":0,"color":"green"},
    {"name":"ball","m":0.001,"r":5,"x":0,"y":320,"vx":5,"vy":0,"color":"coral"}]`,
        cond:
            `Задана планета і висота над поверхнею планети. 
З цієї висоти робить горизонтальний постріл гармата, яку зобразив Ньютон в книзі «Трактат про систему світу». 
Оберіть швидкість снаряду, яка забезпечить його політ по колу навкруги планети. 
Роль снаряду буде виконувати планета-супутник, яку розташуємо на висоті гори.`,
        help:
            `Маса планети - M, радіус планети - r, висота над поверхнею - h, швидкість снаряду – v.  
<p>Для польоту по колу радіусом R = r + h нам відома формула
<p> \\( v=\\sqrt{GM/R} \\)
`,
        solv:
            `Приклад. \\( M= 10^4;   r=300;  h=20;  v=5.590 \\).`,
        final:
            `[{"name":"Earth","m":10000,"r":300,"x":0,"y":0,"vx":0,"vy":0,"color":"green"},
        {"name":"ball","m":0.001,"r":5,"x":0,"y":320,"vx":5.590,"vy":0,"color":"coral"}]`,
    },

    {
        id: 'task6',
        title: 'Ракета від Землі до Сонця',
        init:
            `[{"name":"Sun","m":1000,"r":25,"x":0,"y":0,"vx":0,"vy":0,"color":"yellow"},
    {"name":"Earth","m":0.01,"r":8,"x":400,"y":0,"vx":0,"vy":1.581,"color":"lightblue"}]`,

        cond:
            `Планета обертається навкруги центральної зірки по круговій орбіті.
Запустити ракету з планети так, щоб вона наблизилась до центра зірки на два її радіуса 
і після того стала обертатися навкруги зірки. Визначити початкову швидкість ракети.`,
        help:
            `Нехай R – радіус зірки, M – її маса, S – відстань від планети до зірки.
Тоді ракета має рухатися по еліпсу з великою віссю \\( d=r_a+r_p \\) ,  де \\( r_a=S,   r_p=2R  \\)
`,
        solv:
            `Спершу треба з'ясувати, в афелії чи перигелії знаходиться ракета підчас старту. 
<p>Якщо S > 2R, це афелій.
<p>\\( v_a=\\sqrt{{2GMr_p} \\over d r_a } + v_{планети}\\)   
<p>Приклад. \\( M= 1000;   S=400;  R=25;  v=-0.836 \\)
`,
        final:
            `{"planets":[{"name":"Earth","m":0.01,"r":8,"x":400,"y":0,"vx":0,"vy":1.581,"color":"lightblue"},
    {"name":"Sun","m":1000,"r":25,"x":0,"y":0,"vx":0,"vy":0,"color":"yellow"}],
    "starters":[{"kind":1,"velo":-0.836,"param2":0,"startStep":0,"planetName":"Earth"}]}`,

    },

    {   
        id: 'task7',
        title: 'До орбіти Марсу',
        init: `[{"name":"Sun","m":1000,"r":20,"x":0,"y":0,"vx":0,"vy":0,"color":"yellow"},
             {"name":"Earth","m":0.001,"r":7,"x":300,"y":0,"vx":0,"vy":1.826,"color":"lightblue"},
             {"name":"Mars","m":0.001,"r":6,"x":400,"y":0,"vx":0,"vy":1.5811,"color":"orange"}]`,
        cond: `Дві планети (умовно Земля і Марс) обертаються навкруги центральної зірки (умовно Сонця) по круговим орбітам. 
Запустити ракету с Землі так, щоб вона досягла орбіти Марса. 
Визначити мінімально необхідну швидкість ракети.`,
        help: `Згідно з першим законом Кеплера орбіта ракети має бути еліпсом, в одному з фокусів якого знаходиться Сонце. 
<p>Перигелійна відстань орбіти це відстань від зірки до Землі, афелійна відстань – відстань до Марса. 
<p>Будемо зневажати тяжінням Землі, яке діє на ракету. В стартовому положенні ракети 
прискорення від Землі становить 0.001/9² ≈ 1e-2, а прискорення від Сонця 1000/300² ≈ 1e-5, тобто в 1000 разів більше.
`,
        solv: `Скористаємося вже відомою формулою для розрахунку початкової, тобто перигелійної, швидкості ракети.
<p>\\( v_p=\\sqrt{\\frac{2GMr_a}{(r_a+r_p)r_p}} \\) 
<p>Щоб визначити швидкість ракети відносно місця старту, віднімемо від неї швидкість Землі. 
<p>Приклад. \\( M= 1000,    v_p= 1.952,   v_{rocket}= v_p-v_{Earth} = 0.126 \\). `,
        final: `{"planets":[{"name":"Mars","m":0.001,"r":6,"x":400,"y":0,"vx":0,"vy":1.581,"color":"orange"},
{"name":"Earth","m":0.001,"r":7,"x":300,"y":0,"vx":0,"vy":1.826,"color":"lightblue"},
{"name":"Sun","m":1000,"r":20,"x":0,"y":0,"vx":0,"vy":0,"color":"yellow"}],
"starters":[{"kind":1,"velo":0.126,"count":0,"size":0,"startStep":0,"planetName":"Earth"}]}`,
    },

    {   
        id: 'task8',
        title: 'Подорож на Марс',
        init: `{"planets":[{"name":"Mars","m":0.001,"r":6,"x":400,"y":0,"vx":0,"vy":1.5811388300841898,"color":"orange"},
        {"name":"Earth","m":0.001,"r":7,"x":300,"y":0,"vx":0,"vy":1.8257418583505538,"color":"lightblue"},
        {"name":"Sun","m":1000,"r":20,"x":0,"y":0,"vx":0,"vy":0,"color":"yellow"}],
        "starters":[]}`,
        cond: `Щоб висадитися на Марс, ракета повинна досягти його орбіти в той самий час,
    коли там буде знаходитися планета Марс. Треба обрати не лише швидкість ракети, а і час її запуску.`,
        help: 
`Завдяки круговій орбіті Марса, період його обертання можна визначити, поділивши довжину орбіти на швидкість планети.
\\( {2πr_M} \\over v_M \\)
<p> Третій закон Кеплера говорить, що квадрати періодів обертання відносяться, 
як куби великих осей орбіт, тому період обертання ракети  \\( T_r = T_M \\sqrt{   {{r_r}^3} \\over {{r_M}^3}   } \\)
і ракета досягне орбіти Марса за половину свого періоду  \\( T_r/2 \\).
<p> Кутова швидкість марса \\( ω_M=2π/T_M \\)  , тому за цей час Марс просунеться на кут   
\\( {ω_M T_r} \\over 2 \\) = \\( π {{T_r} \\over {T_M}}  \\). 
<p> До зустрічі з ракетою йому не вистачить кута \\( φ=π-π {T_r \\over T_M} \\) 
<p>Тому запускати ракету с Землі варто, коли у своєму русі Марс 
буде випереджати Землю на кут φ, або, що те ж саме, Земля буде попереду Марса на кут \\( 2π - φ \\).`,
        solv: 
`Кутова швидкість Землі відносно Марса \\( ω = ω_E - ω_M = 2π(1/T_E -  1/T_M ) \\)
<p>Виходячи з початкового стану системи, потрібне випередження виникне за час
\\( t = {{2π-φ} \\over {ω}}\\)
<p>Приклад. \\( v_{rocket} = 0.126; t = 2678 \\). `,

        final: `{"planets":[{"name":"Mars","m":0.001,"r":6,"x":400,"y":0,"vx":0,"vy":1.581,"color":"orange"},
        {"name":"Earth","m":0.001,"r":7,"x":300,"y":0,"vx":0,"vy":1.826,"color":"lightblue"},
        {"name":"Sun","m":1000,"r":20,"x":0,"y":0,"vx":0,"vy":0,"color":"yellow"}],
        "starters":[{"kind":1,"velo":0.126,"count":0,"size":0,"startStep":2678,"planetName":"Earth"}]}`,
    },

    // {   
    //     id: 'taskX',
    //     title: '',
    //     init: ``,
    //     cond: `Чисте небо - робіть, що хочте.`,
    //     help: ``,
    //     solv: ``,
    //     final: ``,
    // },

]



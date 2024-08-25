export const data = [
    {   
        name: 'task1',
        title: 'Зірка з планетою на круговій орбіті',
        planets: [{"name":"Sun","m":10000,"r":25,"x":0,"y":0,"vx":0,"vy":0,"color":"yellow"},
                  {"name":"Earth","m":10,"r":8,"x":400,"y":0,"vx":0,"vy":0,"color":"lightblue"}],
        cond: `Є масивна зірка і планета біля неї. Зробіть так, щоб планета рухалась по круговій орбіті.`,
        help: 
`Щоб планета рухалася по колу навкруги майже нерухомої зірки, маса планети має бути малою відносно маси зірки.
<p>Рух по колу потребує, щоб відцентрова сила врівноважувалася силою тяжіння, тобто
<p>\\( {mv^2 \\over r} = {G Mm \\over r^2} \\)
<p> тут M - маса зірки, m - маса планети, r - відстань, v - швидкість планети, G = 1.
<p>З цього витікає  \\( v=\\sqrt{GM \\over r} \\)
<p>Приклад. \\( M = 10^4;    G = 1;    r=400;    v=\\sqrt{10000 \\over 400}= 5 \\)`
    },


    {   
        name: 'task2',
        title: 'Зірка з планетою на еліптичній орбіті',
        planets: [{"name":"Sun","m":10000,"r":20,"x":0,"y":0,"vx":0,"vy":0,"color":"yellow"},
                  {"name":"Earth","m":1,"r":6,"x":300,"y":0,"vx":0,"vy":5.164,"color":"lightblue"}],
        cond: 
`Створити систему зірка-планета. Маса зірки M, найбільша відстань від планети до зірки в афелію становить \\(r_a\\). 
<br>Дайте планеті таку швидкість, щоб велика піввісь орбіти дорівнювала r.`,
        help: 
`Потенційна енергія тяжіння планети масою m на відстані від зірки r дорівнює \\( -GMm \\over r \\).
<p>Якщо задана тангенціальна швидкість становить повну швидкість планети, тобто нормальну частину швидкості будемо вважати нульовою, 
то за законом збереження енергії сума кінетичної і потенційної енергії планети в афелії і в перигелії однакові.
<p>\\( {mv_a^2 \\over 2}-{GMm \\over r_a} = {mv_p^2 \\over 2}-{GMm \\over r_p}  \\)
<p>В той же час за законом збереження кутового моменту
<p>\\( mv_a r_a= mv_p r_p  \\)
<p>тобто
<p>\\( v_p = {r_a \\over r_p}v_a = {r_a \\over r-r_a}v_a    \\)

<p>Підставляємо друге в перше і знаходимо \\( v_a  \\).
<p>\\( v_a=\\sqrt{ 2GM(r- r_a) \\over rr_a  }  \\)
<p>Приклад. 
<p>\\( M = 10^4;    G = 1;    r_a=300;    r=500.   Відповідь:  v_a≈ 5.164  \\)`
    },


    {   
        name: 'task3',
        title: 'Подвійна зірка',
        planets: [{"name":"Sun1","m":10000,"r":20,"x":-300,"y":0,"vx":0,"vy":0.617,"color":"yellow"},
                  {"name":"Sun2","m":10000,"r":20,"x": 300,"y":0,"vx":0,"vy":-0.617,"color":"aquamarine"}],
        cond: 
`Створити систему подвійної зірки з однаковими масами m і відстанню між центрами – r. 
<br>Обрати швидкості зірок, які б забезпечили існування подвійної зірки.`,    
        help: 
`В будь-який момент часу система має потенційну енергію тяжіння
<p>  \\( H=-{Gm^2 \\over r} \\)  
<p>і кінетичну енергію 
<p>\\( E=  {mv^2 \\over 2}+ {mv^2 \\over 2}=mv^2  \\)
<p>Нехай зірки обертаються по колу. В цьому випадку доцентрова сила є силою тяжіння до протилежної зірки і справедливе співвідношення
<p>\\( {mv^2 \\over r/2}={Gm^2 \\over r^2}  \\) 
<p>\\( v= \\sqrt{Gm⁄2r}  \\)
<p>Наприклад, \\( m=10000;  r=600;  v= \\sqrt{1*10000 \\over 2*600} ≈ 2.888 \\) .
`, 
    },


    {   
        name: 'task4',
        title: 'Зірка - планета - супутник',
        planets: [{"name":"Sun","m":10000,"r":25,"x":0,"y":0,"vx":0,"vy":0,"color":"yellow"},
            {"name":"Earth","m":10,"r":5,"x":400,"y":0,"vx":0,"vy":0,"color":"lightblue"},
            {"name":"Moon","m":0.1,"r":2,"x":410,"y":0,"vx":0,"vy":0,"color":"white"}] ,
        cond: 
`Створити систему зірка-планета-супутник. Планета обертається навкруги зірки, а супутник - навкруги планети.`,
        help: 
`<p>В цьому завданні перед нами повстає славнозвісна проблема трьох тіл, але окремі випадки цієї проблеми вирішуються просто. 
Зараз «окремість» полягає в тому, що \\( M ≫ m_p ≫ m_s \\),  де \\(M\\) - маса зірки, \\(m_p\\) - маса планети, \\(m_s\\) - маса супутника. 
<p>Спочатку змусимо планету обертатися навкруги зірки без супутника, так як у першому завданні. 
<p>Швидкість планети вирахуємо за формулою \\( v=\\sqrt{GM \\over r} \\) .
<p>Потім, дамо планеті супутник, який буде кружляти навкруги планети за тою самою формулою. 
При визначенні швидкості супутника врахуємо, що планета, на відміну від зірки, також рухається і швидкість планети є складовою швидкості супутника.
<p>Приклад. \\( M=10000;  m_p=100;   m_s=0.1;  \\) \\(   r_a=400; r_s=10;   v_p=5;   v_s=1+5=6 \\) .    
`, 
    },


    {   
        name: 'task5',
        title: 'Перша космічна швидкість',
        planets: [{"name":"Sun","m":10000,"r":300,"x":0,"y":0,"vx":0,"vy":0,"color":"green"},
            {"name":"Noname","m":1,"r":5,"x":0,"y":310,"vx":5.68,"vy":0,"color":"white"}],
        cond: `Задана планета і висота над поверхнею платени. З цієї висоти робить горизонтальний постріл гармата Ньютона.
        Оберіть швидкість снаряду, яка забезпечить його політ по колу навруги планети.`,
        help: ``, 
    },

    // {   
    //     name: 'taskX',
    //     title: '',
    //     planets: [],
    //     cond: `Чисте небо - робіть, що хочте.`,
    //     help: ``, 
    // },

]
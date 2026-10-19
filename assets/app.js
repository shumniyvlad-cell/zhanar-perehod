/* Жанар Сулейменова · «Переход» — скрипты сайта. Данные никуда не отправляются: всё считается в браузере. */
(function () {
  'use strict';

  // Ссылки — меняются здесь, в одном месте
  var LINKS = {
    bot: 'https://t.me/perehod_zhanar_bot',       // плейсхолдер: заменить после регистрации бота
    whatsapp: 'https://wa.me/77476182971',
    channel: 'https://t.me/+rRbYb-FqpjgyZWMy'
  };

  // Шапка: тонкая линия после прокрутки
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 8); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Места под фото: если файла нет — показываем аккуратную заглушку
  document.querySelectorAll('.photo img').forEach(function (img) {
    var box = img.closest('.photo');
    var fail = function () { box.classList.add('is-empty'); img.remove(); };
    if (img.complete && img.naturalWidth === 0) fail();
    else img.addEventListener('error', fail);
  });

  // Кнопки WhatsApp с предзаполненным текстом: <a data-wa="текст">
  document.querySelectorAll('[data-wa]').forEach(function (a) {
    a.href = LINKS.whatsapp + '?text=' + encodeURIComponent(a.getAttribute('data-wa'));
    a.target = '_blank';
    a.rel = 'noopener';
  });

  // Кнопки бота: <a data-bot="метка">
  document.querySelectorAll('[data-bot]').forEach(function (a) {
    a.href = LINKS.bot + '?start=' + a.getAttribute('data-bot');
    a.target = '_blank';
    a.rel = 'noopener';
  });

  // Год в футере
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  // Мини-расчёт «Твой 2027»
  var form = document.getElementById('calc-form');
  if (!form) return;

  // ЧЕРНОВИК: тексты утверждает Жанар перед запуском
  var NUMBERS = {
    1: { name: 'Лидер', power: 'Начинать, вести за собой, принимать решения.', stuck: 'Тянешь всё сама и не просишь помощи.', q: 'Где в 2027 году отпустить контроль?' },
    2: { name: 'Дипломат', power: 'Чувствовать людей, соединять, договариваться.', stuck: 'Живёшь чужими ожиданиями и избегаешь конфликтов.', q: 'Где в 2027 году выбрать себя?' },
    3: { name: 'Творец', power: 'Идеи, слово, умение вдохновлять.', stuck: 'Начинаешь многое и не доводишь до конца.', q: 'Что в 2027 году довести до результата?' },
    4: { name: 'Строитель', power: 'Системность, надёжность, умение выстроить порядок.', stuck: 'Работаешь без радости: «надо» вместо «хочу».', q: 'Где в 2027 году разрешить себе лёгкость?' },
    5: { name: 'Свобода', power: 'Перемены, общение, движение вперёд.', stuck: 'Распыляешься и убегаешь от рутины.', q: 'Чему в 2027 году сказать твёрдое «да»?' },
    6: { name: 'Забота', power: 'Семья, красота, ответственность за близких.', stuck: 'Заботишься обо всех, кроме себя.', q: 'Как в 2027 году позаботиться о себе?' },
    7: { name: 'Мудрость', power: 'Глубина, анализ, интуиция.', stuck: 'Уходишь в себя и не доверяешь.', q: 'Где в 2027 году перейти от знания к действию?' },
    8: { name: 'Сила', power: 'Деньги, управление, масштаб.', stuck: 'Всё даётся через усилие и контроль.', q: 'Где в 2027 году деньги пойдут через лёгкость?' },
    9: { name: 'Служение', power: 'Смысл, широта взгляда, помощь людям.', stuck: 'Живёшь для мира и теряешь себя.', q: 'Что в 2027 году завершить, чтобы начать новое?' }
  };

  var input = document.getElementById('birth');
  var error = document.getElementById('calc-error');
  var result = document.getElementById('result');

  // Маска ДД.ММ.ГГГГ
  input.addEventListener('input', function () {
    var d = input.value.replace(/\D/g, '').slice(0, 8);
    var out = d.slice(0, 2);
    if (d.length > 2) out += '.' + d.slice(2, 4);
    if (d.length > 4) out += '.' + d.slice(4, 8);
    input.value = out;
    error.hidden = true;
  });

  function parse(value) {
    var m = /^(\d{1,2})[.\/-](\d{1,2})[.\/-](\d{4})$/.exec(value.trim());
    if (!m) return null;
    var day = +m[1], month = +m[2], year = +m[3];
    var now = new Date().getFullYear();
    if (year < 1920 || year > now || month < 1 || month > 12 || day < 1) return null;
    var dt = new Date(Date.UTC(year, month - 1, day));
    if (dt.getUTCDate() !== day || dt.getUTCMonth() !== month - 1) return null;
    return { day: day, month: month, year: year };
  }

  function reduce(n) {
    var steps = [n];
    while (n > 9) {
      n = String(n).split('').reduce(function (s, c) { return s + (+c); }, 0);
      steps.push(n);
    }
    return { value: n, steps: steps };
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var date = parse(input.value);
    if (!date) {
      error.textContent = 'Проверь дату: нужен формат ДД.ММ.ГГГГ, например 29.03.1985.';
      error.hidden = false;
      result.classList.remove('is-shown');
      input.focus();
      return;
    }
    var r = reduce(date.day);
    var n = r.value;
    var data = NUMBERS[n];
    var dd = String(date.day).padStart(2, '0');
    var calcText = r.steps.length > 1
      ? 'День рождения ' + dd + ': ' + dd.split('').join(' + ') + ' = ' + r.steps[1] + (r.steps.length > 2 ? ', ' + String(r.steps[1]).split('').join(' + ') + ' = ' + n : '')
      : 'День рождения ' + dd + ': число ' + n;

    document.getElementById('r-num').textContent = n;
    document.getElementById('r-name').textContent = data.name;
    document.getElementById('r-calc').textContent = calcText;
    document.getElementById('r-power').textContent = data.power;
    document.getElementById('r-stuck').textContent = data.stuck;
    document.getElementById('r-q').textContent = data.q;
    document.getElementById('r-bot').href = LINKS.bot + '?start=site_calc_' + n;
    result.classList.add('is-shown');
    result.setAttribute('data-number', n);
    result.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  });
})();

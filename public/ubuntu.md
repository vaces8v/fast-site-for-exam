# Установка и настройка Ubuntu

## Введение
Данная страница служит шпаргалкой по установке и первичной настройке Ubuntu (актуально для версий **24.04 LTS** и новее).

## Минимальные системные требования
- 2 ГБ оперативной памяти (рекомендуется ≥ 4 ГБ)
- 20 ГБ свободного места на диске
- Процессор с поддержкой 64 бит
- USB-порт или DVD-привод для установки

## Создание виртуальной машины в VirtualBox
1. Скачайте ISO-образ с официального сайта **ubuntu.com**.
2. Откройте **VirtualBox → Создать** и задайте:
   - **Имя**: Любое
   - **Образ**: путь до iso образа
   - **Оборудование**: Основная память - минимум 4гб; процессоры - минимум 4
3. Так же внизу выберите пункт с галочкой **Пропустить автоматическую установку**
4. Готово.
5. Перед запуском нажимте на ПКМ по вирутальной машине и перейдите в настройки.
6. В настройках VM (⚙️ **Настройки → Сеть**) выберите тип подключения **Сетевой мост** (всместо NAT).
7. Теперь **Запустите** и следуйте стандартному графическому установщику Ubuntu (язык, раскладка, тип установки, пользователь и пароль).

## Установка Ubuntu
1. В начале установки нажмите **Enter** на «Try or Install Ubuntu».
2. Далее следуя установке проста нажмайте постоянно некст и не меняйте язык на Русский остовайтесь на Английском.
5. Учетную запись тоже создовайте на английском без спец.симовлов.
6. После установки система попросит перезагрузиться на кнопку Restart и попросит нажать **Enter** после перезагрузки.

## Начальная настройка
1. Откройте терминал сочитанием **Ctrl * Alt + T**
2. Обновите систему командой:

```bash
sudo apt update && sudo apt upgrade -y
```

**Разбор команды**
- **sudo** — временно даём права суперпользователя.
- **apt** — менеджер пакетов Ubuntu.
- **update** — обновляет список доступных пакетов.
- **&&** — выполняет следующую команду только при успешном завершении предыдущей.
- **upgrade** — обновляет установленные пакеты до новых версий.
- **-y** — автоматически отвечает «yes» на все вопросы (не требует ввода).

2. Установите нужные пакеты:

```bash
sudo apt install -y build-essential
```

**Разбор команды**
- **install** — подкоманда apt для установки пакетов.
- **-y** — автоматическое подтверждение установки.
- **build-essential** — базовый набор компиляторов (gcc, make).

## Утилиты для настройки ядра
Вам ничего не нужно настравить и делать, сама установка ОС подорозумевает это.

### Настройка SSH
1. Установите сервер SSH:

```bash
sudo apt install -y openssh-server
```

2. Откройте конфигурацию:

```bash
sudo nano /etc/ssh/sshd_config
```

Рекомендуемые изменения:

```bash
PermitRootLogin no      # Запрет логина root
PasswordAuthentication no # Используем только ключи
```

3. Так же разрешите доступ для Брандмауера на стандартный порт ssh

```bash
sudo ufw allow 22
```

4. Примените:

```bash
sudo systemctl restart ssh
```

### Удалённый доступ к активной сессии (RDP)

```bash
sudo apt install -y xrdp
sudo systemctl enable --now xrdp
```

Теперь можно подключаться через любой RDP-клиент по адресу **<IP-Ubuntu>:3389**

Чтобы узнать свой ip в сети используйте команду:

```bash
hostname -I
```
**-I** обязательно должна быть большой, т.к. маленькая -i устарела и указывает на айпи loopback (127.0.0.1 ~ localhost)

## Настройка интернет-соединения
В Ubuntu настройка и проверка интернет-соединения выполняется через терминал или графический интерфейс. Рассмотрим оба варианта.  

---

**Проверка сетевых интерфейсов**  
Сначала определим, какие сетевые интерфейсы есть в системе.  

**Через терминал:**  
```bash
ip a
```
или  
```bash
ifconfig  # если не установлено, выполните: sudo apt install net-tools
```
**Пример вывода:**  
```bash
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 ...
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 ...
    link/ether 00:11:22:33:44:55 brd ff:ff:ff:ff:ff:ff
    inet 192.168.1.100/24 brd 192.168.1.255 scope global dynamic eth0
       valid_lft 86300sec preferred_lft 86300sec
3: wlan0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 ...
    link/ether aa:bb:cc:dd:ee:ff brd ff:ff:ff:ff:ff:ff
    inet 192.168.1.101/24 brd 192.168.1.255 scope global dynamic wlan0
       valid_lft 86300sec preferred_lft 86300sec
```
Здесь:  
- **eth0** или **enp0s3** — проводной интерфейс,  
- **wlan0** — беспроводной интерфейс,  
- **lo** — локальный интерфейс (loopback, 127.0.0.1).  

---

**Проверка подключения к интернету**  
**Пинг до DNS-сервера (Google, Cloudflare)**  
```bash
ping -c 4 8.8.8.8  # Google DNS
ping -c 4 1.1.1.1  # Cloudflare DNS
```
**Если пинг проходит:**  
```
64 bytes from 8.8.8.8: icmp_seq=1 ttl=117 time=12.3 ms
64 bytes from 8.8.8.8: icmp_seq=2 ttl=117 time=11.8 ms
...
```
✅ Интернет работает.  

**Если пинг не проходит:**  
```
ping: connect: Network is unreachable
```
❌ Проблема с подключением.  

**Проверка DNS**  
```bash
ping -c 4 google.com
```
**Если доменное имя не резолвится:**  
```
ping: google.com: Temporary failure in name resolution
```
👉 Проблема с DNS (попробуйте прописать DNS вручную).  

---

**Настройка сети вручную (если DHCP не работает)**  
**Изменение IP, шлюза и DNS (временно, до перезагрузки)**  
```bash
sudo ip addr add 192.168.1.100/24 dev eth0  # задаём IP
sudo ip route add default via 192.168.1.1    # задаём шлюз
echo "nameserver 8.8.8.8" | sudo tee /etc/resolv.conf  # меняем DNS
```
**Постоянная настройка (через Netplan, если используется)**  
Файлы конфигурации находятся в **/etc/netplan/** .  
```bash
sudo nano /etc/netplan/01-netcfg.yaml
```
**Пример конфига для статического IP:**  
```yaml
network:
  version: 2
  renderer: networkd
  ethernets:
    eth0:
      addresses: [192.168.1.100/24]
      gateway4: 192.168.1.1
      nameservers:
        addresses: [8.8.8.8, 1.1.1.1]
```
**Применяем изменения:**  
```bash
sudo netplan apply
```

**Проверка маршрутизации**  
**Просмотр таблицы маршрутизации**  
```bash
ip route
```
**Пример вывода:**  
```
default via 192.168.1.1 dev eth0 proto dhcp metric 100 
192.168.1.0/24 dev eth0 proto kernel scope link src 192.168.1.100 metric 100 
```
Если нет строки с **default via**, значит, шлюз не настроен.  

**Проверка доступности шлюза**  
```bash
ping 192.168.1.1  # замените на ваш шлюз
```
Если шлюз недоступен, проблема в локальной сети.  

Проверка сети

```bash
ping -c 4 1.1.1.1   # Проверяем доступ к интернету
curl https://example.com
```

## Базовое программное обеспечение

```bash
sudo apt install -y vim htop net-tools ufw gparted
```

## Установка виртуального принтера

```bash
sudo apt install -y cups-pdf
sudo adduser $USER lpadmin   # Добавляем себя в группу печати
```

**Проверка установки**
```bash
lpstat -a
```

Вывод должен быть таким:
```bash
PDF accepting requests since ...
```

PDF-файлы будут появляться в **~/PDF**.

В Ubuntu можно настроить виртуальный принтер, который позволяет сохранять документы в PDF или другие форматы без физического принтера. Вот пошаговая инструкция:

---

**Где сохраняются PDF-файлы?**
По умолчанию файлы сохраняются в:
```
/home/ваш_пользователь/PDF/
```
Если папки нет, она создастся автоматически при первой печати.

**Смена пути сохранения (опционально):**
```bash
sudo nano /etc/cups/cups-pdf.conf
```
Найдите строку:
```
Out ${HOME}/PDF
```
Измените на нужный путь, например:
```
Out /home/user/Documents/PDF_Prints
```
Перезапустите CUPS:
```bash
sudo systemctl restart cups
```

---

**Печать документа в PDF**
**Способ 1: Через графический интерфейс (например, LibreOffice)**
1. Откройте документ (LibreOffice Writer, браузер и т. д.).
2. Нажмите **Ctrl + P** (или **Файл → Печать**).
3. Выберите принтер **CUPS-PDF** или **PDF**.
4. Нажмите **Печать** → файл сохранится в папке **~/PDF/**.

**Способ 2: Через терминал (из командной строки)**
```bash
lp -d PDF файл.txt
```
Файл сохранится в **~/PDF/** с именем **файл.pdf**.

---

**4. Альтернативные виртуальные принтеры**
Если *CUPS-PDF* не подходит, можно установить другие варианты:

**а) **Generic PDF Printer** (через gtklp)**
```bash
sudo apt install gtklp
```
Затем в настройках печати (**http://localhost:631**) добавьте новый принтер с драйвером **Generic PDF Printer**.

**б) **OOo2PDF** (для OpenOffice/LibreOffice)**
```bash
sudo apt install libreoffice-pdfimport
```
Теперь в LibreOffice появится опция **`Экспорт в PDF`**.

---

**5. Проверка работы**
1. Откройте любой документ (например, в **LibreOffice**).
2. Нажмите **Печать** → выберите **`CUPS-PDF`**.
3. Проверьте папку **`~/PDF/`** — там должен быть PDF-файл.

## Резервное копирование системы
Используем **timeshift**:

```bash
sudo apt install -y timeshift
sudo timeshift --create --comments "Initial backup" --tags D
```

## Создание установочного образа системы

```bash
sudo apt install -y systemback
sudo systemback-cli   # Следуйте инструкциям для создания ISO
```

## Точки восстановления (snapper)

```bash
sudo apt install -y snapper
sudo snapper create --description "Before big update"
```

## Управление пользователями и группами

```bash
sudo addgroup devs
sudo adduser alice devs
```

### Права доступа

В Linux за доступ к файлам и каталогам отвечает классическая модель **UGO / RWX**:

| Субъект | r (4) – читать | w (2) – писать | x (1) – выполнять |
|---------|-----------------|---------------|-------------------|
| **u** — owner | ✓ | ✓ | ✓ |
| **g** — group | ✓ |   |   |
| **o** — others | ✓ |   |   |

**ls -la** показывает эти биты слева от владельца и группы:

```bash
-rw-r--r-- 1 root root 2620 Jun  1 12:00 /etc/passwd
```

**-rw-r--r--** = **0644** (6 = 4+2). Чаще всего используют **октальную** запись, где каждая цифра — сумма разрешений (r=4, w=2, x=1).

**chmod** — изменение разрешений

*Числовой синтаксис*

```bash
# сделать скрипт исполняемым только для владельца
chmod 700 backup.sh          # rwx------

# открыть чтение всем, запись только группе
chmod 664 notes.txt         # rw-rw-r--
```

*Символьный синтаксис*

```bash
chmod u+x deploy.sh         # добавить x владельцу
chmod g-w /var/www/html     # убрать w у группы
chmod o=                    # полностью запретить «other»
```

⚡ **Кейс — веб-проект**

```bash
sudo chown -R root:devs /var/www/html  # владельцем остаётся root, группа devs
sudo chmod -R 775 /var/www/html        # запись владельцу и группе, чтение остальным
```
Так разработчики из группы **devs** могут деплоить, а nginx/apache читает файлы.

**chown** и **chgrp** — смена владельца/группы

```bash
sudo chown alice reports.xlsx      # сменить владельца на alice
sudo chown -R bob:design /srv/app  # рекурсивно владелец bob, группа design
sudo chgrp devs /opt/tools         # только группа
```

Особые биты

| Бит | Цифра | Для чего | Пример |
|------|-------|----------|--------|
| setuid | 4xxx | Процесс запускается с UID владельца файла | **/usr/bin/passwd** → `-rwsr-xr-x` |
| setgid | 2xxx | Процесс / файлы в каталоге наследуют GID | `chmod g+s /srv/share` |
| sticky | 1xxx | Удалять файл может только владелец | `/tmp` → `drwxrwxrwt` |

```bash
# Каталог, где все могут писать, но удалять — лишь владелец
sudo chmod 1777 /var/public_upload

# Совместный git-репо: все новые файлы принадлежат группе devs
sudo chown -R root:devs /srv/git
sudo chmod g+s /srv/git
```

**umask** — маска по умолчанию

```bash
umask           # показать текущую (обычно 002 или 022)
umask 027       # новые файлы 640, каталоги 750
```

Добавьте строку `umask 027` в `~/.profile`, если нужно постоянно.

```bash
# дать bob право читать и писать лог, не трогая остальную схему
sudo setfacl -m u:bob:rw /var/log/app.log

# сделать так, чтобы все новые файлы в каталоге наследовали ACL группы devs
sudo setfacl -d -m g:devs:rwx /srv/share

# посмотреть результат
getfacl /var/log/app.log
```

```bash
namei -l /var/www/html/index.html  # права на каждом уровне пути
stat -c "%a %n" *                 # октальные права одним списком
```

> Краткая шпаргалка: **400** = r——, **500** = r-x, **600** = rw-, **700** = rwx, **755** = rwxr-xr-x, **775** = rwxrwxr-x, **777** = rwxrwxrwx.

---

## Аутентификация и авторизация (кратко)

- Учётные записи описаны в **/etc/passwd**, хэши паролей — в **/etc/shadow** (root-only).
- Группы перечислены в **/etc/group**; пользователь может состоять в нескольких группах (**id alice**).
- Права повышаются через **sudo** — добавьте пользователя в группу **sudo** или настройте файл **/etc/sudoers.d/<name>** с помощью **visudo**.
- PAM-модули управляют процессом входа; для SSH достаточно отредактировать **/etc/pam.d/sshd**.

```bash
# создать пользователя и сразу добавить в sudo
sudo adduser bob
sudo usermod -aG sudo bob

# заблокировать пароль (только ключи)
sudo passwd -l bob
```

> Для расширенного hardening смотрите официальные руководства CIS Benchmark или Ubuntu Security Guide.

## Журнал мониторинга
Устанавливаем **journalbeat** для отправки логов в Elasticsearch:

```bash
curl -L -O https://artifacts.elastic.co/downloads/beats/journalbeat/journalbeat-8.11.4-amd64.deb
sudo dpkg -i journalbeat-8.11.4-amd64.deb
sudo journalbeat setup -e
sudo systemctl enable --now journalbeat
```

## Установка и настройка IDE в виртуальной машине

Почему VS Code?
VS Code лёгкий, бесплатный и имеет огромное количество расширений для разных языков.

Шаг 1. Установка кода внутри гостевой Ubuntu

```bash
sudo snap install code --classic
```

Если Snap не подходит, используйте DEB-пакет:

```bash
wget -O vscode.deb "https://code.visualstudio.com/sha/download?build=stable&os=linux-deb-x64"
sudo apt install ./vscode.deb
```

Шаг 2. Настройка перенаправления клавиатуры/буфера обмена
Если вы используете VirtualBox:

1. Установите дополнения гостевой ОС:
   ```bash
   sudo apt install -y build-essential dkms linux-headers-$(uname -r)
   ```
2. В меню **Devices → Insert Guest Additions CD…** и запустите скрипт **VBoxLinuxAdditions.run**.
3. Перезагрузите виртуальную машину.

Теперь буфер обмена и перетаскивание файлов будут работать между хостом и гостем.

Шаг 3. Установка рекомендуемых расширений VS Code

```bash
code --install-extension ms-python.python
code --install-extension ms-vscode.cpptools
code --install-extension esbenp.prettier-vscode
```

Шаг 4. Настройка отладчика
Создайте **.vscode/launch.json** в проекте:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Python: Запуск файла",
      "type": "python",
      "request": "launch",
      "program": "${file}",
      "console": "integratedTerminal"
    }
  ]
}
```

Теперь можно ставить точки останова и запускать отладку.

> Подсказка: если VM тормозит, увеличьте количество ядер/памяти в настройках виртуальной машины. 

### Подбор приложений под задачи

| Категория | Рекомендуемое ПО | Зачем нужно |
|-----------|-----------------|--------------|
| Офисный пакет | **libreoffice**, OnlyOffice | Документы, таблицы, презентации |
| Управление проектами | **OpenProject**, Redmine | Канбан-доски, отчётность |
| Обмен файлами | Nextcloud, Syncthing | Расшаренные каталоги, мобильный доступ |
| Бухгалтерия | 1С:Enterprise (через **deb**-клиент) | Регламентная отчётность |

⚡ **Совет**: перед установкой составьте матрицу «функция ↔ приложение» — так легче обосновать выбор и избежать лишнего софта.

### Стартовая настройка и интерфейс программы

1. Локализуйте интерфейс (если ПО многоязычное):

   ```bash
   sudo apt install -y language-pack-ru
   LANG=ru_RU.UTF-8 appname   # однократно
   ```

2. Единый шрифт и тема GTK для всех приложений:

   ```bash
   gsettings set org.gnome.desktop.interface monospace-font-name "JetBrains Mono 11"
   gsettings set org.gnome.desktop.interface gtk-theme "Yaru-dark"
   ```

3. Горячие клавиши через **Settings → Keyboard → Shortcuts** или утилиту **gnome-tweaks**.

4. Автообновления (если поддерживаются):

   ```bash
   sudo systemctl enable --now appname-auto-update.timer
   ```

### Настройка обмена данными с другими системами

**Samba / Windows-шары**

```bash
sudo apt install -y samba cifs-utils
sudo smbpasswd -a alice            # создаём пользователя samba

echo "//srv/files /mnt/files cifs credentials=/etc/smb-cred,iocharset=utf8,uid=1000 0 0" | sudo tee -a /etc/fstab
sudo mount -a
```

**NFS-экспорт**

```bash
sudo apt install -y nfs-common
sudo mount 10.0.0.10:/exports/data /mnt/nfs
```

**SSHFS (быстрый способ поделиться каталогом)**

```bash
sudo apt install -y sshfs
sshfs bob@server:/srv/project ~/remote/project -o reconnect,compression=yes,ServerAliveInterval=15
```

**REST / SOAP** — убедитесь, что установлены **curl**, **httpie**, **soapui** для диагностики API.

### Параметры совместимости

Старые X11-приложения иногда требуют 8-битную палитру. Запустите их в отдельном вложенном сервере:

```bash
sudo apt install -y xvnc4viewer xserver-common
Xephyr :2 -screen 800x600x8 &
DISPLAY=:2 legacy-app &
```

#### Низкое разрешение

```bash
xrandr --output eDP-1 --mode 800x600   # временно
```

Для постоянной настройки создайте файл **/etc/X11/xorg.conf.d/40-lowres.conf`**с нужным видеорежимом.

Проблемы с меню и кнопками (GTK 2/Qt 4)

```bash
sudo apt install -y gnome-tweaks
gsettings set org.gnome.desktop.interface gtk-enable-primary-paste false  # пример фикса
QT_QPA_PLATFORMTHEME=gtk2 legacy-qt-app   # запуск с переменной окружения
```

Отключение композиции рабочего стола

Композиция влияет на приложения с OpenGL 1.x. Для GNOME достаточно отключить анимации:

```bash
gsettings set org.gnome.desktop.interface enable-animations false
```

Для Xfce:

```bash
xfconf-query -c xfwm4 -p /general/use_compositing -s false
```

Отключение HiDPI-масштабирования

```bash
gsettings set org.gnome.desktop.interface scaling-factor 1
xrandr --dpi 96   # стандартный DPI
```

> **Итог**: таким образом ПО адаптировано под реальные задачи компании, дружит с внешними системами и стабильно работает даже в нестандартных графических режимах.

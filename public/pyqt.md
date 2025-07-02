# Мониторинг серверов: Prometheus + Grafana + Node Exporter

## 1. Установка Ansible (опционально)

```bash
sudo apt update
sudo apt install -y ansible
```

## 2. Установка Prometheus

### 2.1 Скачивание и распаковка
```bash
wget https://github.com/prometheus/prometheus/releases/download/v2.30.3/prometheus-2.30.3.linux-amd64.tar.gz
tar xvfz prometheus-*.tar.gz
cd prometheus-*
```

### 2.2 Тестовый запуск
```bash
./prometheus --config.file=prometheus.yml
```

### 2.3 Перемещение и создание пользователя
```bash
sudo mv prometheus-2.30.3.linux-amd64 /opt/prometheus
sudo useradd --no-create-home --shell /bin/false prometheus
sudo mkdir /etc/prometheus
sudo mkdir /var/lib/prometheus
```

### 2.4 Копирование конфигов и смена владельца
```bash
sudo cp /opt/prometheus/prometheus.yml /etc/prometheus/
sudo cp /opt/prometheus/consoles /etc/prometheus/ -r
sudo cp /opt/prometheus/console_libraries /etc/prometheus/ -r
sudo chown -R prometheus:prometheus /etc/prometheus /var/lib/prometheus
sudo chown -R prometheus:prometheus /opt/prometheus
```

### 2.5 Создание systemd-сервиса
Создайте файл `/etc/systemd/system/prometheus.service`:

```ini
[Unit]
Description=Prometheus Monitoring
Wants=network-online.target
After=network-online.target

[Service]
User=prometheus
Group=prometheus
Type=simple
ExecStart=/opt/prometheus/prometheus \
  --config.file=/etc/prometheus/prometheus.yml \
  --storage.tsdb.path=/var/lib/prometheus \
  --web.console.templates=/etc/prometheus/consoles \
  --web.console.libraries=/etc/prometheus/console_libraries

[Install]
WantedBy=multi-user.target
```

### 2.6 Запуск и автозапуск
```bash
sudo systemctl daemon-reexec
sudo systemctl daemon-reload
sudo systemctl enable prometheus
sudo systemctl start prometheus
sudo systemctl status prometheus
```

## 3. Установка Grafana

```bash
sudo apt-get install -y apt-transport-https software-properties-common wget gpg
wget https://dl.grafana.com/oss/release/grafana_10.4.2_amd64.deb
sudo dpkg -i grafana_10.4.2_amd64.deb
sudo apt-get install -f
sudo systemctl start grafana-server
sudo systemctl enable grafana-server
```

- Откройте браузер: [http://localhost:3000](http://localhost:3000)
- По умолчанию:
  - Логин: **admin**
  - Пароль: **admin** (при первом входе потребуется сменить)

## 4. Установка Node Exporter

```bash
cd ~
wget https://github.com/prometheus/node_exporter/releases/download/v1.3.1/node_exporter-1.3.1.linux-amd64.tar.gz
tar -xvf node_exporter-*.tar.gz
cd node_exporter-*
./node_exporter &
```

## 5. Настройка Prometheus для сбора метрик

Откройте `/etc/prometheus/prometheus.yml` и добавьте:

```yaml
scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  - job_name: 'node_exporter'
    static_configs:
      - targets: ['localhost:9100']
```

Перезапустите Prometheus:
```bash
sudo systemctl restart prometheus
```

## 6. Вспомогательные инструменты

### 6.1 Виртуализация
```bash
sudo apt install -y qemu-kvm libvirt-daemon-system virt-manager
virsh list --all
```

### 6.2 Резервное копирование (Timeshift)
```bash
sudo apt install -y timeshift
sudo timeshift --create --comments "Initial backup" --tags D
```

---

## Быстрый порядок действий
1. Установите Prometheus и Node Exporter
2. Настройте Prometheus для сбора метрик
3. Установите и запустите Grafana
4. Добавьте Prometheus как источник данных в Grafana
5. Импортируйте или создайте дашборды для мониторинга

---

**Теперь у вас есть современный стек мониторинга для Linux-сервера!**

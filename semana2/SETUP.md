# Instrucciones de Configuración de PostgreSQL

## El problema
El servidor PostgreSQL está corriendo pero el acceso con contraseña no está configurado correctamente.

## Solución: Configurar PostgreSQL

### Paso 1: Editar pg_hba.conf para permitir acceso por contraseña

Abre una terminal y ejecuta:

```bash
sudo nano /etc/postgresql/16/main/pg_hba.conf
```

Busca las líneas que dicen:
```
local   all             postgres                                peer
local   all             all                                     peer
```

Y cámbialas a:
```
local   all             postgres                                md5
local   all             all                                     md5
```

También busca y cambia:
```
host    all             all             127.0.0.1/32            scram-sha-256
```

### Paso 2: Editar postgresql.conf para escuchar en localhost

```bash
sudo nano /etc/postgresql/16/main/postgresql.conf
```

Busca la línea:
```
#listen_addresses = 'localhost'
```

Y cámbiala a:
```
listen_addresses = 'localhost'
```

### Paso 3: Reiniciar PostgreSQL

```bash
sudo systemctl restart postgresql
```

### Paso 4: Establecer contraseña para postgres

```bash
sudo -u postgres psql
```

En el prompt de psql, escribe:
```sql
ALTER USER postgres PASSWORD 'postgres';
\q
```

### Paso 5: Probar la conexión

```bash
psql -h localhost -U postgres -W
```

Cuando pida la contraseña, ingresa: `postgres`

## Alternativa: Si prefieres usar tu usuario

```bash
sudo -u postgres createuser -s antonio
sudo -u postgres psql
```

```sql
ALTER USER antonio PASSWORD 'antonio';
\q
```

Luego actualiza el archivo `.env`:
```
DB_USER=antonio
DB_PASSWORD=antonio
```

## Después de configurar

1. Copia el archivo de configuración:
```bash
cp .env.example .env
```

2. Ejecuta el script SQL directamente:
```bash
psql -U postgres -f src/scripts/database.sql
```

O inicia el servidor API:
```bash
npm start
```


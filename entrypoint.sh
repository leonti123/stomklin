Set-Content "C:\Users\Леонтий\Desktop\Новая папка (6)\stomklin\entrypoint.sh" @"
#!/bin/bash
/opt/mssql/bin/sqlservr &
echo "Ждём запуска SQL Server..."
sleep 30
/opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "StrongPass123!" -No -C -i /init.sql
echo "База данных инициализирована!"
wait
"@

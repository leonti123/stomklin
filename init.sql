Set-Content "C:\Users\Леонтий\Desktop\Новая папка (6)\stomklin\init.sql" @"
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'DentaPlus2')
BEGIN
    CREATE DATABASE DentaPlus2;
END
GO

USE DentaPlus2;
GO

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Rols')
BEGIN
    -- таблицы создадутся через миграции
    RETURN;
END
GO

IF NOT EXISTS (SELECT * FROM Rols)
BEGIN
    INSERT INTO Rols (name) VALUES 
        (N'Пациент'),
        (N'Врач'),
        (N'Администратор'),
        (N'Руководство');
END
GO

IF NOT EXISTS (SELECT * FROM Users)
BEGIN
    INSERT INTO Users (name, email, phone_number, address, role_id, password_hash, date_of_birth) VALUES 
        (N'Администратор', 'admin@dental.ru', '+79000000000', N'г. Москва', 3, '240BE518FABD2724DDB6F04EEB1DA5967448D7E831C08C8FA822809F74C720A9', NULL),
        (N'Руководитель', 'boss@dental.ru', '+79009999999', N'г. Москва', 4, '240BE518FABD2724DDB6F04EEB1DA5967448D7E831C08C8FA822809F74C720A9', NULL),
        (N'Иванов Иван Иванович', 'doctor@dental.ru', '+79001111111', N'г. Москва', 2, 'F348D5628621F3D8F59C8CABDA0F8EB0AA7E0514A90BE7571020B1336F26C113', '1980-05-15'),
        (N'Петров Пётр Петрович', 'patient@dental.ru', '+79002222222', N'г. Москва', 1, 'D4587EA9EAD060C13FD994F21ECFA7926272A78854A2C20136B10A3C9E53E71E', '1990-03-20');
END
GO

IF NOT EXISTS (SELECT * FROM Procedurs)
BEGIN
    INSERT INTO Procedurs (name, price) VALUES 
        (N'Чистка зубов', 2500),
        (N'Пломбирование', 3500),
        (N'Удаление зуба', 2000),
        (N'Отбеливание', 5000),
        (N'Рентген', 800);
END
GO
"@
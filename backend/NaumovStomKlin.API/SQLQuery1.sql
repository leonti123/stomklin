-- 1. Сначала удаляем связующую таблицу (многие-ко-многим)
DELETE FROM appointment_procedure;

-- 2. Затем удаляем записи, так как они ссылаются на пользователей
DELETE FROM Appointments;

-- 3. Теперь можно удалить пользователей
DELETE FROM Users;

-- 4. В последнюю очередь удаляем роли
DELETE FROM Roles;
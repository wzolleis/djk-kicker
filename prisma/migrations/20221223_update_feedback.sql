/**
    Das Skript muss manuell ausgeführt werden, damit die Spalte status in <Int / Default 0> umgewandelt werden kann.
 */
update Feedback set status = 0 where status is null;
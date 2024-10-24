sudo apt install mysql systemctl
sudo systemctl mysql run
mysql connect localhost root
mysql execute CREATE DATABASE COWSLAU
mysql execute USE COWSLAU
mysql execute CREATE TABLE COWENTRY ( id INT PRIMARY KEY, dateImg TIMESTAMP DEFAULT CURRENT_TIMESTAMP, cowCount INT NOT NULL DEFAULT 0)
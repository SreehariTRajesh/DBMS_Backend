create table blood(b_id int primary key auto_increment,d_id int,date_of_collectoion date,Rh varchar(1),volume float, blood_group varchar(3),foreign key d_id references donor(d_id));

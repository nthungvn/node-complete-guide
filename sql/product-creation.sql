create table products (
  id int unsigned not null auto_increment,
  title varchar(255) not null,
  imageUrl varchar(255) not null,
  price double not null,
  description text,
  primary key (id)
);

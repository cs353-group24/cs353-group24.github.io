

CREATE TABLE person (
  national_id INT  NOT NULL,
  name varchar ( 20 ) NOT NULL,
  surname varchar ( 20 ) NOT NULL,
  email varchar ( 20 ) NOT NULL,
  password INT  NOT NULL,
  person_type varchar ( 10 ) NOT NULL,
  phone varchar ( 20 ) NOT NULL,
  birthday date NOT NULL,
  PRIMARY KEY (national_id)
);


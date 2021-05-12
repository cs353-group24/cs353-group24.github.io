--types
CREATE TYPE test_status AS ENUM ('assigned', 'preparing', 'finalized');
CREATE TYPE app_status AS ENUM ( 'upcoming','waiting-tests', 'finalized');
CREATE TYPE person_type as ENUM ('patient', 'doctor', 'laboratorian','pharmacist' );
CREATE TYPE presc_type as ENUM ('waiting', 'filled');
-- create enums for doctors, laboratorians -> department -> room no will be incremented

--tables
CREATE TABLE person (
    national_id int ,
    name varchar ,
    surname varchar ,
    email varchar UNIQUE ,
    password int ,
    person_type person_type,
    phone varchar ,
    birthday date CHECK (birthday <= current_date ) DEFAULT current_date ,
    PRIMARY KEY (national_id)
);

CREATE TABLE doctor (
    national_id int ,
    room_no int ,
    department varchar ,
    PRIMARY KEY (national_id)

 );

CREATE TABLE appointment (
  appointment_id serial ,
  date date CHECK (date >= current_date ) DEFAULT current_date ,
  status app_status DEFAULT 'upcoming',
  patient_id int ,
  doctor_id int ,
  PRIMARY KEY (appointment_id) ,
  UNIQUE (date, patient_id) ,
  UNIQUE (date, doctor_id)
  );


CREATE TABLE department (
  name varchar ,
  date_est date CHECK (date_est <= current_date ) DEFAULT current_date ,
  building varchar ,
  PRIMARY KEY (name)
);

CREATE TABLE diagnosis (
  appointment_id int ,
  disease_name varchar ,
  description text ,
  PRIMARY KEY (appointment_id,disease_name)

  );

CREATE TABLE disease (
  name varchar ,
  description text ,
  PRIMARY KEY (name)
);

CREATE TABLE disease_symptoms (
  disease_name varchar ,
  symptom_name varchar ,
  PRIMARY KEY (disease_name,symptom_name)

  );



CREATE TABLE laboratorian (
  national_id int ,
  department varchar ,
  PRIMARY KEY (national_id)
  );

CREATE TABLE medicine (
  name varchar ,
  manufacturer varchar ,
  pharmacist_id int ,
  stock int DEFAULT 0,
  PRIMARY KEY (name)
  );

CREATE TABLE patient (
  national_id int ,
  PRIMARY KEY (national_id)
  );

CREATE TABLE patient_symptoms (
  appointment_id int ,
  symptom_name varchar ,
  PRIMARY KEY (symptom_name,appointment_id)
  );

CREATE TABLE pharmacist (
  national_id int ,
  PRIMARY KEY (national_id)
  );

CREATE TABLE prescribed_by (
  prescription_no int ,
  appointment_id int ,
  PRIMARY KEY (prescription_no)
  );

CREATE TABLE prescribed_in (
  prescription_no int ,
  med_name varchar ,
  qty int ,
  usage_method text ,
  PRIMARY KEY (prescription_no,med_name)
  );

CREATE TABLE prescription (
  prescription_no serial ,
  prescription_type varchar ,
  date date ,
  status presc_type DEFAULT 'waiting',
  PRIMARY KEY (prescription_no)
);

CREATE TABLE test_result (
  test_name varchar ,
  result_id serial ,
  result_date date  DEFAULT current_date,
  appointment_id int ,
  test_status test_status DEFAULT 'assigned',
  PRIMARY KEY (result_id)
  );

CREATE TABLE comp_result (
    result_id int,
    comp_name varchar,
    comp_value varchar,
    comp_result varchar DEFAULT NULL,
    comp_status test_status  DEFAULT 'assigned',
    PRIMARY KEY (result_id, comp_name)
);

CREATE TABLE component (
   test_name varchar,
   comp_name varchar UNIQUE ,
   upper_normality_interval int DEFAULT NULL,
   lower_normality_interval int DEFAULT NULL,
   PRIMARY KEY (test_name,comp_name)
);


CREATE TABLE symptom (
  name varchar ,
  description text ,
  PRIMARY KEY (name)
);

CREATE TABLE test (
  test_name varchar ,
  department varchar,
  PRIMARY KEY (test_name)
);

CREATE TABLE test_assigned_to (
  appointment_id int ,
  laboratorian_id int ,
  test_name varchar ,
  date date DEFAULT current_date,
  PRIMARY KEY (appointment_id,laboratorian_id,test_name)
  );

CREATE TABLE doctor_off_days (
    doctor_id int,
    date date,
    PRIMARY KEY (doctor_id,date)
);

CREATE TABLE prescription_assigned_to (
    pharmacist_id int ,
    prescription_no int ,
    PRIMARY KEY (pharmacist_id,prescription_no)
);

--- foreign-key constraints
ALTER TABLE doctor
    ADD CONSTRAINT doctor_person FOREIGN KEY (national_id) REFERENCES person (national_id) ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT doctor_department FOREIGN KEY (department) REFERENCES department (name) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE appointment
    ADD CONSTRAINT appointment_doctor FOREIGN KEY (doctor_id) REFERENCES doctor (national_id) ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT appointment_patient FOREIGN KEY (patient_id) REFERENCES patient (national_id) ON DELETE CASCADE ON UPDATE CASCADE;
 /*
ALTER TABLE appointment
    ADD UNIQUE (date, patient_id)
    ADD UNIQUE (date, doctor_id)
 */
ALTER TABLE component
    ADD CONSTRAINT component_test FOREIGN KEY (test_name) REFERENCES test (test_name) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE diagnosis
    ADD CONSTRAINT diagnosis_appointment FOREIGN KEY (appointment_id) REFERENCES appointment (appointment_id) ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT diagnosis_disease FOREIGN KEY (disease_name) REFERENCES disease (name) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE disease_symptoms
    ADD CONSTRAINT disease_symptoms_disease FOREIGN KEY (disease_name) REFERENCES disease (name) ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT disease_symptoms_symptom FOREIGN KEY (symptom_name) REFERENCES symptom (name) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE laboratorian
    ADD CONSTRAINT laboratorian_person FOREIGN KEY (national_id) REFERENCES person (national_id) ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT laboratorian_department FOREIGN KEY (department) REFERENCES department (name) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE medicine
    ADD CONSTRAINT medicine_pharmacist FOREIGN KEY (pharmacist_id) REFERENCES pharmacist (national_id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE patient
    ADD CONSTRAINT patient_person FOREIGN KEY (national_id) REFERENCES person (national_id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE patient_symptoms
    ADD CONSTRAINT patient_symptoms_appointment FOREIGN KEY (appointment_id) REFERENCES appointment (appointment_id) ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT patient_symptoms_symptom FOREIGN KEY (symptom_name) REFERENCES symptom (name) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE pharmacist
    ADD CONSTRAINT pharmacist_person FOREIGN KEY (national_id) REFERENCES person (national_id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE prescribed_by
    ADD CONSTRAINT prescribed_by_appointment FOREIGN KEY (appointment_id) REFERENCES appointment (appointment_id) ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT prescribed_by_prescription FOREIGN KEY (prescription_no) REFERENCES prescription (prescription_no) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE prescribed_in
    ADD CONSTRAINT prescribed_in_medicine FOREIGN KEY (med_name) REFERENCES medicine (name) ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT prescribed_in_prescription FOREIGN KEY (prescription_no) REFERENCES prescription (prescription_no) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE test_result
    ADD CONSTRAINT result_component FOREIGN KEY (test_name) REFERENCES test (test_name) ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT result_appointment FOREIGN KEY (appointment_id) REFERENCES appointment (appointment_id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE test_assigned_to
    ADD CONSTRAINT test_assigned_to_appointment FOREIGN KEY (appointment_id) REFERENCES appointment (appointment_id) ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT test_assigned_to_laboratorian FOREIGN KEY (laboratorian_id) REFERENCES laboratorian (national_id) ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT test_assigned_to_test FOREIGN KEY (test_name) REFERENCES test (test_name) ON DELETE CASCADE ON UPDATE CASCADE;


ALTER TABLE doctor_off_days
    ADD CONSTRAINT doctor_off_days_doctor FOREIGN KEY (doctor_id) REFERENCES doctor (national_id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE test
    ADD CONSTRAINT test_department FOREIGN KEY (department) REFERENCES department (name) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE comp_result
    ADD CONSTRAINT comp_name FOREIGN KEY (comp_name) REFERENCES component (comp_name) ON DELETE CASCADE ON UPDATE CASCADE,
     ADD CONSTRAINT comp_result_id FOREIGN KEY (result_id) REFERENCES test_result (result_id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE prescription_assigned_to
    ADD CONSTRAINT presc_pharma FOREIGN KEY (pharmacist_id) REFERENCES pharmacist (national_id) ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT presc_presc FOREIGN KEY (prescription_no) REFERENCES prescription (prescription_no) ON DELETE CASCADE ON UPDATE CASCADE;
/*
create triggers and functions for insertion into patient, doctor, laboratorian and pharmacist  tables
to make insert additional values
*/

/*
    -> When a test added to test_assigned_to relation add create a test result
    for it in the test result relationship and create component results for its components
 */
--- functions
CREATE or REPLACE FUNCTION insert1()
returns trigger
as $$
BEGIN

    IF NEW.person_type = 'patient' THEN
    INSERT INTO patient  (national_id)
     VALUES (NEW.national_id);
    END IF;

/*
     IF NEW.person_type = 'doctor' THEN
    INSERT INTO doctor  (national_id)
     VALUES (NEW.national_id);
    END IF;
    IF NEW.person_type = 'laboratorian' THEN
        INSERT INTO laboratorian  (national_id)
     VALUES (NEW.national_id);
    END IF;
    IF NEW.person_type = 'pharmacist' THEN
   INSERT INTO pharmacist (national_id)
     VALUES (NEW.national_id);
    END IF;
*/

RETURN NEW;
END;
$$
LANGUAGE 'plpgsql';




CREATE or REPLACE FUNCTION insert2()
returns trigger
as $$
BEGIN

    INSERT INTO test_result (test_name, appointment_id)
    VALUES (NEW.test_name, NEW.appointment_id);

RETURN NEW;
END;
$$
LANGUAGE 'plpgsql';


CREATE or REPLACE FUNCTION insert3()
returns trigger
as $$
BEGIN

INSERT INTO comp_result (result_id, comp_name)
    SELECT t.result_id, c.comp_name
        FROM test_result t, component c
            WHERE result_id = NEW.result_id and t.test_name = c.test_name;

RETURN NEW;
END;
$$
LANGUAGE 'plpgsql';

CREATE or REPLACE FUNCTION delete1()
returns trigger
as $$
BEGIN

DELETE FROM test_result
    WHERE appointment_id = OLD.appointment_id and test_name = OLD.test_name;
RETURN OLD;
END;
$$
LANGUAGE 'plpgsql';


CREATE or REPLACE FUNCTION update1()
returns trigger
as $$
BEGIN

UPDATE medicine
SET stock = stock - NEW.qty
WHERE name = NEW.med_name;

RETURN NEW;
END;
$$
LANGUAGE 'plpgsql';

--- trigers

CREATE TRIGGER  addition1
    AFTER INSERT ON person
    FOR EACH  ROW
    EXECUTE PROCEDURE insert1();

CREATE TRIGGER  addition2
    AFTER INSERT ON test_assigned_to
    FOR EACH  ROW
    EXECUTE PROCEDURE insert2();

CREATE TRIGGER addition3
     AFTER INSERT ON test_result
    FOR EACH  ROW
    EXECUTE PROCEDURE insert3();

CREATE TRIGGER deletion1
    BEFORE DELETE ON test_assigned_to
    FOR EACH  ROW
    EXECUTE PROCEDURE delete1();

CREATE TRIGGER update1
    BEFORE UPDATE ON prescribed_in
    FOR EACH  ROW
    EXECUTE PROCEDURE update1();
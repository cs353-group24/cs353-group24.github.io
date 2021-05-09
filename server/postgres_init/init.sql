
--types
CREATE TYPE test_status AS ENUM ('assigned', 'preparing', 'finalized');
CREATE TYPE app_status AS ENUM ( 'upcoming','waiting-tests', 'finalized');
CREATE TYPE person_type as ENUM ('patient', 'doctor', 'laboratorian','pharmacist' );

-- create enums for doctors, laboratorians -> depratment -> room no will be incremented

--tables
CREATE TABLE person (
    national_id int ,
    name varchar ,
    surname varchar ,
    email varchar ,
    password int ,
    person_type person_type,
    phone varchar ,
    birthday date ,
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
  date date ,
  status app_status DEFAULT 'waiting-tests',
  patient_id int ,
  doctor_id int ,
  PRIMARY KEY (appointment_id)

  );

CREATE TABLE component (
  test_name varchar ,
  comp_name varchar ,
  upper_normality_interval int DEFAULT NULL,
  lower_normality_interval int DEFAULT NULL,
  PRIMARY KEY (test_name,comp_name)
  );

CREATE TABLE department (
  name varchar ,
  date_est date ,
  building varchar ,
  PRIMARY KEY (name)
);

CREATE TABLE diagnosis (
  apt_tracking_no int ,
  disease_name varchar ,
  description text ,
  PRIMARY KEY (apt_tracking_no,disease_name)

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
  PRIMARY KEY (name)
  );

CREATE TABLE patient (
  national_id int ,
  PRIMARY KEY (national_id)
  );

CREATE TABLE patient_symptoms (
  apt_tracking_no int ,
  symptom_name varchar ,
  PRIMARY KEY (symptom_name,apt_tracking_no)
  );

CREATE TABLE pharmacist (
  national_id int ,
  PRIMARY KEY (national_id)
  );

CREATE TABLE prescribed_by (
  prescription_no int ,
  apt_tracking_no int ,
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
  PRIMARY KEY (prescription_no)
);

CREATE TABLE result (
  test_name varchar ,
  comp_name varchar ,
  result_id serial ,
  result_date timestamp  DEFAULT current_timestamp,
  appointment_id int ,
  test_comp_value varchar ,
  test_comp_result varchar DEFAULT NULL,
  status test_status DEFAULT 'assigned',
  PRIMARY KEY (result_id)
  );

CREATE TABLE symptom (
  name varchar ,
  description text ,
  PRIMARY KEY (name)
);

CREATE TABLE test (
  test_name varchar ,
  PRIMARY KEY (test_name)
);

CREATE TABLE test_performed_by (
  apt_tracking_no int ,
  laboratorian_id int ,
  test_name varchar ,
  PRIMARY KEY (apt_tracking_no,laboratorian_id,test_name)
  );

CREATE TABLE doctor_off_days (
    doctor_id int,
    date date,
    PRIMARY KEY (doctor_id,date)
);

--- foreign-key constraints
ALTER TABLE doctor
    ADD CONSTRAINT doctor_person FOREIGN KEY (national_id) REFERENCES person (national_id) ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT doctor_department FOREIGN KEY (department) REFERENCES department (name) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE appointment
    ADD CONSTRAINT appointment_doctor FOREIGN KEY (doctor_id) REFERENCES doctor (national_id) ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT appointment_patient FOREIGN KEY (patient_id) REFERENCES patient (national_id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE component
    ADD CONSTRAINT component_test FOREIGN KEY (test_name) REFERENCES test (test_name) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE diagnosis
    ADD CONSTRAINT diagnosis_appointment FOREIGN KEY (apt_tracking_no) REFERENCES appointment (appointment_id) ON DELETE CASCADE ON UPDATE CASCADE,
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
    ADD CONSTRAINT patient_symptoms_appointment FOREIGN KEY (apt_tracking_no) REFERENCES appointment (appointment_id) ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT patient_symptoms_symptom FOREIGN KEY (symptom_name) REFERENCES symptom (name) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE pharmacist
    ADD CONSTRAINT pharmacist_person FOREIGN KEY (national_id) REFERENCES person (national_id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE prescribed_by
    ADD CONSTRAINT prescribed_by_appointment FOREIGN KEY (apt_tracking_no) REFERENCES appointment (appointment_id) ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT prescribed_by_prescription FOREIGN KEY (prescription_no) REFERENCES prescription (prescription_no) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE prescribed_in
    ADD CONSTRAINT prescribed_in_medicine FOREIGN KEY (med_name) REFERENCES medicine (name) ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT prescribed_in_prescription FOREIGN KEY (prescription_no) REFERENCES prescription (prescription_no) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE result
    ADD CONSTRAINT result_component FOREIGN KEY (test_name,comp_name) REFERENCES component (test_name, comp_name) ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT result_appointment FOREIGN KEY (appointment_id) REFERENCES appointment (appointment_id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE test_performed_by
    ADD CONSTRAINT test_performed_by_appointment FOREIGN KEY (apt_tracking_no) REFERENCES appointment (appointment_id) ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT test_performed_by_laboratorian FOREIGN KEY (laboratorian_id) REFERENCES laboratorian (national_id) ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT test_performed_by_test FOREIGN KEY (test_name) REFERENCES test (test_name) ON DELETE CASCADE ON UPDATE CASCADE;


ALTER TABLE doctor_off_days
    ADD CONSTRAINT doctor_off_days_doctor FOREIGN KEY (doctor_id) REFERENCES doctor (national_id) ON DELETE CASCADE ON UPDATE CASCADE;

/*
create triggers and functions for insertion into patient, doctor, laboratorian and pharmacist  tables
to make insert additional values
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

--- trigers

CREATE TRIGGER  addition
    AFTER INSERT ON person
    FOR EACH  ROW
    EXECUTE PROCEDURE insert1();


    /*

     */
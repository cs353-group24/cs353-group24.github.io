
CREATE TABLE person (
    national_id int NOT NULL,
    name varchar NOT NULL,
    surname varchar NOT NULL,
    email varchar NOT NULL,
    password int NOT NULL,
    person_type varchar NOT NULL,
    phone varchar NOT NULL,
    birthday date NOT NULL,
    PRIMARY KEY (national_id)
);

CREATE TABLE doctor (
    national_id int NOT NULL,
    room_no int NOT NULL,
    department varchar NOT NULL,
    PRIMARY KEY (national_id)

    );

CREATE TABLE appointment (
  tracking_number serial NOT NULL,
  date date NOT NULL,
  status varchar NOT NULL,
  patient_id int NOT NULL,
  doctor_id int NOT NULL,
  PRIMARY KEY (tracking_number)

  );

CREATE TABLE component (
  test_name varchar NOT NULL,
  comp_name varchar NOT NULL,
  upper_normality_interval int DEFAULT NULL,
  lower_normality_interval int DEFAULT NULL,
  PRIMARY KEY (test_name,comp_name)
  );

CREATE TABLE department (
  name varchar NOT NULL,
  date_est date NOT NULL,
  building varchar NOT NULL,
  PRIMARY KEY (name)
);

CREATE TABLE diagnosis (
  apt_tracking_no int NOT NULL,
  disease_name varchar NOT NULL,
  description text NOT NULL,
  PRIMARY KEY (apt_tracking_no,disease_name)

  );

CREATE TABLE disease (
  name varchar NOT NULL,
  description text NOT NULL,
  PRIMARY KEY (name)
);

CREATE TABLE disease_symptoms (
  disease_name varchar NOT NULL,
  symptom_name varchar NOT NULL,
  PRIMARY KEY (disease_name,symptom_name)

  );



CREATE TABLE laboratorian (
  national_id int NOT NULL,
  department varchar NOT NULL,
  PRIMARY KEY (national_id)

  );

CREATE TABLE medicine (
  name varchar NOT NULL,
  manufacturer varchar NOT NULL,
  pharmacist_id int NOT NULL,
  PRIMARY KEY (name)
  );

CREATE TABLE patient (
  national_id int NOT NULL,
  PRIMARY KEY (national_id)
  );

CREATE TABLE patient_symptoms (
  apt_tracking_no int NOT NULL,
  symptom_name varchar NOT NULL,
  PRIMARY KEY (symptom_name,apt_tracking_no)
  );

CREATE TABLE pharmacist (
  national_id int NOT NULL,
  PRIMARY KEY (national_id)
  );

CREATE TABLE prescribed_by (
  prescription_no int NOT NULL,
  apt_tracking_no int NOT NULL,
  PRIMARY KEY (prescription_no)
  );

CREATE TABLE prescribed_in (
  prescription_no int NOT NULL,
  med_name varchar NOT NULL,
  qty int NOT NULL,
  usage_method text NOT NULL,
  PRIMARY KEY (prescription_no,med_name)
  );

CREATE TABLE prescription (
  prescription_no serial NOT NULL,
  prescription_type varchar NOT NULL,
  date date NOT NULL,
  PRIMARY KEY (prescription_no)
);

CREATE TABLE result (
  test_name varchar NOT NULL,
  comp_name varchar NOT NULL,
  result_id serial NOT NULL,
  result_date timestamp NOT NULL DEFAULT current_timestamp,
  tracking_number int NOT NULL,
  test_comp_value varchar NOT NULL,
  test_comp_result varchar DEFAULT NULL,
  status varchar NOT NULL,
  PRIMARY KEY (result_id)
  );

CREATE TABLE symptom (
  name varchar NOT NULL,
  description text NOT NULL,
  PRIMARY KEY (name)
);

CREATE TABLE test (
  test_name varchar NOT NULL,
  PRIMARY KEY (test_name)
);

CREATE TABLE test_performed_by (
  apt_tracking_no int NOT NULL,
  laboratorian_id int NOT NULL,
  test_name varchar NOT NULL,
  PRIMARY KEY (apt_tracking_no,laboratorian_id,test_name)
  );



ALTER TABLE doctor
    ADD CONSTRAINT doctor_person FOREIGN KEY (national_id) REFERENCES person (national_id) ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT doctor_department FOREIGN KEY (department) REFERENCES department (name) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE appointment
    ADD CONSTRAINT appointment_doctor FOREIGN KEY (doctor_id) REFERENCES doctor (national_id) ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT appointment_patient FOREIGN KEY (patient_id) REFERENCES patient (national_id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE component
    ADD CONSTRAINT component_test FOREIGN KEY (test_name) REFERENCES test (test_name) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE diagnosis
    ADD CONSTRAINT diagnosis_appointment FOREIGN KEY (apt_tracking_no) REFERENCES appointment (tracking_number) ON DELETE CASCADE ON UPDATE CASCADE,
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
    ADD CONSTRAINT patient_symptoms_appointment FOREIGN KEY (apt_tracking_no) REFERENCES appointment (tracking_number) ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT patient_symptoms_symptom FOREIGN KEY (symptom_name) REFERENCES symptom (name) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE pharmacist
    ADD CONSTRAINT pharmacist_person FOREIGN KEY (national_id) REFERENCES person (national_id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE prescribed_by
    ADD CONSTRAINT prescribed_by_appointment FOREIGN KEY (apt_tracking_no) REFERENCES appointment (tracking_number) ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT prescribed_by_prescription FOREIGN KEY (prescription_no) REFERENCES prescription (prescription_no) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE prescribed_in
    ADD CONSTRAINT prescribed_in_medicine FOREIGN KEY (med_name) REFERENCES medicine (name) ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT prescribed_in_prescription FOREIGN KEY (prescription_no) REFERENCES prescription (prescription_no) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE result
    ADD CONSTRAINT result_component FOREIGN KEY (test_name,comp_name) REFERENCES component (test_name, comp_name) ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT result_appointment FOREIGN KEY (tracking_number) REFERENCES appointment (tracking_number) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE test_performed_by
    ADD CONSTRAINT test_performed_by_appointment FOREIGN KEY (apt_tracking_no) REFERENCES appointment (tracking_number) ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT test_performed_by_laboratorian FOREIGN KEY (laboratorian_id) REFERENCES laboratorian (national_id) ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT test_performed_by_test FOREIGN KEY (test_name) REFERENCES test (test_name) ON DELETE CASCADE ON UPDATE CASCADE;

-- COMMIT;
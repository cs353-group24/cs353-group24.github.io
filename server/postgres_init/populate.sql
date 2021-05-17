
-- 2 pharmacist, 4 patient, 3 doctors, 3 laboratorian
INSERT INTO person (national_id, name, surname, email, password, person_type, phone, birthday) VALUES
(1111, 'mannan', 'abdul', 'mannan@gmail.com', 112233, 'patient', '+905536644231', to_date('2000-07-01', 'YYYY-MM-DD')),
(2222, 'mohlaroyim', 'raupova', 'mohi@sucks.com', 223344, 'doctor', '+925984569115', to_date('2000-07-01', 'YYYY-MM-DD')),
(3333, 'arnisa', 'fazla', 'fazla@gmail.com', 334455, 'laboratorian', '+905536644233', to_date('2000-07-01', 'YYYY-MM-DD')),
(4444, 'atakan', 'aray', 'atakan@gmail.com', 445566, 'doctor', '+905325425145', to_date('2000-07-01', 'YYYY-MM-DD')),
(5555, 'joyner', 'lucas', 'joyner@outlook.com', 556677, 'pharmacist', '+906451354875', to_date('2000-07-01', 'YYYY-MM-DD')),
(6666, 'david', 'davenport', 'david@outlook.com', 667788, 'laboratorian', '+906451354875', to_date('2000-07-01', 'YYYY-MM-DD')),
(7777, 'name', 'surname', 'admin@gmail.com', 667788, 'admin', '+906451354875', to_date('2000-07-01', 'YYYY-MM-DD')),
(8888, 'james', 'smith', 'smith@gmail.com', 113355, 'patient', '+905536684331', to_date('2000-07-01', 'YYYY-MM-DD')),
(9999, 'jane', 'doe', 'janedoe@gmail.com', 335577, 'patient', '+905585694231', to_date('2000-07-01', 'YYYY-MM-DD')),
(1122, 'james', 'bond', '007@outlook.com', 224466, 'pharmacist', '+906456374875', to_date('2000-07-01', 'YYYY-MM-DD')),
(2233, 'nathan', 'drake', 'drake@gmail.com', 446688, 'doctor', '+905627485145', to_date('2000-07-01', 'YYYY-MM-DD')),
(3344, 'solid', 'snake', 'snake@gmail.com', 668800, 'laboratorian', '+906451354875', to_date('2000-07-01', 'YYYY-MM-DD'));


INSERT INTO department (name, date_est, building) VALUES
('Oncology',to_date('2021-03-01','YYYY-MM-DD') , 'A' ),
('Cardiology',to_date('2021-03-01','YYYY-MM-DD'), 'B' ),
('Gastroenterology', to_date('2021-03-01','YYYY-MM-DD'), 'C'),
('Radiology',to_date('2021-03-01','YYYY-MM-DD'), 'B' ),
('Otolaryngology',to_date('2021-03-01','YYYY-MM-DD'), 'B' );

INSERT INTO pharmacist (national_id) VALUES
(5555),
(1122);

INSERT INTO doctor (national_id, room_no, department) VALUES
(2222, 489, 'Oncology'),
(4444, 302, 'Cardiology'),
(2233, 432, 'Otolaryngology');

INSERT INTO laboratorian (national_id, department) VALUES
(3333, 'Oncology'),
(6666, 'Cardiology'),
(3344, 'Radiology');

INSERT INTO test (test_name, department) VALUES
('blood', 'Cardiology'),
('stones', 'Radiology'),
('x-ray', 'Radiology'),
('urine', 'Oncology');

--
INSERT INTO appointment (date, patient_id, doctor_id) VALUES
(to_date('2021-05-23', 'YYYY-MM-DD'), 1111, 2222),
(to_date('2021-05-30', 'YYYY-MM-DD'), 1111, 4444),
(to_date('2021-05-17', 'YYYY-MM-DD'), 9999, 2222),
(to_date('2021-05-25', 'YYYY-MM-DD'), 1111, 4444),
(to_date('2021-05-17', 'YYYY-MM-DD'), 1111, 4444),
(to_date('2021-06-08', 'YYYY-MM-DD'), 8888, 2222),
(to_date('2021-06-10', 'YYYY-MM-DD'), 9999, 4444),
(to_date('2021-07-16', 'YYYY-MM-DD'), 1111, 2222),
(to_date('2021-04-28', 'YYYY-MM-DD'), 9999, 4444);

--
INSERT INTO prescription (prescription_no, prescription_type, date) VALUES
(9, 'A','2021-04-30' );


INSERT INTO component (test_name, comp_name, upper_normality_interval, lower_normality_interval) VALUES
('blood', 'calcium', 25, 0),
('blood', 'Iron', 50, 0),
('blood', 'Cholestrol', 100, 0),
('blood', 'type', NULL, NULL),
('stones', 'blood in urine', 2, 0),
('stones', 'protein', 3, 0),
('urine', 'blood', 1, 0 ),
('urine', 'sugar', 1, 0),
('x-ray', 'x-ray', NULL, NULL);

--
INSERT INTO prescribed_by (prescription_no, appointment_id) VALUES
(9, 9);


INSERT INTO symptom (name, description) VALUES
('chronic cough', 'can be result of: smoking, chronic bronchitis, common colds, flu, emphysema, dry mouth, asthma, allergies.'),
('heartburn', 'Heartburn occurs when stomach acid backs up into the tube that carries food from your mouth to your stomach (esophagus).'),
('nausea', 'gastrointestinal disorders, food poisoning, motion sickness, dizziness, migraine, fainting, low blood sugar '),
('pain in lower abdomen', 'Crampy pain may be due to gas, indigestion, inflammation or infection, or, in women, from menstrual cramps or endometriosis'),
('vomitting', 'forcefully expelling what''s in your stomach through your mouth'),
('muscle pain', 'pain in muscles'),
('dry cough', 'a cough that does not bring up mucus.'),
('sore throat', 'pain, scratchiness or irritation of the throat that often worsens when you swallow');

--
INSERT INTO test_assigned_to (appointment_id, laboratorian_id, test_name) VALUES
(9, 3, 'stones');


INSERT INTO disease (name, description) VALUES
('flu', 'infectious disease caused by influenza viruses'),
('GERD', 'Gastroesophageal reflux, a digestive disorder that affects the ring of muscle between your esophagus and your stomach'),
('appendicitis', 'painful swelling of appendicit'),
('Covid', 'infectious disease caused by a newly discovered coronavirus.'),
('bronchitis', 'inflammation of the lining of your bronchial tubes, which carry air to and from your lungs');

INSERT INTO disease_symptoms (disease_name, symptom_name) VALUES
('flu', 'chronic cough'),
('GERD', 'chronic cough'),
('GERD', 'heartburn');

/*
INSERT INTO diagnosis (appointment_id, disease_name, description) VALUES
('1', 'GERD','need to drink less coke'),
('2', 'flu', 'weak immunity');
*/

/*
INSERT INTO patient_symptoms (appointment_id, symptom_name) VALUES
('1', 'heartburn'),
('2', 'chronic cough');

 */
--
INSERT INTO doctor_off_days (doctor_id, date) VALUES
('2222', to_date('2021-05-18', 'YYYY-MM-DD')),
('4444', to_date('2021-05-29', 'YYYY-MM-DD')),
('2222', to_date('2021-05-14', 'YYYY-MM-DD')),
('2222', to_date('2021-05-23', 'YYYY-MM-DD')),
('4444', to_date('2021-05-30', 'YYYY-MM-DD')),
('2222', to_date('2021-05-17', 'YYYY-MM-DD')),
('4444', to_date('2021-05-25', 'YYYY-MM-DD')),
('4444', to_date('2021-05-17', 'YYYY-MM-DD')),
('2222', to_date('2021-06-08', 'YYYY-MM-DD')),
('4444', to_date('2021-06-10', 'YYYY-MM-DD')),
('2222', to_date('2021-07-16', 'YYYY-MM-DD'));

INSERT INTO medicine (name, manufacturer,  stock) VALUES
('parol', 'pfizer', 50),
('asprin', 'novartis', 60),
('adderall', 'eczacibasi', 30),
('paracetamol', 'eczacibasi', 40),
('mucinex', 'mucinex', 100),
('remdesivir', 'gilead', 10);

/*
INSERT INTO prescribed_in (prescription_no, med_name, qty, usage_method) VALUES
(3, 'paracetamol', 5, '1 tablet a day'),
(3, 'asprin', 10, '2 tablets a day');
*/

--
INSERT INTO prescription_assigned_to (pharmacist_id, prescription_no) VALUES
(5555, 9);

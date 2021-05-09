

INSERT INTO person (national_id, name, surname, email, password, person_type, phone, birthday) VALUES
(1, 'mannan', 'abdul', 'mannan@gmail.com', 225588, 'patient', '+905536644231', '2021-03-01'),
(2, 'mohlaroyim', 'raupova', 'mohi@sucks.com', 336699, 'doctor', '+925984569115', '2021-02-01'),
(3, 'arnisa', 'fazla', 'fazla@gmail.com', 112233, 'patient', '+905536644233', '2020-12-01');

INSERT INTO department (name, date_est, building) VALUES
('Computer Science','2021-03-01', 'A' );


INSERT INTO pharmacist (national_id) VALUES
(2);


INSERT INTO doctor (national_id, room_no, department) VALUES
(2, 489, 'Computer Science');

INSERT INTO laboratorian (national_id, department) VALUES
(3, 'Computer Science');

INSERT INTO test (test_name) VALUES
('blood'),
('stones'),
('x-ray');

INSERT INTO prescription (prescription_no, prescription_type, date) VALUES
(1, 'A','2021-04-01' ),
(2, 'B', '2021-04-01');


INSERT INTO appointment (appointment_id, date,  patient_id, doctor_id) VALUES
    (1, '2021-04-01',  1, 2),
    (2, '2021-04-01',  1, 2),
    (3, '2021-04-01',  3, 2);

INSERT INTO component (test_name, comp_name, upper_normality_interval, lower_normality_interval) VALUES
    ('blood', 'calcium', 0, 25),
    ('blood', 'Iron', 0, 50),
    ('blood', 'type', NULL, NULL),
    ('stones', 'blood in urine', 0, 2),
    ('stones', 'protien', 0, 3),
    ('x-ray', 'x-ray', NULL, NULL);


INSERT INTO prescribed_by (prescription_no, apt_tracking_no) VALUES
    (1, 1),
    (2, 2);

INSERT INTO result (test_name, comp_name, result_id, result_date, appointment_id, test_comp_value, test_comp_result, status) VALUES
    ('blood', 'calcium', 1, '2021-04-02 00:08:11', 1, '5', 'Normal', 'finalized'),
    ('blood', 'Iron', 2, '2021-04-02 00:08:47', 1, '5', 'Normal', 'finalized'),
    ('blood', 'type', 3, '2021-04-02 00:09:21', 1, 'A-', NULL, 'finalized'),
    ('stones', 'blood in urine', 4, '2021-04-02 00:10:02', 1, '5', 'High', 'finalized'),
    ('stones', 'protien', 5, '2021-04-02 00:10:26', 1, '35', 'You should be dead', 'finalized'),
    ('x-ray', 'x-ray', 6, '2021-04-02 00:10:44', 1, 'Clean', NULL, 'finalized'),
    ('blood', 'calcium', 7, '2021-04-02 00:11:14', 2, '15', 'High', 'finalized'),
    ('blood', 'Iron', 8, '2021-04-02 00:11:39', 2, '35', 'You should be dead', 'finalized'),
    ('blood', 'type', 9, '2021-04-02 00:11:51', 2, 'A-', NULL, 'finalized');


INSERT INTO test_performed_by (apt_tracking_no, laboratorian_id, test_name) VALUES
    (1, 3, 'blood'),
    (1, 3, 'stones'),
    (1, 3, 'x-ray'),
    (2, 3, 'blood');
